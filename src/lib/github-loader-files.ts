import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { summarizeCode, generateEmbedding } from "./gemini-integration";
import { db } from "@/server/db";


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
