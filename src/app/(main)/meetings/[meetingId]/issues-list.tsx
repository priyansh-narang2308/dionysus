"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api, type RouterOutputs } from "@/trpc/react"
import { Video } from "lucide-react"
import { useState } from "react"

type Props = {
    meetingId: string
}

const IssuesList = ({ meetingId }: Props) => {

    const { data: meeting, isLoading } = api.project.getMeetingById.useQuery({ meetingId }, {
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
    })
    if (isLoading || !meeting) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-600"></div>
                    <p className="text-sm font-medium text-gray-500">
                        Loading meeting details...
                    </p>

                </div>
            </div>
        )
    }
    return (
        <>
            <div className="p-8">
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
                    <div className=" flex items-center gap-x-6">
                        <div className="rounded-full border bg-white p-3">
                            <Video className="w-6 h-6" />
                        </div>
                        <h1>
                            <div className=" text-sm leading-6 text-gray-600">
                                Meeting uploaded on {""}{meeting.createdAt.toLocaleDateString()}
                            </div>
                            <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                                {meeting.name}
                            </div>
                        </h1>
                    </div>
                </div>

                <div className="h-4"></div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {meeting.issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
            </div>
        </>
    )
}

function IssueCard({ issue }: { issue: NonNullable<RouterOutputs["project"]["getMeetingById"]>["issues"][number] }) {
    const [open, setOpen] = useState(false)

    return (
        <>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{issue.gist}</DialogTitle>
                        <DialogDescription>{issue.createdAt.toLocaleTimeString()}</DialogDescription>
                        <p className="text-gray-600">{issue.headline}</p>
                        <blockquote className="mt-2 border-l-4 border-gray-300 bg-gray-50 pl-4 py-2 text-gray-600">
                            <span className="text-sm text-gray-600">
                                {issue.start} - {issue.end}
                            </span>
                            <p className="text-gray-900 font-medium italic leading-relaxed">{issue.summary}</p>
                        </blockquote>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Card className="relative">
                <CardHeader>
                    <CardTitle>{issue.gist}</CardTitle>
                    <div className="borde-b"></div>
                    <CardDescription>
                        {issue.headline}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700" onClick={() => setOpen(true)}>
                        View Details
                    </Button>
                </CardContent>

            </Card>
        </>
    )
}

export default IssuesList