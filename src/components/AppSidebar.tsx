import { NavLink } from "@/components/NavLink";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { ApertureIcon, DegreeCredentialIcon, EnvelopeIcon, NoteIcon, TestIcon } from "@/types/HIcons";
import {
  Book,
  Briefcase,
  ChevronRight,
  FileText,
  HelpCircle,
  Home,
  MessageCircleIcon,
  PieChart,
  Settings,
  Users
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const mainMenu = [
  { title: "Home", url: "/", icon: Home, badge: null },
  { title: "Notes", url: "/notes", icon: NoteIcon, badge: null },
  { title: "Live Class", url: "/live-class", icon: ApertureIcon, badge: "LIVE" },
  { title: "Tasks", url: "/tasks", icon: TestIcon, badge: "4" },
  { title: "Results", url: "/results", icon: EnvelopeIcon, badge: null },
  { title: "Certification", url: "/certification", icon: DegreeCredentialIcon, badge: null },
  { title: "My Courses", url: "/courses", icon: Book, badge: null },
];

const secondaryMenu = [
  { title: "Payments & Finance", url: "/payments", icon: HelpCircle },
  { title: "Domain & Hosting", url: "/subdomains", icon: Settings },
  { title: "Chat Support", url: "/chats", icon: MessageCircleIcon },
  { title: "Account Settings", url: "/settings", icon: HelpCircle },
];

const staffMenu = [
  { title: "Dashboard", url: "/staff", icon: Briefcase },
  { title: "Classes & Notes", url: "/classnotes", icon: FileText },
  { title: "Tasks & Results", url: "/tresults", icon: PieChart },
  { title: "Students", url: "/allstudents", icon: Users },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo */}
      <SidebarHeader className={collapsed ? "px-1 pt-6 pb-2" : "px-5 pt-8 pb-4"}>
        <div className="flex items-center justify-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-transparent">
            {/* <GraduationCap className="h-5 w-5 text-primary-foreground" /> */}
            <img src="/icons/photos.png" alt="Logo" className=" object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-foreground">
                H-Class
              </span>
              <span className="text-[11px] text-muted-foreground">
                Aspire and progress
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={collapsed ? "px-1 py-1" : "px-3 py-1"}>
        {/* Main Navigation */}
        <SidebarGroup className={collapsed ? "p-0" : "pt-0"}>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {mainMenu.map((item) => {
                const isActive =
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={`group/link relative flex items-center gap-3 rounded-none ${collapsed ? "px-0 justify-center" : "px-3"} py-2.5 text-[13px] font-medium text-muted-foreground transition-all duration-150 hover:bg-muted/60 hover:text-foreground`}
                        activeClassName="bg-primary/8 text-primary font-semibold hover:bg-primary/12 hover:text-primary"
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 h-full w-[3px] -translate-y-1/2 rounded-none bg-primary" />
                        )}
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-sm font-medium text-gray-600">{item.title}</span>
                            {item.badge && (
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${item.badge === "LIVE"
                                  ? "bg-destructive text-destructive-foreground animate-pulse"
                                  : "bg-primary/15 text-primary"
                                  }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className={collapsed ? "mt-4 p-0" : "mt-4"}>
          <SidebarGroupLabel className="px-3 text-sm text-black">
            Support & Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {secondaryMenu.map((item, index) => {
                const isActive = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={`${item.title}-${index}`}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        className={`group/link relative flex items-center gap-3 rounded-none ${collapsed ? "px-0 justify-center" : "px-3"} py-2 text-[12px] font-medium text-muted-foreground/80 transition-all duration-150 hover:bg-muted/40 hover:text-foreground`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 h-full w-[3px] -translate-y-1/2 rounded-none bg-primary" />
                        )}
                        <item.icon className="h-[16px] w-[16px] shrink-0" />
                        {!collapsed && (
                          <span className="flex-1 text-sm font-medium text-slate-600">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Staff Portal */}
        <SidebarGroup className={collapsed ? "mt-4 p-0" : "mt-4"}>
          <SidebarGroupLabel className="px-3 text-sm text-black">
            Staff Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {staffMenu.map((item, index) => {
                const isActive = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={`${item.title}-${index}`}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        className={`group/link relative flex items-center gap-3 rounded-none ${collapsed ? "px-0 justify-center" : "px-3"} py-2 text-[12px] font-medium text-muted-foreground/80 transition-all duration-150 hover:bg-muted/40 hover:text-foreground`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 h-full w-[3px] -translate-y-1/2 rounded-none bg-primary" />
                        )}
                        <item.icon className="h-[16px] w-[16px] shrink-0" />
                        {!collapsed && (
                          <span className="flex-1 text-sm font-medium text-slate-600">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={collapsed ? "px-1 pb-4 pt-2" : "px-3 pb-4 pt-2"}>
        <Link
          to="/profile"
          className={collapsed ? "flex items-center justify-center rounded-none px-0 py-2 transition-colors hover:bg-muted/50" : "flex items-center gap-3 rounded-none px-2 py-2 transition-colors hover:bg-muted/50"}
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-sm">
            <span className="text-sm font-bold text-primary-foreground">JD</span>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-1 flex-col">
                <span className="text-[13px] font-semibold text-foreground">Hussen</span>
                <span className="text-[11px] text-muted-foreground">Grade 12</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
