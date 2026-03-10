import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";

const routeTitles: Record<string, string> = {
  "/": "Home - H-Class",
  "/live-class": "Live Classes",
  "/tasks": "Tasks",
  "/results": "Results",
  "/certification": "Certification",
  "/notes": "Study Notes",
  "/chats": "Chat Support",
  "/subdomains": "Domain & Hosting",
  "/payments": "Payments & Finance",
  "/settings": "Account Settings",
  "/profile": "User Profile",
  "/courses": "My Courses",
};

export function AppLayout() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Dashboard";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 h-16 flex items-center justify-between border-b border-border bg-white backdrop-blur-md px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
                <p className="text-[11px] text-muted-foreground">Always Keep small notes and writings.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/courses" className="relative rounded-none px-4 py-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground">
                <p className="text-[13px] font-semibold">My Courses</p>
              </Link>

              <button className="relative rounded-none  p-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-muted/30 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
