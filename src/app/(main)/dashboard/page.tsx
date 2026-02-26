"use client"

import useProject from "@/hooks/use-project"
import { ExternalLink, Github, FolderPlus, ArrowRight } from "lucide-react"
import Link from "next/link"
import CommitLogComponent from "./_components/commit-log-component"
import AskQuestionCard from "./_components/ask-question-card"
import MeetingCard from "./_components/meeting-card"
import ArchiveButton from "./_components/archive-button"
import InviteButton from "./_components/invite-button"
import TeamMembers from "./_components/team-members"
import { Button } from "@/components/ui/button"

const Dashboard = () => {
    const { project } = useProject()

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                    <div className="relative bg-white border border-blue-100 p-8 rounded-3xl shadow-2xl shadow-blue-100 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <FolderPlus className="size-16 text-blue-600 stroke-[1.5]" />
                    </div>
                </div>

                <div className="text-center space-y-3 max-w-md">
                    <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                        No projects yet
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        Connect your first repository to start analyzing your code and tracking commits.
                    </p>
                </div>

                <div className="mt-10">
                    <Link href="/create-project">
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all cursor-pointer active:scale-95 flex items-center gap-3 group"
                        >
                            Create your first project
                            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

               
            </div>
        )
    }

    if (!project?.githubUrl) return null

    return (
        <div className="pt-10">
            <div className="flex items-center justify-between flex-wrap gap-y-4">
                <div className="
        group relative w-fit max-w-full
        rounded-xl
        border border-blue-500/30
        bg-linear-to-r from-blue-500/20 via-blue-500/10 to-blue-400/5
        backdrop-blur-md
        px-5 py-3
        shadow-lg shadow-blue-500/20
        transition-all duration-300
        hover:shadow-blue-500/40
        hover:border-blue-400/60
      ">

                    <div className="
          absolute inset-0 rounded-xl
          bg-blue-500/20 blur-xl opacity-0
          group-hover:opacity-100
          transition duration-500
        "/>

                    <div className="relative flex items-center gap-3">

                        <div className="
            flex items-center justify-center
            size-9 rounded-md
            bg-blue-500 text-white
            shadow-md shadow-blue-500/40
          ">
                            <Github className="size-5" />
                        </div>

                        <p className="text-sm font-medium text-foreground">
                            This project is linked to GitHub
                        </p>
                        <Link
                            href={project.githubUrl}
                            target="_blank"
                            className="
        inline-flex items-center gap-1
        text-sm font-semibold
        text-blue-500
        hover:text-blue-600
        hover:underline
        transition
        whitespace-nowrap  cursor-pointer
    "
                        >
                            View Repo
                            <ExternalLink className="size-3 shrink-0" />
                        </Link>

                    </div>
                </div>

                <div className="h-4">
                </div>

                <div className="flex items-center gap-4 ">
                    <TeamMembers />
                    <InviteButton />
                    <ArchiveButton />
                </div>

            </div>

            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    <AskQuestionCard />
                    <MeetingCard />
                </div>
            </div>
            <div className="mt-8"></div>

            <CommitLogComponent />
        </div>

    )
}

export default Dashboard
