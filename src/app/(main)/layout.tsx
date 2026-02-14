import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import AppSidebar from "./app-sidebar"


const MainProtectedLayout = ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full m-2">
                <div className="flex items-center gap-2 border-sidebar-border bg-sidebar border shadow-lg rounded-md p-2 px-4">

                    <div className="md:hidden">
                        <SidebarTrigger />
                    </div>
                    <div className="ml-auto"></div>
                    <UserButton />
                </div>


                <div className="h-4"></div>
                {/* main Content */}
                <div className="border-sidebar-border bg-sidebar border shadow-lg rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}

export default MainProtectedLayout