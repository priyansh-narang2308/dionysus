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