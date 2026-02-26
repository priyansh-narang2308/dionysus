import React from 'react'
import { HoverEffect } from '../ui/card-hover-effect'
import { Search, MonitorPlay, BrainCircuit, History, MessageSquare, Users } from 'lucide-react'

const Features = () => {
    const features = [
        {
            title: "Semantic Code Search",
            description: "Find exactly what you need in seconds using natural language queries, powered by deep vector embeddings.",
            link: "#",
            icon: <Search className="size-8 text-blue-500" />
        },
        {
            title: "AI Meeting Insights",
            description: "Automatically transcribe technical meetings and extract actionable issues, summaries, and action items.",
            link: "#",
            icon: <MonitorPlay className="size-8 text-blue-500" />
        },
        {
            title: "Codebase Intelligence",
            description: "Onboard new engineers faster with AI-generated file summaries and comprehensive project documentation.",
            link: "#",
            icon: <BrainCircuit className="size-8 text-blue-500" />
        },
        {
            title: "Smart Commit Logs",
            description: "Stop guessing what changed. Get intelligent summaries of every commit to stay on top of the development flow.",
            link: "#",
            icon: <History className="size-8 text-blue-500" />
        },
        {
            title: "Context-Aware Q&A",
            description: "Ask complex questions about your repository's logic and get accurate answers backed by your own source code.",
            link: "#",
            icon: <MessageSquare className="size-8 text-blue-500" />
        },
        {
            title: "Seamless Collaboration",
            description: "Invite your entire team to your projects and share AI-driven insights across the organization.",
            link: "#",
            icon: <Users className="size-8 text-blue-500" />
        }
    ]

    return (
        <section className="py-24 relative overflow-hidden cursor-none select-none">
            <div className="max-w-7xl mx-auto px-6 relative z-10 cursor-none">
                <div className="flex flex-col items-center text-center mb-16 space-y-4 cursor-none">

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight cursor-none">
                        Everything you need to <span className="text-blue-500 cursor-none">understand</span> your code.
                    </h2>
                    <p className="text-slate-400 text-lg max-w-xl cursor-none">
                        Dionysus combines advanced AI with your development workflow to make codebase comprehension effortless.
                    </p>
                </div>

                <HoverEffect items={features} className="cursor-none" />
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    )
}

export default Features