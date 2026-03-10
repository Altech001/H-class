import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import LiveClass from "./pages/LiveClass";
import Tasks from "./pages/Tasks";
import Results from "./pages/Results";
import Certification from "./pages/Certification";
import Notes from "./pages/Notes";
import ChatPanel from "./pages/chats/chatspanel";
import Subdomains from "./pages/domains/subdomains";
import Payments from "./pages/payments";
import Settings from "./pages/settings";
import MyCourses from "./pages/cousres/mycousres";
import Students from "./pages/staff/students";
import Profile from "./pages/profile";
import NotFound from "./pages/NotFound";
import TasksResults from "./pages/staff/tasks_results";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/live-class" element={<LiveClass />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/results" element={<Results />} />
            <Route path="/certification" element={<Certification />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/chats" element={<ChatPanel />} />
            <Route path="/subdomains" element={<Subdomains />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/allstudents" element={<Students />} />
            <Route path="/tresults" element={<TasksResults />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
