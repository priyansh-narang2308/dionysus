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
import { cn } from "@/lib/utils"
import { BotIcon, CreditCard, LayoutDashboardIcon, Plus, Presentation } from "lucide-react"
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

const projects = [
    {
        title: "Project 1"
    },
    {
        title: "Project 2"
    },
    {
        title: "Project 3"
    },
    {
        title: "Project 4"
    }
]

const AppSidebar = () => {

    const pathname = usePathname()
    const { open } = useSidebar()

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Image src={"/logo.png"} height={40} width={40} alt="logo" />
                    <h1 className="text-xl font-bold tracking-tight text-primary/80">
                        {open && "Dionysus"}
                    </h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground/70">
                        Application
                    </SidebarGroupLabel>
                    <SidebarMenu className="px-2 mt-2 gap-1">
                        {items?.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                            pathname === item.url
                                                ? "bg-primary/20 text-primary"
                                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "size-4 transition-colors",
                                            pathname === item.url ? "text-primary" : ""
                                        )} />
                                        <span className={cn(
                                            "text-sm font-medium",
                                            pathname === item.url ? "text-primary" : ""
                                        )}>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground/70">
                        Your Projects
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map((project) => (
                                <SidebarMenuItem key={project.title}>
                                    <SidebarMenuButton asChild tooltip={project.title}>
                                        <div className="flex items-center gap-3 cursor-pointer">
                                            <div className={cn("rounded-sm border size-6 flex items-center justify-center text-sm bg-primary text-white font-medium shrink-0")}>
                                                {project.title[0]}
                                            </div>
                                            {open && <span className="text-sm font-medium">{project.title}</span>}
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            <div className="h-2">

                            </div>

                            <SidebarMenuItem>
                                <Link href={"/create-project"}>
                                    <Button size={"sm"} className={cn("w-fit cursor-pointer", !open && "p-2")} variant={"outline"}>
                                        <Plus className={cn("size-4", open && "mr-2")} />
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