"use client"

import useProject from "@/hooks/use-project"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

const Dashboard = () => {
    const { project } = useProject()

    if (!project?.githubUrl) return null

    return (
        <div>
{project.id}

            <div className="flex items-center justify-between flex-wrap gap-y-4">
                {/* Github link */}
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
              hover:text-blue-400
              hover:underline
              transition
              break-all
            "
                        >
                            View Repo
                            <ExternalLink className="size-3" />
                        </Link>

                    </div>
                </div>

                <div className="h-4">
                </div>

                <div className="flex items-center gap-4 ">
                    Team Members
                    Invite Button
                    Archive Button
                </div>

            </div>

            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    Ask Question card
                    Meeting card
                </div>
            </div>

            <div className="mt-8"></div>

            Comit log
        </div>

    )
}

export default Dashboard
