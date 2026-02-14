"use client"

import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { ExternalLink, History, MessageSquareQuote, RefreshCcw, User, Sparkles, Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'

const CommitLogComponent = () => {
    const { projectId, project } = useProject()
    const utils = api.useUtils()
    const { data: commits, isLoading } = api.project.getCommits.useQuery({
        projectId: projectId,
    })

    const refreshCommits = api.project.refreshCommits.useMutation({
        onSuccess: () => {
            void utils.project.getCommits.invalidate()
        }
    })
    if (isLoading) {
        return (
            <div className="flex min-h-[300px] w-full items-center justify-center">
                <div className="flex flex-col gap-2 font-mono text-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-4 animate-spin flex items-center justify-center">
                            <Loader className="size-full text-primary" />
                        </div>
                        <span className="font-bold text-foreground animate-pulse">
                            git fetch origin...
                        </span>
                    </div>

                    <div className="h-px w-full bg-foreground/20" />

                    <span className="text-xs font-medium text-foreground/70">
                        Syncing commit history to local...
                    </span>
                </div>
            </div>
        )
    }
    if (!commits || commits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-border/50 bg-card/20 text-center space-y-4">
                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
                    <History className="size-8" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">No commits found</h3>
                    <p className="text-muted-foreground max-w-xs mb-4">We haven&apos;t processed any commits for this project yet.</p>
                    <button
                        onClick={() => refreshCommits.mutate({ projectId })}
                        disabled={refreshCommits.isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCcw className={refreshCommits.isPending ? "animate-spin size-4" : "size-4"} />
                        {refreshCommits.isPending ? "Fetching..." : "Fetch Commits"}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <History className="size-5 text-blue-500" />
                    <h2 className="text-xl font-bold">Commit History</h2>
                </div>
                <button
                    onClick={() => refreshCommits.mutate({ projectId })}
                    disabled={refreshCommits.isPending}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <RefreshCcw className={refreshCommits.isPending ? "animate-spin size-3.5" : "size-3.5"} />
                    {refreshCommits.isPending ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            <ul className="relative space-y-10">
                <div className="absolute left-[19px] top-6 bottom-0 w-px bg-border group-hover:bg-blue-200 transition-colors" />

                {commits.map((commit) => (
                    <li key={commit.id} className="relative group">
                        <div className="flex gap-x-6">
                            <div className="relative shrink-0 flex items-start mt-1">
                                <div className="z-10 bg-background ring-4 ring-background rounded-full overflow-hidden shadow-sm">
                                    {commit.commitAuthorAvatar ? (
                                        <Image
                                            src={commit.commitAuthorAvatar}
                                            width={40}
                                            height={40}
                                            alt={commit.commitAuthorName}
                                            className="size-10 object-cover"
                                        />
                                    ) : (
                                        <div className="size-10 bg-blue-100 flex items-center justify-center text-blue-600">
                                            <User className="size-5" />
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="flex-auto min-w-0">
                                <div className="bg-card/40 backdrop-blur-sm border border-border/60 rounded-2xl p-4 lg:p-6 shadow-sm group-hover:shadow-md group-hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="font-bold text-foreground truncate">
                                                {commit.commitAuthorName}
                                            </span>
                                            <Link
                                                href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-[12px] font-mono hover:text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0"
                                            >
                                                {commit.commitHash.slice(0, 7)}
                                                <ExternalLink className="size-3" />
                                            </Link>
                                        </div>
                                        <time className="text-xs text-muted-foreground font-medium shrink-0">
                                            {formatDistanceToNow(new Date(commit.commitDate), { addSuffix: true })}
                                        </time>
                                    </div>

                                    <h4 className="font-semibold text-foreground/70 leading-snug mb-3 lowercase">
                                        {commit.commitMessage}
                                    </h4>

                                    <div className="mt-4">
                                        {commit.commitSummary ? (
                                            <div className="relative bg-blue-500/5 rounded-xl p-4 border border-blue-500/10 group/summary">
                                                <MessageSquareQuote className="absolute -top-2 -left-2 size-5 text-blue-500/20 group-hover/summary:text-blue-500/40 transition-colors" />
                                                <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                                    {commit.commitSummary}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-black/70 px-1 opacity-70">
                                                <Sparkles className="size-3 text-blue-400" />
                                                AI analysis not available for this commit
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CommitLogComponent