import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

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
  const baseRoute = "/" + location.pathname.split("/").filter(Boolean)[0];
  const title = routeTitles[location.pathname] || routeTitles[baseRoute] || "Dashboard";

  // Notifications
  const { useGetNotifications, markAsRead } = useNotifications();
  const { data: notificationsData } = useGetNotifications();
  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      if (!id) return;
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const { useGetProfile } = useUsers();
  useGetProfile();

  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();
  const { registerPushToken } = useNotifications();

  useEffect(() => {
    // Standard approach: Ask user for permission without coupling to Firebase SDK on the UI thread
    if (user && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // Future: Implement generic serviceworker push subscription generating a token
            // Then call registerPushToken({ token, platform: "web" }) internally
            console.log("Notification permission granted via browser.");
          }
        });
      }
    }
  }, [user]);

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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-none p-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex h-4 w-4 bg-destructive rounded-full text-[10px] font-bold text-white items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 font-sans shadow-xl">
                  <DropdownMenuLabel className="p-4 font-black text-xs uppercase tracking-widest border-b">
                    Notifications
                  </DropdownMenuLabel>
                  <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-muted-foreground font-bold uppercase opacity-30">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-border/10">
                        {notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => !n.read && handleMarkAsRead(n.id)}
                            className={cn(
                              "p-4 hover:bg-slate-50 transition-colors cursor-pointer group",
                              !n.read && "bg-slate-50/50"
                            )}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <p className={cn(
                                "text-sm leading-tight",
                                !n.read ? "font-bold text-slate-950" : "font-medium text-slate-500"
                              )}>
                                {n.title}
                              </p>
                              {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

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
