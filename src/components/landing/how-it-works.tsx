import React from 'react'
import { Search, Link as LinkIcon, Sparkles, MessageSquare } from 'lucide-react'

const steps = [
    {
        title: "Link your GitHub",
        description: "Connect your repository in one click. Dionysus index your codebase and prepares it for deep analysis.",
        icon: <LinkIcon className="size-6 text-blue-500" />
    },
    {
        title: "AI Semantic Search",
        description: "Ask questions about your code in plain English. Get direct files and line references immediately.",
        icon: <Search className="size-6 text-blue-500" />
    },
    {
        title: "Transcribe Meetings",
        description: "Upload your technical meetings. Our AI extracts summary, action items and directly creates issues.",
        icon: <MessageSquare className="size-6 text-blue-500" />
    },
    {
        title: "Understand Every Commit",
        description: "Every push is automatically summarized by AI, keeping the whole team aligned on changes.",
        icon: <Sparkles className="size-6 text-blue-500" />
    }
]

const HowItWorks = () => {
    return (
        <section className="py-24 bg-black/50 cursor-none select-none">
            <div className="max-w-7xl mx-auto px-6 cursor-none">
                <div className="text-center mb-16 cursor-none">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 cursor-none">How it Works</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto cursor-none">
                        Get up and running with Dionysus in minutes. Streamline your development workflow with AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 cursor-none">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group p-8 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-300 cursor-none">
                            <div className="absolute -top-4 -left-4 size-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                                {idx + 1}
                            </div>
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-500/10">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed text-balance">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
