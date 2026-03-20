"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, Zap } from "lucide-react";

export function LampSection() {
  const router = useRouter();

  return (
    <LampContainer>


      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Master your codebase.
        <br />
        <span className="bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Talk to your code.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 font-normal text-base text-neutral-300 max-w-2xl text-center px-4"
      >
        Link your GitHub repository and let Dionysus handle the rest. Ask questions, get direct code references, and generate AI summaries for every commit.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 px-4"
      >
        <Button
          onClick={() => router.push("/dashboard")}
          size="lg"
          className="bg-white text-black hover:bg-white/90 transition-all duration-200 group"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        
 
      </motion.div>

  
    </LampContainer>
  );
}
