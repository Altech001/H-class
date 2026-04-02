import { useNavigate } from "react-router-dom";
import { useCourses } from "@/hooks/use-courses";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    BookMarked,
    Plus,
    ArrowRight,
    Clock,
    BookOpen,
    Loader2,
    LayoutGrid,
    GraduationCap,
    TrendingUp,
    CheckCircle2,
    Edit3,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
    DRAFT: { label: "Draft", dot: "bg-slate-400", badge: "bg-slate-100 text-slate-600" },
    PUBLISHED: { label: "Published", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
    IN_PROGRESS: { label: "In Progress", dot: "bg-blue-500 animate-pulse", badge: "bg-blue-50 text-blue-700" },
    COMPLETED: { label: "Completed", dot: "bg-purple-500", badge: "bg-purple-50 text-purple-700" },
    ARCHIVED: { label: "Archived", dot: "bg-slate-300", badge: "bg-slate-50 text-slate-400" },
};

const MyCourses = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isTutor = user?.role?.toUpperCase() === "TUTOR";
    const isStudent = user?.role?.toUpperCase() === "STUDENT";

    const { useGetCourses, useGetMyEnrollments } = useCourses();

    // Tutors: fetch their created courses filtered by tutorId
    const { data: tutorCoursesData, isLoading: loadingTutorCourses } = useGetCourses(
        isTutor ? { tutorId: user?.id } : undefined
    );

    // Students: fetch their enrollment records (includes courseId linkage)
    const { data: enrollmentsData, isLoading: loadingEnrollments } = useGetMyEnrollments();

    // For students we also fetch all published courses to cross-reference with enrollments
    const { data: allCoursesData, isLoading: loadingAllCourses } = useGetCourses(
        isStudent ? { status: "PUBLISHED" } : undefined
    );

    const isLoading = isTutor ? loadingTutorCourses : (loadingEnrollments || loadingAllCourses);

    const tutorCourses = tutorCoursesData?.data || [];
    const enrollments = enrollmentsData?.data || [];
    const allCourses = allCoursesData?.data || [];

    // For students: get enrolled course details cross-referenced
    const enrolledCourses = allCourses.filter((c: any) =>
        enrollments.some((e: any) => e.courseId === c.id)
    );

    // Summary stats
    const tutorDraftCount = tutorCourses.filter((c: any) => c.status === "DRAFT").length;
    const tutorPublishedCount = tutorCourses.filter((c: any) => c.status === "PUBLISHED").length;
    const studentActiveCount = enrollments.filter((e: any) => e.status === "ACTIVE").length;

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-red-800 mx-auto" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        Loading your courses...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-10 animate-in fade-in duration-500">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        {isTutor ? "My Created Courses" : "My Learning Path"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {isTutor
                            ? "All courses you've created and published for students."
                            : "Courses you're currently enrolled in and your progress."}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/courses")}
                        className="text-xs font-bold uppercase h-10 px-4 border-slate-200 gap-2"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        All Courses
                    </Button>
                    {isTutor && (
                        <Button
                            onClick={() => navigate("/create-course")}
                            className="bg-red-800 hover:bg-black text-white font-bold uppercase text-xs h-10 px-5 gap-2 shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Create Course
                        </Button>
                    )}
                </div>
            </div>

            {/* ── Stats Strip ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isTutor ? (
                    <>
                        <StatCard icon={<BookMarked className="w-5 h-5 text-red-800" />} label="Total Courses" value={tutorCourses.length} />
                        <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} label="Published" value={tutorPublishedCount} />
                        <StatCard icon={<Edit3 className="w-5 h-5 text-slate-500" />} label="Drafts" value={tutorDraftCount} />
                        <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Active Students" value={0} sub="across all courses" />
                    </>
                ) : (
                    <>
                        <StatCard icon={<BookOpen className="w-5 h-5 text-red-800" />} label="Enrolled" value={enrollments.length} />
                        <StatCard icon={<TrendingUp className="w-5 h-5 text-blue-600" />} label="In Progress" value={studentActiveCount} />
                        <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} label="Completed" value={enrollments.filter((e: any) => e.status === "COMPLETED").length} />
                        <StatCard icon={<GraduationCap className="w-5 h-5 text-purple-600" />} label="Certificates" value={0} sub="earned" />
                    </>
                )}
            </div>

            {/* ── Course List ── */}
            {isTutor ? (
                <TutorCourseList courses={tutorCourses} navigate={navigate} />
            ) : (
                <StudentCourseList
                    enrolledCourses={enrolledCourses}
                    enrollments={enrollments}
                    navigate={navigate}
                />
            )}
        </div>
    );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub?: string }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            {icon}
        </div>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
    </div>
);

// ─── Tutor Course List ─────────────────────────────────────────────────────────
const TutorCourseList = ({ courses, navigate }: { courses: any[]; navigate: ReturnType<typeof useNavigate> }) => {
    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-xl gap-4">
                <div className="p-4 bg-slate-100 rounded-full">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-slate-700 uppercase">No courses created yet</p>
                    <p className="text-xs text-slate-400 mt-1">Create your first course and start teaching.</p>
                </div>
                <Button
                    onClick={() => navigate("/create-course")}
                    className="bg-red-800 hover:bg-black text-white font-bold uppercase text-xs h-9 px-5 gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create First Course
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">
                All Your Courses — {courses.length} total
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map((course: any) => {
                    const status = statusConfig[course.status] || statusConfig.DRAFT;
                    return (
                        <div
                            key={course.id}
                            className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col"
                        >
                            <div className="p-5 flex-1">
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <BookMarked className="w-5 h-5 text-red-800" />
                                    </div>
                                    <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1", status.badge)}>
                                        <span className={cn("w-1.5 h-1.5 rounded-full inline-block", status.dot)} />
                                        {status.label}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase leading-snug line-clamp-2 mb-2">
                                    {course.title}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {course.description}
                                </p>
                                <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-400 font-semibold">
                                    <span className="flex items-center gap-1">
                                        <span className="font-black text-slate-700">${course.price}</span> price
                                    </span>
                                    <span>·</span>
                                    <span>Pass: {course.passMark}%</span>
                                </div>
                            </div>
                            <div className="px-5 pb-5 border-t border-slate-100 pt-4 flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase h-8 gap-1"
                                >
                                    Manage <ArrowRight className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/notes?courseId=${course.id}`)}
                                    className="text-[10px] font-bold uppercase h-8 px-3 border-slate-200"
                                >
                                    Notes
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Student Course List ───────────────────────────────────────────────────────
const StudentCourseList = ({
    enrolledCourses,
    enrollments,
    navigate,
}: {
    enrolledCourses: any[];
    enrollments: any[];
    navigate: ReturnType<typeof useNavigate>;
}) => {
    if (enrolledCourses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-xl gap-4">
                <div className="p-4 bg-slate-100 rounded-full">
                    <GraduationCap className="w-8 h-8 text-slate-400" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-slate-700 uppercase">No courses yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                        Browse our catalog and enroll to start learning.
                    </p>
                </div>
                <Button
                    onClick={() => navigate("/courses")}
                    className="bg-red-800 hover:bg-black text-white font-bold uppercase text-xs h-9 px-5 gap-2"
                >
                    Browse Courses
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">
                Your Learning Path — {enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {enrolledCourses.map((course: any) => {
                    const enrollment = enrollments.find((e: any) => e.courseId === course.id);
                    const isPaid = enrollment?.paymentStatus === "PAID";
                    const isPartial = enrollment?.paymentStatus === "PARTIAL";

                    return (
                        <div
                            key={course.id}
                            className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-red-800 to-red-500" />
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                        <BookMarked className="w-6 h-6 text-red-800" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="text-sm font-black text-slate-900 uppercase leading-tight">
                                                {course.title}
                                            </h3>
                                            {isPartial && (
                                                <Badge className="bg-amber-50 text-amber-700 border-none text-[9px] font-bold">
                                                    Balance Due
                                                </Badge>
                                            )}
                                        </div>
                                        {course.tutor && (
                                            <p className="text-[11px] text-slate-400 mb-3">
                                                by {course.tutor.firstName} {course.tutor.lastName}
                                            </p>
                                        )}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                <span>Progress</span>
                                                <span className="text-slate-700">0%</span>
                                            </div>
                                            <Progress value={0} className="h-1.5 rounded-full bg-slate-100" />
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-4 bg-slate-100" />

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex gap-4 text-[11px] text-slate-400 font-semibold">
                                        <span className="flex items-center gap-1">
                                            <span className="font-black text-slate-700">${course.price}</span>
                                        </span>
                                        <span>·</span>
                                        <span>Pass: {course.passMark}%</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {isPartial && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/enroll/${course.id}?payBalance=true`)}
                                                className="text-amber-700 border-amber-200 text-[10px] font-bold uppercase h-8 px-3"
                                            >
                                                Pay Balance
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                            className="bg-red-800 hover:bg-black text-white text-[10px] font-bold uppercase h-8 px-4 gap-1"
                                        >
                                            Continue <ArrowRight className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyCourses;
