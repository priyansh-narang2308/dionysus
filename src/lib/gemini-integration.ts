import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";

export const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

export const model = "gemini-flash-latest";

export const summariseCommitFromGemini = async (diff: string): Promise<string> => {

    const response = await genAI.models.generateContent({
        model,
        contents: `You are an expert programmer, and you are trying to summarize a git diff.

Reminders about the git diff format:

For every file, there are a few metadata lines, like (for example):

\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`

This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.

Then there is a specifier of the lines that were modified.

A line starting with \`+\` means it was added.  
A line starting with \`-\` means that line was deleted.  
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.  
It is not part of the diff.

[...]

EXAMPLE SUMMARY COMMENTS:

\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numeric tolerance for test files
\`\`\`

Most commits will have less comments than this examples list.

The last comment does not include the file names, because there were more than two relevant files in the hypothetical commit.

Do not include parts of the example in your summary.

It is given only as an example of appropriate comments.

Summarise the following git diff:

${diff}`
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary generated.";
};


export async function summarizeCode(doc: Document) {
    console.log("Getting summary for: ", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000); // limit to 10000 chars
        const response = await genAI.models.generateContent({
            model,
            contents: `You are an intelligent senior software engineer specializing in developer onboarding.
You are explaining the purpose and functionality of the file "${doc.metadata.source}" to a new junior engineer.
Provide a high-level summary that covers:
1. The primary responsibility of this file.
2. The key functions, classes, or constants it exports.
3. How it fits into the overall architecture (if clear from the code).

Keep the explanation clear, professional, and under 100 words.
---
CODE:
${code}
---
SUMMARY:`
        });


        return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary generated.";
    } catch (error) {
        console.log("Error generating summary", error)
        return "No summary generated.";
    }
}

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!text.trim()) {
        return new Array<number>(768).fill(0);
    }
    const response = await genAI.models.embedContent({
        model: "models/gemini-embedding-001",
        contents: [{ parts: [{ text }] }]
    });

    return response.embeddings?.[0]?.values ?? [];
}

// console.log(await generateEmbedding("HELLO WORLD"))

// const models = await genAI.models.list();
// console.log("Available models:", JSON.stringify(models, null, 2));