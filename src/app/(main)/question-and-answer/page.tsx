"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import useProject from "@/hooks/use-project"
import { api } from "@/trpc/react"
import AskQuestionCard from "../dashboard/_components/ask-question-card"
import React, { useState } from "react"
import Image from "next/image"
import MDEditor from "@uiw/react-md-editor"
import CodeReference from "../dashboard/_components/code-reference"

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
                {questions?.map((question, index) => {
                    return <React.Fragment key={question.id}>
                        <SheetTrigger onClick={() => setQuestionIndex(index)}>
                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-border">
                                <Image className="rounded-full" width={30} height={30} src={question.user.imageUrl ?? ""} alt="Image User" />
                                <div className="text-left flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-700 line-clamp-1 text-lg font-medium">{question.question}</p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{question.createdAt.toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{question.answer}</p>
                                </div>
                            </div>

                        </SheetTrigger>
                    </React.Fragment>
                })}
            </div>

            {question && (
                <SheetContent className="sm:max-w-[80vw]">
                    <SheetHeader
                    >
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <MDEditor.Markdown source={question.answer} />
                        <CodeReference
                            filesReferences={(question.filesReference ?? []) as { fileName: string; sourceCode: string; summary: string }[]}
                        />
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}

export default QuestionAndAnswer