"use client"

import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
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
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import {
    BotIcon,
    CreditCard,
    LayoutDashboardIcon,
    Loader2,
    Plus,
    Presentation,
    Trash2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { useState } from "react"

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon
    },
    {
        title: "Q&A",
        url: "/question-and-answer",
        icon: BotIcon
    },
    {
        title: "Meetings",
        url: "/meetings",
        icon: Presentation
    },
    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard
    }
]

const AppSidebar = () => {

    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, projectId, setProjectId } = useProject()

    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)

    const utils = api.useUtils()
    const archiveProject = api.project.archiveProject.useMutation({
        onSuccess: () => {
            toast.success("Project deleted successfully")
            setDeletingProjectId(null)
            void utils.project.getProjects.invalidate()
        },
        onError: () => {
            toast.error("Failed to delete project")
            setDeletingProjectId(null)
        }
    })

    const handleDeleteProject = (e: React.MouseEvent) => {
        // Prevent event propagation so it doesn't trigger project selection
        e.stopPropagation()
    }

    const confirmDelete = (id: string) => {
        setDeletingProjectId(id)
        archiveProject.mutate({ projectId: id })
        // Fallback to select another project if we just deleted the active one
        if (id === projectId) {
            const nextProject = projects?.find(p => p.id !== id)
            setProjectId(nextProject ? nextProject.id : "")
        }
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="floating"
            className="
    fixed md:relative
    z-40
"
        >


            <SidebarHeader>
                <div className={cn(
                    "flex items-center transition-all duration-300",
                    open ? "justify-between px-2 py-2" : "flex-col gap-4 py-2"
                )}>

                    <div className={cn(
                        "flex items-center",
                        open ? "gap-3" : "justify-center"
                    )}>
                        <Image
                            src="/logo.png"
                            height={40}
                            width={40}
                            alt="logo"
                            className="rounded-lg shadow-sm shrink-0"
                        />

                        {open && (
                            <h1 className="text-xl font-semibold tracking-tight text-primary/90">
                                Dionysus
                            </h1>
                        )}
                    </div>

                    <div className={cn(
                        "flex items-center justify-center",
                        open
                            ? ""
                            : "w-10 h-10 rounded-lg hover:bg-sidebar-accent"
                    )}>
                        <SidebarTrigger
                            className={cn(
                                "flex items-center justify-center rounded-md",
                                "h-8 w-8",
                                "text-muted-foreground hover:text-primary",
                                "hover:bg-primary/10 transition-all cursor-pointer"
                            )}
                        />
                    </div>

                </div>
            </SidebarHeader>

            <SidebarContent>

                <SidebarGroup>

                    {open && (
                        <SidebarGroupLabel className="px-3 text-sm font-medium text-muted-foreground/70">
                            Application
                        </SidebarGroupLabel>
                    )}

                    <SidebarMenu className={cn(
                        "mt-2",
                        open ? "px-2 gap-1" : "flex flex-col items-center gap-2"
                    )}>

                        {items.map((item) => {

                            const active = pathname === item.url

                            return (
                                <SidebarMenuItem key={item.title}>

                                    <SidebarMenuButton
                                        asChild
                                        tooltip={!open ? item.title : undefined}
                                        className={cn(
                                            active && "bg-blue-600 hover:bg-blue-700 text-white! shadow-md shadow-blue-600/30"
                                        )}
                                    >

                                        <Link
                                            href={item.url}
                                            className={cn(
                                                "flex items-center transition-all duration-200",
                                                open
                                                    ? "gap-3 px-3 py-2.5 rounded-lg"
                                                    : "justify-center w-10 h-10 rounded-lg",
                                                !active && "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                                            )}
                                        >

                                            <item.icon
                                                className={cn(
                                                    "size-5 shrink-0",
                                                    active
                                                        ? "text-white"
                                                        : ""
                                                )}
                                            />

                                            {open && (
                                                <span className="text-sm font-medium">
                                                    {item.title}
                                                </span>
                                            )}

                                        </Link>


                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            )
                        })}

                    </SidebarMenu>

                </SidebarGroup>


                <SidebarGroup>

                    {open && (
                        <SidebarGroupLabel className="px-3 text-sm font-medium text-muted-foreground/70">
                            Your Projects
                        </SidebarGroupLabel>
                    )}

                    <SidebarGroupContent>

                        <SidebarMenu className={cn(
                            open ? "px-2 gap-1" : "flex flex-col items-center gap-2"
                        )}>

                            {projects?.map((project) => {

                                const active = project.id === projectId

                                return (
                                    <SidebarMenuItem key={project.id}>

                                        <SidebarMenuButton
                                            asChild
                                            tooltip={!open ? project.name : undefined}
                                            className={cn(
                                                "group/project relative",
                                                active && "bg-blue-600 hover:bg-blue-700 text-white! shadow-sm"
                                            )}
                                        >

                                            <div
                                                onClick={() => {
                                                    setProjectId(project.id)
                                                }}
                                                className={cn(
                                                    "flex items-center justify-between cursor-pointer transition-all w-full",
                                                    open
                                                        ? "gap-3 px-3 py-2 rounded-lg"
                                                        : "justify-center w-10 h-10 rounded-lg",
                                                    !active && "hover:bg-sidebar-accent"
                                                )}
                                            >

                                                <div className="flex items-center gap-3 min-w-0 pr-6">
                                                    <div className={cn(
                                                        "flex items-center justify-center font-medium transition-all shrink-0",
                                                        open
                                                            ? "size-6 rounded-md border"
                                                            : "size-6 rounded-md",
                                                        active
                                                            ? "bg-white text-blue-600 border-white"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    )}>
                                                        {project.name[0]}
                                                    </div>

                                                    {open && (
                                                        <span className={cn(
                                                            "text-sm font-medium truncate",
                                                            active
                                                                ? "text-white"
                                                                : "text-muted-foreground"
                                                        )}>
                                                            {project.name}
                                                        </span>
                                                    )}
                                                </div>

                                                {open && (
                                                    <div onClick={(e) => handleDeleteProject(e)} className="absolute right-2 flex items-center">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <button
                                                                    className={cn(
                                                                        "p-1.5 rounded-md cursor-pointer flex items-center justify-center",
                                                                        "hover:bg-red-600 hover:text-white text-white"
                                                                    )}
                                                                    aria-label="Delete project"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the
                                                                        <span className="font-semibold text-foreground"> {project.name} </span>
                                                                        project and archive its data.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            e.stopPropagation()
                                                                            confirmDelete(project.id)
                                                                        }}
                                                                        disabled={deletingProjectId === project.id}
                                                                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                                                    >
                                                                        {deletingProjectId === project.id ? (
                                                                            <>
                                                                                <Loader2 className="size-4 mr-2 animate-spin" />
                                                                                Deleting...
                                                                            </>
                                                                        ) : (
                                                                            "Delete Project"
                                                                        )}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                )}
                                            </div>

                                        </SidebarMenuButton>

                                    </SidebarMenuItem>
                                )
                            })}

                            <SidebarMenuItem>

                                <Link href="/create-project">

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={cn(
                                            "transition-all cursor-pointer",
                                            open
                                                ? "w-full justify-start gap-2 mt-4"
                                                : "w-10 h-10 p-0 justify-center"
                                        )}
                                    >

                                        <Plus className="size-4" />

                                        {open && "Create Project"}

                                    </Button>

                                </Link>

                            </SidebarMenuItem>

                        </SidebarMenu>

                    </SidebarGroupContent>

                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter />

        </Sidebar>
    )
}

export default AppSidebar
