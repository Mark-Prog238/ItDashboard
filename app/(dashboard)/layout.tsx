import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/toast"


export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>
                        {children}
                        <Toaster />
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
