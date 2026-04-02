import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/hooks/use-courses";
import { useNotes } from "@/hooks/use-notes";
import { useSessions } from "@/hooks/use-sessions";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    ChevronLeft,
    BookMarked,
    FileText,
    Clock,
    GraduationCap,
    Play,
    Download,
    CheckCircle2,
    Loader2,
    Users,
    Plus,
    Edit3,
    ExternalLink,
    BookOpen,
    Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; badge: string }> = {
    DRAFT: { label: "Draft", badge: "bg-slate-100 text-slate-600" },
    PUBLISHED: { label: "Published", badge: "bg-emerald-50 text-emerald-700" },
    IN_PROGRESS: { label: "In Progress", badge: "bg-blue-50 text-blue-700" },
    COMPLETED: { label: "Completed", badge: "bg-purple-50 text-purple-700" },
    ARCHIVED: { label: "Archived", badge: "bg-slate-50 text-slate-400" },
};

const CourseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isTutor = user?.role?.toUpperCase() === "TUTOR";
    const isStudent = user?.role?.toUpperCase() === "STUDENT";

    const { useGetCourse, useGetMyEnrollments, publishCourse, completeCourse } = useCourses();
    const { data: course, isLoading: loadingCourse } = useGetCourse(id!);
    const { data: enrollmentsData } = useGetMyEnrollments();

    const { useGetNotesByCourse, getNoteDownloadUrl, isGettingDownloadUrl } = useNotes();
    const { data: notes, isLoading: loadingNotes } = useGetNotesByCourse(id!);

    const { useGetSessionsByCourse } = useSessions();
    const { data: sessions, isLoading: loadingSessions } = useGetSessionsByCourse(id!);

    const [publishingCourse, setPublishingCourse] = useState(false);
    const [completingCourse, setCompletingCourse] = useState(false);

    const enrollment = enrollmentsData?.data?.find((e: any) => e.courseId === id);
    const isEnrolled = !!enrollment;

    // Only tutors who own the course or enrolled students may view full details
    const canAccess = isTutor || isEnrolled;

    const handleDownloadNote = async (note: any) => {
        try {
            const url = await getNoteDownloadUrl(note.id);
            if (url) window.open(url, "_blank");
        } catch {
            toast.error("Failed to get download link");
        }
    };

    const handlePublish = async () => {
        if (!id) return;
        setPublishingCourse(true);
        try {
            await publishCourse(id);
            toast.success("Course published successfully!");
        } catch {
            toast.error("Failed to publish course");
        } finally {
            setPublishingCourse(false);
        }
    };

    const handleComplete = async () => {
        if (!id) return;
        setCompletingCourse(true);
        try {
            await completeCourse(id);
            toast.success("Course marked as completed!");
        } catch {
            toast.error("Failed to complete course");
        } finally {
            setCompletingCourse(false);
        }
    };

    if (loadingCourse) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-red-800 mx-auto" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        Loading course...
                    </p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
                <BookOpen className="w-12 h-12 text-slate-300" />
                <p className="text-sm font-bold text-slate-700 uppercase">Course not found</p>
                <Button onClick={() => navigate("/courses")} variant="outline" className="text-xs font-bold uppercase">
                    Back to Catalog
                </Button>
            </div>
        );
    }

    const status = statusConfig[course.status] || statusConfig.PUBLISHED;
    const isOwner = isTutor && (course as any).tutorId === user?.id;

    return (
        <div className="max-w-5xl mx-auto py-6 px-4 animate-in fade-in duration-500">
            {/* Back + Actions */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(isTutor ? "/my-courses" : "/my-courses")}
                    className="text-slate-500 hover:text-slate-900 -ml-2"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    My Courses
                </Button>

                {isOwner && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {course.status === "DRAFT" && (
                            <Button
                                size="sm"
                                onClick={handlePublish}
                                disabled={publishingCourse}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase h-9 px-4 gap-2"
                            >
                                {publishingCourse ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Publish
                            </Button>
                        )}
                        {course.status === "IN_PROGRESS" && (
                            <Button
                                size="sm"
                                onClick={handleComplete}
                                disabled={completingCourse}
                                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold uppercase h-9 px-4 gap-2"
                            >
                                {completingCourse ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Mark Complete
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={() => navigate(`/notes?courseId=${id}`)}
                            variant="outline"
                            className="text-xs font-bold uppercase h-9 px-4 border-slate-200 gap-2"
                        >
                            <FileText className="w-3 h-3" />
                            Manage Notes
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs font-bold uppercase h-9 px-3 border-slate-200"
                            onClick={() => navigate(`/courses/${id}/students`)}
                        >
                            <Users className="w-3 h-3" />
                        </Button>
                    </div>
                )}

                {isStudent && !isEnrolled && (
                    <Button
                        onClick={() => navigate(`/enroll/${id}`)}
                        className="bg-red-800 hover:bg-black text-white text-xs font-bold uppercase h-9 px-5 gap-2 active:scale-95 transition-all"
                    >
                        Enroll Now
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Left: Course Meta ── */}
                <div className="space-y-5">
                    {/* Course Card */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="h-36 bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                            <BookMarked className="w-16 h-16 text-white/30" />
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-md", status.badge)}>
                                    {status.label}
                                </span>
                                {enrollment?.paymentStatus === "PARTIAL" && (
                                    <Badge className="bg-amber-50 text-amber-700 border-none text-[10px]">Balance Due</Badge>
                                )}
                            </div>
                            <h1 className="text-lg font-black text-slate-900 uppercase leading-snug">
                                {course.title}
                            </h1>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {(course as any).description}
                            </p>
                            <Separator className="bg-slate-100" />
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-slate-600">
                                    <span className="font-semibold text-slate-400 uppercase text-[10px]">Price</span>
                                    <span className="font-black text-slate-900">${course.price}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span className="font-semibold text-slate-400 uppercase text-[10px]">Pass Mark</span>
                                    <span className="font-black text-slate-900">{course.passMark}%</span>
                                </div>
                                {isStudent && (
                                    <div className="flex justify-between text-slate-600">
                                        <span className="font-semibold text-slate-400 uppercase text-[10px]">Progress</span>
                                        <span className="font-black text-slate-900">0%</span>
                                    </div>
                                )}
                            </div>
                            {isStudent && (
                                <Progress value={0} className="h-1.5 rounded-full bg-slate-100" />
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                            <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1.5" />
                            <p className="text-sm font-black text-slate-900">
                                {sessions?.length || 0}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Sessions</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                            <FileText className="w-4 h-4 text-slate-400 mx-auto mb-1.5" />
                            <p className="text-sm font-black text-slate-900">
                                {notes?.length || 0}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Notes</p>
                        </div>
                    </div>
                </div>

                {/* ── Right: Sessions + Notes ── */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Access gate for non-enrolled students */}
                    {isStudent && !isEnrolled && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
                            <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                                <Lock className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-amber-900 uppercase">Enrollment Required</p>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                    Enroll in this course to access sessions, notes, and other materials.
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/enroll/${id}`)}
                                    className="mt-3 bg-red-800 hover:bg-black text-white text-xs font-bold uppercase h-8 px-4"
                                >
                                    Enroll Now
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Sessions */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                                <Play className="w-4 h-4 text-red-800" />
                                Sessions
                            </h2>
                            {isOwner && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-[10px] font-bold uppercase h-7 px-3 border-slate-200 gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Session
                                </Button>
                            )}
                        </div>

                        {loadingSessions ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin text-red-800" />
                            </div>
                        ) : sessions?.length === 0 ? (
                            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                    {isOwner ? "No sessions yet. Add the first session." : "No sessions scheduled."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {sessions?.map((session: any, idx: number) => (
                                    <div
                                        key={session.id}
                                        className={cn(
                                            "group flex items-center gap-4 p-4 rounded-xl border transition-all",
                                            session.status === "ENDED"
                                                ? "bg-slate-50 border-slate-100"
                                                : "bg-white border-slate-200 hover:border-red-300 hover:shadow-sm cursor-pointer"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-9 w-9 flex items-center justify-center rounded-lg shrink-0 text-sm font-black",
                                            session.status === "ENDED"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-800"
                                        )}>
                                            {session.status === "ENDED" ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{session.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {session.duration || 0}m
                                                </span>
                                                {session.status === "LIVE" && (
                                                    <Badge className="bg-red-50 text-red-600 border-none text-[9px] font-bold animate-pulse px-1.5 h-4">
                                                        Live
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {session.status !== "ENDED" && canAccess && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-red-800 shrink-0">
                                                <Play className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-800" />
                                Course Notes
                            </h2>
                            {isOwner && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/notes?courseId=${id}`)}
                                    className="text-[10px] font-bold uppercase h-7 px-3 border-slate-200 gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Upload Note
                                </Button>
                            )}
                        </div>

                        {loadingNotes ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin text-red-800" />
                            </div>
                        ) : !canAccess ? null : notes?.length === 0 ? (
                            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                    {isOwner ? "No notes uploaded yet." : "No notes available for this course."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {notes?.map((note: any) => (
                                    <div
                                        key={note.id}
                                        className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group"
                                    >
                                        <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-blue-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{note.title}</p>
                                            <p className="text-[10px] text-slate-400">
                                                {new Date(note.createdAt).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDownloadNote(note)}
                                            disabled={isGettingDownloadUrl}
                                            className="text-[10px] font-bold uppercase text-red-800 hover:bg-red-50 h-8 px-3 gap-1 shrink-0"
                                        >
                                            {isGettingDownloadUrl ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Download className="w-3 h-3" />
                                            )}
                                            Download
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
