"use client"

import { GlassNavbar } from '@/components/landing/glass-navbar';
import { LampSection } from '@/components/landing/lamp-section';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';

export default function HomePage() {
  return (
    <div className='relative w-full min-h-screen bg-[#050505] flex flex-col font-sans'>
      <GlassNavbar />
      
      <LampSection />

      <div className="relative z-10 bg-[#050505]">
        <Features />
        <HowItWorks />
      </div>
    </div>
  );
}
