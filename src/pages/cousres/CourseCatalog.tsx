import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "@/hooks/use-courses";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    BookOpen,
    GraduationCap,
    Search,
    SlidersHorizontal,
    Plus,
    ArrowRight,
    Clock,
    Users,
    Star,
    CheckCircle2,
    Loader2,
    BookMarked,
    DollarSign,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListCoursesDto } from "@/types/api";

const statusConfig: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Draft", color: "bg-slate-100 text-slate-600" },
    PUBLISHED: { label: "Published", color: "bg-emerald-50 text-emerald-700" },
    IN_PROGRESS: { label: "In Progress", color: "bg-blue-50 text-blue-700" },
    COMPLETED: { label: "Completed", color: "bg-purple-50 text-purple-700" },
    ARCHIVED: { label: "Archived", color: "bg-slate-100 text-slate-400" },
};

const CourseCatalog = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isTutor = user?.role?.toUpperCase() === "TUTOR";
    const isStudent = user?.role?.toUpperCase() === "STUDENT";

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("PUBLISHED");

    const params: ListCoursesDto = {
        status: statusFilter as any,
        search: search || undefined,
    };

    const { useGetCourses, useGetMyEnrollments } = useCourses();
    const { data: coursesData, isLoading } = useGetCourses(params);
    const { data: enrollmentsData } = useGetMyEnrollments();

    const courses = coursesData?.data || [];
    const enrolledCourseIds: string[] = enrollmentsData?.data?.map((e: any) => e.courseId) || [];

    const statusTabs = isTutor
        ? ["DRAFT", "PUBLISHED", "IN_PROGRESS", "COMPLETED"]
        : ["PUBLISHED"];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        {isTutor ? "Course Library" : "Available Courses"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {isTutor
                            ? "Manage your published courses and drafts"
                            : "Enroll in a specialization to begin your learning journey"}
                    </p>
                </div>
                {isTutor && (
                    <Button
                        onClick={() => navigate("/create-course")}
                        className="bg-red-800 hover:bg-black text-white font-bold uppercase text-xs h-10 px-5 gap-2 shrink-0 shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Course
                    </Button>
                )}
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search courses..."
                        className="pl-9 h-10 border-slate-200 focus-visible:ring-red-800/30"
                    />
                </div>

                {isTutor && (
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                        {statusTabs.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={cn(
                                    "text-[10px] font-bold uppercase px-3 py-1.5 rounded-md transition-all",
                                    statusFilter === s
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {s.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Course Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-red-800" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                            Loading courses...
                        </p>
                    </div>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-xl gap-4">
                    <div className="p-4 bg-slate-100 rounded-full">
                        <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-700 uppercase">
                            {isTutor ? "No courses yet" : "No courses available"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            {isTutor
                                ? "Create your first course to get started."
                                : "Check back soon for new courses."}
                        </p>
                    </div>
                    {isTutor && (
                        <Button
                            onClick={() => navigate("/create-course")}
                            className="bg-red-800 hover:bg-black text-white font-bold uppercase text-xs h-9 px-5 gap-2 mt-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create First Course
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course: any) => {
                        const isEnrolled = enrolledCourseIds.includes(course.id);
                        const status = statusConfig[course.status] || statusConfig.PUBLISHED;

                        return (
                            <div
                                key={course.id}
                                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-red-200 hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {/* Top accent bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-red-800 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Card Header */}
                                <div className="p-6 pb-4 flex items-start justify-between gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-800 transition-colors duration-300">
                                        <BookMarked className="w-6 h-6 text-red-800 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEnrolled && (
                                            <Badge className="bg-emerald-50 text-emerald-700 border-none text-[10px] font-bold uppercase rounded-md px-2">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Enrolled
                                            </Badge>
                                        )}
                                        <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-md", status.color)}>
                                            {status.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-6 pb-4 flex-1">
                                    <h3 className="text-base font-black text-slate-900 uppercase leading-snug line-clamp-2 group-hover:text-red-800 transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                                        {course.description}
                                    </p>

                                    {course.tutor && (
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-black text-slate-600">
                                                {course.tutor.firstName?.[0]}
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-500">
                                                {course.tutor.firstName} {course.tutor.lastName}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-6 pt-2 border-t border-slate-100 mt-auto">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-red-800">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="text-lg font-black">{course.price}</span>
                                        </div>

                                        {isTutor ? (
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/courses/${course.id}`)}
                                                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase h-8 px-4 gap-1"
                                            >
                                                Manage
                                                <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        ) : isEnrolled ? (
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/courses/${course.id}`)}
                                                className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold uppercase h-8 px-4 gap-1"
                                            >
                                                Continue
                                                <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/enroll/${course.id}`)}
                                                className="bg-red-800 hover:bg-black text-white text-[10px] font-bold uppercase h-8 px-4 gap-1 transition-all active:scale-95"
                                            >
                                                Enroll Now
                                                <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CourseCatalog;
