/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"

import useProject from "@/hooks/use-project"
import { api } from "@/trpc/react"
import React, { useRef, useState } from "react"
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react"
import Image from "next/image"

const springConfig = { stiffness: 120, damping: 14 }

export default function TeamMembers() {
    const { projectId } = useProject()
    const { data: members } = api.project.getTeamMembers.useQuery({ projectId })

    const [hoveredId, setHoveredId] = useState<string | number | null>(null)

    const x = useMotionValue(0)
    const rotate = useSpring(useTransform(x, [-100, 100], [-30, 30]), springConfig)
    const translateX = useSpring(
        useTransform(x, [-100, 100], [-30, 30]),
        springConfig
    )

    const animationFrameRef = useRef<number | null>(null)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseMove = (event: any) => {
        if (animationFrameRef.current)
            cancelAnimationFrame(animationFrameRef.current)

        animationFrameRef.current = requestAnimationFrame(() => {
            const halfWidth = event.target.offsetWidth / 2
            x.set(event.nativeEvent.offsetX - halfWidth)
        })
    }

    if (!members || members.length === 0) return null

    const MAX_VISIBLE = 5
    const visibleMembers = members.slice(0, MAX_VISIBLE)
    const extraCount = members.length - MAX_VISIBLE

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-500">
                Members:
            </span>

            <div className="flex items-center">
                {visibleMembers.map((member, idx) => {
                    const name =
                        `${member.user.firstName ?? ""} ${member.user.lastName ?? ""
                            }`.trim() || "User"

                    const image =
                        member.user.imageUrl ??
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            name
                        )}&background=random`

                    return (
                        <div
                            key={member.id}
                            className="relative group -ml-3 first:ml-0"
                            style={{ zIndex: visibleMembers.length - idx }}
                            onMouseEnter={() => setHoveredId(member.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <AnimatePresence>
                                {hoveredId === member.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 14, scale: 0.6 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 14, scale: 0.6 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 18,
                                        }}
                                        style={{
                                            translateX,
                                            rotate,
                                        }}
                                        className="absolute -top-16 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-neutral-900 px-4 py-2 text-xs shadow-xl"
                                    >
                                        <div className="text-sm font-semibold text-white">
                                            {name}
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image
                                    onMouseMove={handleMouseMove}
                                    src={image}
                                    alt={name}
                                    width={40}
                                    height={40}
                                    className="
                    h-10 w-10
                    rounded-full
                    border-2 border-white
                    object-cover
                    shadow-sm
                    cursor-pointer
                    bg-white
                  "
                                />
                            </motion.div>
                        </div>
                    )
                })}

                {extraCount > 0 && (
                    <div className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-neutral-200 text-xs font-semibold text-neutral-700">
                        +{extraCount}
                    </div>
                )}
            </div>
        </div>
    )
}