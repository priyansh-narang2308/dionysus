"use client"

import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import MeetingCard from '../dashboard/_components/meeting-card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react'
// Import AlertDialog components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

const MeetingsPage = () => {
    const { projectId } = useProject()
    const utils = api.useUtils()

    const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
        { projectId },
        { refetchInterval: 4000 }
    )

    const deleteMeeting = api.project.deleteMeeting.useMutation({
        onSuccess: async () => {
            // Refetch meetings after a successful delete
            await utils.project.getMeetings.invalidate({ projectId })
            toast.success("Meeting deleted successfully")
        }
    })

    return (
        <>
            <MeetingCard />
            <div className="h-4"></div>

            <h1 className='text-2xl mt-3 font-semibold'>Meetings</h1>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-4"></div>
                    <p className="text-lg text-gray-500 font-medium">
                        Loading meetings...
                    </p>
                </div>
            )}

            {!isLoading && meetings?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <p className="text-lg font-semibold text-gray-700 mb-1">
                        No meetings yet
                    </p>

                    <p className="text-md text-gray-500 text-center max-w-xs">
                        Upload your first meeting to get started. Your meetings will appear here.
                    </p>
                </div>
            )}
            <ul className='divide-y divide-gray-200'>
                {meetings?.map((meeting) => (
                    <li key={meeting.id} className='flex items-center justify-between py-5 gap-x-6'>
                        <div>
                            <div className='min-w-0'>
                                <div className='flex items-center gap-2'>
                                    <Link href={`/meetings/${meeting.id}`} className='text-sm font-semibold hover:underline'>
                                        {meeting.name}
                                    </Link>

                                    {meeting.status === "PROCESSING" ? (
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            Processing...
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                            Completed
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className='flex items-center text-xs text-gray-500 gap-x-2'>
                                <p className='whitespace-nowrap'>{meeting.createdAt.toLocaleString()}</p>
                                <p className='truncate'>{meeting.issues.length} issues</p>
                            </div>
                        </div>

                        <div className='flex items-center flex-none gap-x-4'>
                            <Link href={`/meetings/${meeting.id}`}>
                                <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                                    <Eye className="h-4 w-4" />
                                    View
                                </Button>
                            </Link>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className='cursor-pointer' size="sm" disabled={deleteMeeting.isPending}>
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the
                                            meeting <strong>{meeting.name}</strong> and all associated data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-600  text-white hover:bg-red-700 cursor-pointer"
                                            onClick={() => deleteMeeting.mutate({ meetingId: meeting.id })}
                                        >
                                            {deleteMeeting.isPending ? "Deleting..." : "Delete Permanently"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default MeetingsPage