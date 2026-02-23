"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import useProject from "@/hooks/use-project"
import Image from "next/image"
import { useState } from "react"
import { askQuestion } from "./actions"
import { readStreamableValue } from "@ai-sdk/rsc"

import MDEditor from "@uiw/react-md-editor"
import CodeReference from "./code-reference"
import { Save } from "lucide-react"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import useRefetch from "@/hooks/use-refetch"

const AskQuestionCard = () => {

    const { project } = useProject()
    const [open, setOpen] = useState(false)
    const [question, setQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const [filesReferences, setFilesReferences] = useState<{ fileName: string; sourceCode: string, summary: string }[]>([])
    const [answer, setAnswer] = useState("")

    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer("")
        setFilesReferences([])
        e.preventDefault()
        if (!project?.id) return
        setLoading(true)
        //fetch it from actions
        const { output, filesReferences } = await askQuestion(question, project.id)
        setOpen(true)
        setFilesReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer((ans) => ans + delta)
            }
        }
        setLoading(false)
    }

    const refetch = useRefetch()

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[80vw]">
                    <DialogHeader>
                        <div className="flex items-center gap-2">

                            <DialogTitle>
                                <Image src={"/logo.png"} alt="logo" width={40} height={40} />
                            </DialogTitle>

                            <Button
                                disabled={saveAnswer.isPending}
                                variant={"outline"} onClick={() => {
                                    saveAnswer.mutate({
                                        projectId: project!.id,
                                        question,
                                        answer,
                                        filesReferences
                                    }, {
                                        onSuccess: () => {
                                            toast.success("Answer saved successfully!")
                                            void refetch();
                                        },
                                        onError: () => {
                                            toast.error("Failed to save answer. Please try again.")
                                        }
                                    })
                                }} >
                                <Save />
                                Save Answer</Button>
                        </div>
                    </DialogHeader>

                    <MDEditor.Markdown source={answer} className="max-w-[70vw] h-full! max-h-[40vh] overflow-scroll" />
                    <div className="h-4"> </div>
                    <CodeReference filesReferences={filesReferences} />
                    <Button type="button" className="px-6 bg-blue-600 hover:bg-blue-700 font-medium cursor-pointer shadow-sm hover:shadow-md transition-all" onClick={() => setOpen(false)}>
                        Close
                    </Button>

                </DialogContent>
            </Dialog>

            <Card className="col-span-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                        Ask a Question
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Get instant help with your code, files, or setup.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">

                        <Textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Example: Which file should I edit to change the home page?"
                            className="min-h-[120px] resize-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />

                        <div className="flex items-center justify-between">


                            <Button
                                disabled={loading || !question.trim()}
                                type="submit"
                                className="px-6 bg-blue-600 hover:bg-blue-700 font-medium cursor-pointer shadow-sm hover:shadow-md transition-all"
                            >
                                Ask Dionysus
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard