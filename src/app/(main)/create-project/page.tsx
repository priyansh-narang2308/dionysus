"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useRefetch from "@/hooks/use-refetch"
import { api } from "@/trpc/react"
import { Info, Loader2, Rocket, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import React from 'react'
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}

const CreateNewProject = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInput>({
        defaultValues: {
            repoUrl: "",
            projectName: "",
            githubToken: ""
        }
    })

    const createProject = api.project.createProject.useMutation()
    const checkCredits = api.project.checkCredits.useMutation()
    const refetchProjects = useRefetch()
    const router = useRouter()

    const hasCheckedCredits = !!checkCredits.data
    const insufficientCredits = hasCheckedCredits && (checkCredits.data.userCredits <= checkCredits.data.fileCount)

    const onSubmit = (data: FormInput) => {
        if (hasCheckedCredits) {
            if (insufficientCredits) {
                return toast.error("You do not have enough credits to index this repository.")
            }

            createProject.mutate({
                name: data.projectName,
                githubUrl: data.repoUrl,
                githubToken: data.githubToken
            }, {
                onSuccess: () => {

                    toast.success("Project created successfully!")
                    router.push("/dashboard")
                    void refetchProjects()
                    reset()
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to create a project")
                }
            })
        } else {
            checkCredits.mutate({
                githubUrl: data.repoUrl,
                githubToken: data.githubToken
            })
        }
    }

    return (
        <div className="flex flex-col lg:flex-row items-center gap-16 min-h-[calc(100vh-100px)] justify-center p-8">
            <div className="hidden lg:block w-1/2 max-w-lg transform hover:scale-105 transition-transform duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={"/undraw.svg"} className="h-full w-auto opacity-90 drop-shadow-2xl" alt="Illustration" />
            </div>

            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center lg:text-left space-y-2">
                    <h1 className="font-bold text-3xl tracking-tight text-foreground">
                        Link your GitHub Repository
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Enter the URL of your GitHub repository to link it to Dionysus
                    </p>
                </div>

                <div className="bg-card/30 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-xl space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium px-1">Project Name</label>
                            <Input
                                {...register("projectName", { required: "Project name is required" })}
                                placeholder="Enter project name"
                                className="bg-background/50 border-border/50 focus:border-blue-500/50 transition-all"
                            />
                            {errors.projectName && <span className="text-xs text-destructive font-medium ml-1">{errors.projectName.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium px-1">GitHub Repository URL</label>
                            <Input
                                {...register("repoUrl", { required: "Repository URL is required" })}
                                placeholder="https://github.com/user/repo"
                                type="url"
                                className="bg-background/50 border-border/50 focus:border-blue-500/50 transition-all"
                            />
                            {errors.repoUrl && <span className="text-xs text-destructive font-medium ml-1">{errors.repoUrl.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium px-1">GitHub Token <span className="text-[10px] text-muted-foreground">(Optional)</span></label>
                            <Input
                                {...register("githubToken")}
                                placeholder="Enter your GitHub personal access token"
                                className="bg-background/50 border-border/50 focus:border-blue-500/50 transition-all"
                            />
                            <p className="text-[11px] text-muted-foreground px-1">Required for private repositories to fetch commit history.</p>
                        </div>

                        <div className="pt-4 space-y-4">
                            {hasCheckedCredits && (
                                <div className="mt-4 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700">
                                    <div className="flex items-center gap-2">
                                        <Info className='size-4' />
                                        <p className='text-sm'>
                                            You will be charged <strong>{checkCredits.data?.fileCount}</strong> credits for this repository.
                                        </p>
                                    </div>
                                    <p className='text-sm text-blue-600 ml-6'>
                                        You have <strong>{checkCredits.data?.userCredits}</strong> credits remaining.
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={createProject.isPending || checkCredits.isPending}
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {(createProject.isPending || checkCredits.isPending) && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}

                                {createProject.isPending
                                    ? "Creating Project..."
                                    : checkCredits.isPending
                                        ? "Checking Credits..."
                                        : hasCheckedCredits
                                            ? "Create Project"
                                            : "Check Credits"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateNewProject