import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LiveClass from "./pages/LiveClass";
import Tasks from "./pages/Tasks";
import Results from "./pages/Results";
import Certification from "./pages/Certification";
import Notes from "./pages/Notes";
import ChatPanel from "./pages/chats/chatspanel";
import SupportChat from "./pages/support";
import Subdomains from "./pages/domains/subdomains";
import Payments from "./pages/payments";
import Settings from "./pages/settings";
import MyCourses from "./pages/cousres/mycousres";
import CreateCourse from "./pages/cousres/createcousre";
import Enrollment from "./pages/cousres/Enrollment";
import Students from "./pages/staff/students";
import Profile from "./pages/profile";
import NotFound from "./pages/NotFound";
import TasksResults from "./pages/staff/tasks_results";
import ClassNotesPage from "./pages/staff/class_notes";
import StaffDashboard from "./pages/staff/index";
import ExcelView from "./pages/students/ExcelView";
import PDFView from "./pages/students/pdfvew";
import ExportPDF from "./pages/students/exportpdf";
import LiveTestPage from "./pages/livetest/testpage";
import LiveFullPage from "./pages/livetest/fullpage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Onboard from "./pages/onboards";
import Members from "./pages/settings/members";

import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CourseCatalog from "./pages/cousres/CourseCatalog";
import CourseDetail from "./pages/cousres/CourseDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/live-class" element={<LiveClass />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/results" element={<Results />} />
              <Route path="/certification" element={<Certification />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/chats" element={<ChatPanel />} />
              <Route path="/support" element={<SupportChat />} />
              <Route path="/subdomains" element={<Subdomains />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              {/* Course routes: /courses = catalog, /courses/:id = detail, /my-courses = role dashboard */}
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/enroll/:id" element={<Enrollment />} />
              <Route path="/create-course" element={<CreateCourse />} />
              {/* Staff / Admin */}
              <Route path="/allstudents" element={<Students />} />
              <Route path="/tresults" element={<TasksResults />} />
              <Route path="/classnotes" element={<ClassNotesPage />} />
              <Route path="/members" element={<Members />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/excel-view" element={<ExcelView />} />
              <Route path="/pdf-view" element={<PDFView />} />
              <Route path="/export-pdf" element={<ExportPDF />} />
              <Route path="/live-test" element={<LiveTestPage />} />
            </Route>
            <Route path="/live-full" element={<LiveFullPage />} />
            <Route path="/onboard" element={<Onboard />} />
          </Route>
          
          <Route element={<ProtectedRoute requireVerified={false} />}>
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
