import { db } from "@/server/db";
import { Octokit } from "octokit";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

type ResponseType = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes = async (githubUrl: string): Promise<ResponseType[]> => {
    const [owner, repo] = githubUrl.replace("https://github.com/", "").split("/");
    if (!owner || !repo) {
        throw new Error("Invalid github url");
    }

    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo,
    });

    const sortedCommits = data.sort((a, b) => {
        return new Date(b.commit.author?.date ?? "").getTime() - new Date(a.commit.author?.date ?? "").getTime();
    });

    // Give the first 10 commits
    return sortedCommits.slice(0, 10).map((commit) => ({
        commitHash: commit.sha,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? ""
    }));
}

export const pullCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    // get the most updated 15 comits and compare with the daabse have we read that or not as we dont want summary for all commits
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    return unprocessedCommits
}

// Fetch project github url
async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true,
            id: true
        }
    })
    if (!project?.githubUrl) {
        throw new Error("Project not found")
    }
    return { project, githubUrl: project?.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: ResponseType[]) {
    const processedCommits = await db.githubCommits.findMany({
        where: {
            projectId
        }
    })

    // Only see the commits not processed from the processed 
    const unprocessedCommits = commitHashes.filter((commit) => {
        return !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash)
    })
    return unprocessedCommits
}

await pullCommits("07f9e84f-d583-43fa-82df-0b5bdffbb926").then(() => {
    console.log()
}).catch((error) => {
    console.log(error)
})