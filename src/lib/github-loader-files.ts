import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { summarizeCode, generateEmbedding } from "./gemini-integration";
import { db } from "@/server/db";
import { Octokit } from "octokit";

const getFileCount = async (path: string, octoKit: Octokit, githubOwner: string, githubRepo: string, acc = 0) => {

    const { data } = await octoKit.rest.repos.getContent({ owner: githubOwner, repo: githubRepo, path })
    if (!Array.isArray(data) && data.type === "file") {
        return acc + 1
    }
    if (Array.isArray(data)) {
        let fileCount = 0
        const directories: string[] = []

        for (const item of data) {
            if (item.type === "dir") {
                directories.push(item.path)
            } else if (item.type === "file") {
                fileCount++
            }
        }

        if (directories.length > 0) {
            const directoryCounts = await Promise.all(directories.map(async (dirPath) => {
                return getFileCount(dirPath, octoKit, githubOwner, githubRepo, 0)
            }))
            fileCount += directoryCounts.reduce((acc, item) => acc + item, 0)
        }

        return acc + fileCount
    }
    return acc
}

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
    // Find out how many files are there in the repo

    const octoKit = new Octokit({
        auth: githubToken
    })
    const githubOwner = githubUrl.split("/")[3]
    const githubRepo = githubUrl.split("/")[4]

    if (!githubOwner || !githubRepo) {
        throw new Error("Invalid github url")
    }

    const fileCount = await getFileCount("", octoKit, githubOwner, githubRepo, 0)

    return fileCount
}

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken ?? "",
        branch: "main",
        ignoreFiles: ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb", "Cargo.lock", "go.sum", "composer.lock", "Gemfile.lock", "Pipfile.lock", "poetry.lock"],
        recursive: true, //to see all
        unknown: "warn",
        maxConcurrency: 5
    });

    const docs = await loader.load();
    return docs;
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs); //generate the embeddings
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`Processing ${index} of ${allEmbeddings.length} embeddings`);
        if (!embedding) {
            console.log(`Failed to process ${index} of ${allEmbeddings.length} embeddings`);
            return;
        }
        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                projectId,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                summary: embedding.summary
            }
        })

        // PRISMA supports thuis ok
        await db.$executeRaw`
UPDATE "SourceCodeEmbedding"
SET "summaryEmbedding" = ${embedding.embedding}::vector ---cast it to a vector
WHERE "id" = ${sourceCodeEmbedding.id}
`
    }))
}

// This will generate the embeddings using the Gemini SDK
const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summarizeCode(doc);
        const embedding = await generateEmbedding(summary);
        return {
            summary,
            embedding,
            sourceCode: doc.pageContent,
            fileName: (doc.metadata.source as string) ?? "unknown"
        };
    }));
}
