"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import useProject from "@/hooks/use-project"
import { api } from "@/trpc/react"
import AskQuestionCard from "../dashboard/_components/ask-question-card"
import React, { useState } from "react"
import Image from "next/image"
import MDEditor from "@uiw/react-md-editor"
import CodeReference from "../dashboard/_components/code-reference"

// shadcn empty components
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { File } from "lucide-react"


const QuestionAndAnswer = () => {

    const [questionIndex, setQuestionIndex] = useState(0)

    const { projectId } = useProject()

    const { data: questions } = api.project.getQuestions.useQuery({
        projectId
    })

    const question = questions?.[questionIndex]

    return (
        <Sheet>
            <AskQuestionCard />
            <div className="h-4"></div>
            <h1 className="text-2xl font-bold">Saved Questions</h1>
            <div className="h-2"></div>
            <div className="flex flex-col gap-2">
                {!questions || questions.length === 0 ? (
                    <Empty className="mt-6 border rounded-lg py-10">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <File className="size-6" />
                            </EmptyMedia>
                            <EmptyTitle>
                                No saved questions yet
                            </EmptyTitle>
                            <EmptyDescription>
                                Ask a question about your project and it will appear here for future reference.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    questions.map((question, index) => (
                        <SheetTrigger
                            key={question.id}
                            onClick={() => setQuestionIndex(index)}
                        >
                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-border hover:bg-gray-50 transition cursor-pointer">
                                <Image
                                    className="rounded-full"
                                    width={30}
                                    height={30}
                                    src={question.user.imageUrl ?? "/default-avatar.png"}
                                    alt="User Image"
                                />
                                <div className="text-left flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                                            {question.question}
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(question.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">
                                        {question.answer}
                                    </p>
                                </div>
                            </div>
                        </SheetTrigger>
                    ))
                )}
            </div>


            {question && (
                <SheetContent className="sm:max-w-[80vw] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <div className="mt-4">
                            <MDEditor.Markdown source={question.answer} />
                        </div>
                        <div className="mt-6">
                            <CodeReference
                                filesReferences={
                                    (question.filesReference ?? []) as {
                                        fileName: string
                                        sourceCode: string
                                        summary: string
                                    }[]
                                }
                            />
                        </div>
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}

export default QuestionAndAnswer