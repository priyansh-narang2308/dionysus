"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import useProject from '@/hooks/use-project'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Archive } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ArchiveButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { projects, projectId, setProjectId } = useProject()
    const refetch = useRefetch()
    const router = useRouter()

    const archiveProject = api.project.archiveProject.useMutation({
        onSuccess: async () => {
            toast.success("Project archived successfully")
            await refetch()
            setIsOpen(false)

            const nextProject = projects?.find(p => p.id !== projectId)
            if (nextProject) {
                setProjectId(nextProject.id)
            } else {
                router.push("/create-project")
            }
        },
        onError: () => {
            toast.error("Failed to archive project")
        }
    })


    const handleArchive = () => {
        archiveProject.mutate({ projectId })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2 cursor-pointer">
                    <Archive className="h-4 w-4" />
                    Archive Project
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will move the project to your archives. You can restore it later from your settings, but it will no longer appear in your projects section.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={archiveProject.isPending} className='cursor-pointer'>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant={"destructive"}
                        className='cursor-pointer'
                        disabled={archiveProject.isPending}
                        onClick={(e) => {
                            e.preventDefault()
                            handleArchive()
                        }}
                    >
                        {archiveProject.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Archiving...
                            </>
                        ) : (
                            "Archive Project"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ArchiveButton