"use client"

import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import MeetingCard from '../dashboard/_components/meeting-card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

const MeetingsPage = () => {


    const { projectId } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId }, { refetchInterval: 4000 })//automaticlall refetch it every 4 seconds

    return (
        <>
            <MeetingCard />
            <div className="h-4"></div>

            <h1 className='text-2xl font-semibold'>Meetings</h1>
            {meetings?.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">You don&apos;t have any meetings uploaded yet.</p>
                </div>
            )}
            {isLoading && <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Loading meetings...</p>
            </div>}

            <ul className='divide-y divide-gray-200'>
                {meetings?.map((meeting) => (
                    <li key={meeting.id} className='flex items-center justify-between py-5 gap-x-6'>
                        <div>
                            <div className='min-w-0'>
                                <div className='flex items-center gap-2'>
                                    <Link href={`/meetings/${meeting.id}`} className='text-sm font-semibold'>{meeting.name}
                                    </Link>

                                    {meeting.status === "PROCESSING" ? (
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                                            Processing...
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                            Completed
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className='flex items-center text-xs text-gray-500 gap-x-2'>
                                <p className='whitespace-nowrap'>
                                    {meeting.createdAt.toLocaleString()}
                                </p>
                                <p className='truncate'>
                                    {meeting.issues.length} issues
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center flex-none gap-x-4'>
                            <Link href={`/meetings/${meeting.id}`} className='text-sm font-semibold'>
                                <Button variant="default">
                                    <Eye className="h-4 w-4" />
                                    View Meeting
                                </Button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>

        </>
    )
}

export default MeetingsPage