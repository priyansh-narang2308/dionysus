"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Copy, UserPlus, LinkIcon } from 'lucide-react'

const InviteButton = () => {
    const { projectId } = useProject()
    const [open, setOpen] = useState(false)

    // Construct the invite link
    const inviteLink = typeof window !== 'undefined'
        ? `${window.location.origin}/join/${projectId}`
        : ''

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink)
            toast.success("Link copied to clipboard!")
        } catch {
            toast.error("Failed to copy link")
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-indigo-600" />
                            Invite Members
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground pt-1">
                            Share this link with your team members to grant them access to this project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center space-x-2 mt-4">
                        <div className="grid flex-1 gap-2">
                            <label htmlFor="link" className="sr-only">
                                Link
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="link"
                                    value={inviteLink}
                                    readOnly
                                    className="pl-9 bg-gray-50/50 border-gray-200 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            className="px-3 bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                            onClick={copyToClipboard}
                        >
                            <span className="sr-only">Copy</span>
                            <Copy className="h-4 w-4 cursor-pointer" />
                        </Button>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-[12px] text-blue-700 leading-tight">
                            <strong>Note:</strong> Anyone with this link will be able to join your project. Keep it secure.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            <Button
                variant="default"
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer px-6 flex items-center gap-2"
            >
                <UserPlus className="h-4 w-4" />
                Invite Members
            </Button>
        </>
    )
}

export default InviteButton