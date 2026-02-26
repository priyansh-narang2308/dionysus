"use client"

import { Glass } from '@/components/ui/glass';
import { GlassNavbar } from '@/components/landing/glass-navbar';
import { useRouter } from 'next/navigation';

export default function GlassHeroDemo() {

  const router = useRouter()

  return (
    <div className='relative w-full min-h-screen overflow-hidden bg-[#050505] flex flex-col font-sans select-none cursor-none'>
      <img
        src='https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?auto=format&fit=crop&q=80'
        alt='Background'
        className='absolute inset-0 w-full h-full object-cover opacity-60'
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/20 to-[#050505]/95 z-0 pointer-events-none" />

      <GlassNavbar />

      <div className='flex-1 flex flex-col items-center justify-center z-10 px-4 pt-40 pb-20 md:px-0'>
        <Glass
          width='auto'
          height='auto'
          borderRadius={25}
          blur={10}
          tintOpacity={0.12}
          className='mb-8'
        >
          <div className='px-5 py-2 flex items-center gap-2 cursor-none'>
            <span className='text-white/90 text-xs md:text-sm font-medium tracking-wide'>
              ✨ AI-Powered Codebase Intelligence
            </span>
          </div>
        </Glass>

        <h1 className='text-center text-5xl md:text-7xl lg:text-8xl font-sans py-4 relative z-20 font-bold tracking-tighter text-white max-w-5xl mx-auto cursor-none'>
          Master your codebase.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 via-white to-neutral-500">
            Talk to your code.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-center text-white/70 mt-6 mb-10 text-lg md:text-xl relative z-20 font-light hidden sm:block cursor-none">
          Link your GitHub repository and let Dionysus handle the rest. Ask questions, get direct code references, and generate AI summaries for every commit.
        </p>
        <p className="max-w-xl mx-auto text-center text-white/70 mt-6 mb-10 text-lg relative z-20 font-light block sm:hidden cursor-none">
          Link your GitHub and let Dionysus handle the rest. Ask questions and get code references instantly.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 relative z-20 cursor-none'>

          <Glass
            width='auto'
            height='auto'
            borderRadius={50}
            blur={12}
            tintOpacity={0.15}
          >
            <button onClick={() => router.push("/dashboard")} className='px-8 py-4 sm:px-10 text-white hover:text-white/80 transition-colors font-semibold text-sm md:text-base w-full cursor-none'>
              Get Started
            </button>
          </Glass>
        </div>
      </div>

      {/* Absolute Mouse tracker glass circle effect for desktop pointer-events-none */}
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <Glass
          width={180}
          height={180}
          borderRadius={90}
          blur={3}
          tintOpacity={0.05}
          followMouse
          className="-z-10 absolute pointer-events-none"
        />
      </div>
    </div>
  );
}
