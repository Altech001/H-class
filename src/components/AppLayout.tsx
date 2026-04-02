import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routeTitles: Record<string, string> = {
  "/": "Home - H-Class",
  "/live-class": "Live Classes",
  "/tasks": "Tasks",
  "/results": "Results",
  "/certification": "Certification",
  "/notes": "Notes",
  "/chats": "Chat Support",
  "/subdomains": "Domain & Hosting",
  "/payments": "Payments & Finance",
  "/settings": "Account Settings",
  "/profile": "User Profile",
  "/courses": "Browse Courses",
  "/my-courses": "My Courses",
  "/create-course": "Create Course",
};

export function AppLayout() {
  const location = useLocation();
  // Support dynamic routes like /courses/:id
  const baseRoute = "/" + location.pathname.split("/").filter(Boolean)[0];
  const title = routeTitles[location.pathname] || routeTitles[baseRoute] || "Dashboard";

  // Silently hydrate latest user profile on mount
  // This automatically calls setAuth/setUser in useUsers hooks via TanStack
  const { useGetProfile } = useUsers();
  useGetProfile();

  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      useAuthStore.getState().logout();
      navigate("/login");
    }
  };

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
            <div className="flex items-center gap-3">
              <Link to="/courses" className="relative rounded-none px-4 py-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground">
                <p className="text-[13px] font-semibold">Courses</p>
              </Link>
              <Link to="/my-courses" className="relative rounded-none px-4 py-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground hidden sm:block">
                <p className="text-[13px] font-semibold">My Courses</p>
              </Link>

              <button className="relative rounded-none p-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              </button>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none ml-2">
                    <Avatar className="h-9 w-9 border border-border shadow-sm hover:ring-2 hover:ring-primary/20 transition-all">
                      <AvatarImage src={user.avatarUrl || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 font-sans">
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-bold text-sm text-foreground">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive gap-2">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
