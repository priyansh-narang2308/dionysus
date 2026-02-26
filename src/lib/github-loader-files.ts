import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { summarizeCode, generateEmbedding } from "./gemini-integration";
import { db } from "@/server/db";
import { Octokit } from "octokit";

// No longer using recursive getFileCount to avoid rate limits
// Using Git Tree API instead in checkCredits

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
    // Find out how many files are there in the repo
    console.log("Checking credits for:", githubUrl)

    const octoKit = new Octokit({
        auth: githubToken === "" ? undefined : githubToken
    })

    // Robust URL parsing: handles https://github.com/owner/repo or owner/repo or with .git/trailing slash
    const cleanUrl = githubUrl.replace(/\/$/, "").replace(/\.git$/, "")
    const urlParts = cleanUrl.split("/")

    const githubRepo = urlParts.pop()
    const githubOwner = urlParts.pop()

    console.log(`Extracted - Owner: ${githubOwner}, Repo: ${githubRepo}`)

    if (!githubOwner || !githubRepo) {
        throw new Error("Invalid github url. Please provide a valid GitHub repository URL.")
    }

    try {
        // First, get the default branch (usually main or master)
        const { data: repoData } = await octoKit.rest.repos.get({
            owner: githubOwner,
            repo: githubRepo
        })

        // Use the Git Tree API with recursive=true to get ALL files in one request
        // tree_sha can be a branch name
        const { data: treeData } = await octoKit.rest.git.getTree({
            owner: githubOwner,
            repo: githubRepo,
            tree_sha: repoData.default_branch,
            recursive: "true"
        })

        // Filter for blobs (files) and skip common ignored directories if necessary
        // but for credit calculation, we usually count all source files.
        const fileCount = treeData.tree.filter(item => item.type === "blob").length

        console.log(`Successfully counted ${fileCount} files for ${githubOwner}/${githubRepo}`)
        return fileCount

    } catch (error) {
        console.error("Error index checkCredits:", error)
        if (error instanceof Error && 'status' in error && error.status === 404) {
            throw new Error(`Repository not found: ${githubOwner}/${githubRepo}. If it's private, ensure your token is correct and has "repo" scope.`)
        }
        throw error
    }
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
