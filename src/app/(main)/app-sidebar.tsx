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
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import {
    BotIcon,
    CreditCard,
    LayoutDashboardIcon,
    Plus,
    Presentation
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
                                                active && "bg-blue-600 hover:bg-blue-700 text-white! shadow-sm"
                                            )}
                                        >

                                            <div
                                                onClick={() => setProjectId(project.id)}
                                                className={cn(
                                                    "flex items-center cursor-pointer transition-all",
                                                    open
                                                        ? "gap-3 px-3 py-2 rounded-lg"
                                                        : "justify-center w-10 h-10 rounded-lg",
                                                    !active && "hover:bg-sidebar-accent"
                                                )}
                                            >

                                                <div className={cn(
                                                    "flex items-center justify-center font-medium transition-all",
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
                                                        "text-sm font-medium",
                                                        active
                                                            ? "text-white"
                                                            : "text-muted-foreground"
                                                    )}>
                                                        {project.name}
                                                    </span>
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
                                                ? "w-full justify-start gap-2"
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
