'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Glass } from '@/components/ui/glass';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

export function GlassNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className='absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl'>
                <Glass
                    width='100%'
                    height={60}
                    borderRadius={50}
                    blur={10}
                    tintOpacity={0.08}
                    className="overflow-visible"
                >
                    <nav className='flex items-center justify-between h-full px-4 md:px-8'>
                        <Link href="/" className="flex items-center gap-3 text-white hover:text-white/80 transition-colors z-50">
                            <Image src={"/logo.png"} width={30} height={30} alt='image' />
                            <span className="font-bold text-lg tracking-wider uppercase">Dionysus</span>
                        </Link>

                        <div className='hidden md:flex gap-8 items-center'>
                            <Link href='#features' className='text-white/80 hover:text-white transition-colors font-medium text-sm'>
                                Features
                            </Link>
                            <Link href='#about' className='text-white/80 hover:text-white transition-colors font-medium text-sm'>
                                About
                            </Link>
                        </div>

                        <div className='hidden md:flex gap-4 items-center'>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors backdrop-blur-md cursor-pointer">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/dashboard"
                                        className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg backdrop-blur-md transition-all duration-200 active:scale-95 shadow-sm"
                                    >
                                        Dashboard
                                    </Link>

                                    <div className="pl-2 border-l border-white/10">
                                        <UserButton
                                            afterSignOutUrl="/"
                                            appearance={{
                                                elements: {
                                                    avatarBox: "h-9 w-9 border border-white/20 hover:scale-105 transition-transform"
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </SignedIn>
                        </div>

                        <button
                            className="md:hidden text-white z-50 p-2 cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </nav>
                </Glass>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-6xl md:hidden"
                    >
                        <Glass
                            width='100%'
                            height='auto'
                            borderRadius={24}
                            blur={10}
                            tintOpacity={0.08}
                        >
                            <div className="flex flex-col p-6 gap-6">
                                <Link href='#features' onClick={() => setIsOpen(false)} className='text-white/90 text-lg font-medium'>Features</Link>
                                <Link href='#about' onClick={() => setIsOpen(false)} className='text-white/90 text-lg font-medium'>About</Link>
                                <div className="w-full h-px bg-white/20 my-2" />
                                <SignedOut>
                                    <div className="flex flex-col gap-4">
                                        <SignInButton mode="modal">
                                            <button className="text-white bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl font-medium w-full text-center cursor-pointer">
                                                Sign In
                                            </button>
                                        </SignInButton>
                                        <SignUpButton mode="modal">
                                            <button className="text-black bg-white hover:bg-white/90 transition-colors py-3 rounded-xl font-medium w-full text-center cursor-pointer">
                                                Sign Up
                                            </button>
                                        </SignUpButton>
                                    </div>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex flex-col gap-4">
                                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-white bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl font-medium w-full text-center">
                                            Go to Dashboard
                                        </Link>

                                    </div>
                                </SignedIn>
                            </div>
                        </Glass>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
