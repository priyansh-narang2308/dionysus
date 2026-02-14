"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useRefetch from "@/hooks/use-refetch"
import { api } from "@/trpc/react"
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
    const refetchProjects = useRefetch()

    const onSubmit = (data: FormInput) => {
        console.log("Form Data:", data)
        createProject.mutate({
            name: data.projectName,
            githubUrl: data.repoUrl,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success("Project created successfully!")
                void refetchProjects()
                reset()
            },
            onError: (error) => {
                toast.error(error.message ||
                    "Failed to create a project"
                )
            }
        })
        return true
    }

    return (
        <div className="flex flex-col lg:flex-row items-center gap-12 h-full justify-center p-6 lg:p-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={"/undraw.svg"} className="h-56 w-auto hidden lg:block" alt="image" />
            <div className="w-full max-w-md">
                <div className="text-center lg:text-left">
                    <h1 className="font-semibold text-2xl">
                        Link your GitHub Repository
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Enter the URL of your GitHub repository to link it to Dionysus
                    </p>
                </div>

                <div className="h-4"></div>

                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Input
                                {...register("projectName", { required: "Project name is required" })}
                                placeholder="Project Name"
                            />
                            {errors.projectName && <span className="text-xs text-destructive font-medium">{errors.projectName.message}</span>}
                        </div>

                        <div className="space-y-1">
                            <Input
                                {...register("repoUrl", { required: "Repository URL is required" })}
                                placeholder="GitHub Repository URL"
                                type="url"
                            />
                            {errors.repoUrl && <span className="text-xs text-destructive font-medium">{errors.repoUrl.message}</span>}
                        </div>

                        <div className="space-y-1">
                            <Input
                                {...register("githubToken")}
                                placeholder="GitHub Token (Optional)"
                            />
                            <p className="text-[11px] text-muted-foreground">Optional: For private repositories</p>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={createProject.isPending} className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]">
                                Create Project
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateNewProject