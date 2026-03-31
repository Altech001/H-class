import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAssessments } from "@/hooks/use-assessments";
import { useCourses } from "@/hooks/use-courses";
import { useNotes } from "@/hooks/use-notes";
import { useSessions } from "@/hooks/use-sessions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import {
    ArrowRight,
    Book,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    GraduationCap,
    Info,
    Loader2,
    Play,
    Plus
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MyCourses = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { useGetCourses, useGetMyEnrollments, enrollCourse } = useCourses();
    const { useGetSessionsByCourse } = useSessions();
    const { useGetNotesByCourse } = useNotes();
    const { useGetAssessmentsByCourse } = useAssessments();

    const isStaff = user?.role && ["ADMIN", "TUTOR", "STAFF"].includes(user.role.toUpperCase());

    const { data: allCoursesData, isLoading: loadingAll } = useGetCourses();
    const { data: myEnrollments, isLoading: loadingMy } = useGetMyEnrollments();

    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [view, setView] = useState<"list" | "consent" | "detail">("list");
    const [isEnrolling, setIsEnrolling] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("success") === "true") {
            toast.success("Payment Received! You are now fully enrolled in the specialization.", {
                description: "The course materials have been unlocked in your library.",
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const { data: courseSessions, isLoading: loadingSessions } = useGetSessionsByCourse(selectedCourse?.id);
    const { data: courseNotes, isLoading: loadingNotes } = useGetNotesByCourse(selectedCourse?.id);
    const { data: courseAssessments, isLoading: loadingAssessments } = useGetAssessmentsByCourse(selectedCourse?.id);

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    const handleCourseSelect = (course: any) => {
        setSelectedCourse(course);
        setView("consent");
    };

    const handleEnroll = (courseId: string) => {
        navigate(`/enroll/${courseId}`);
    };

    const handleAcceptConsent = () => {
        setView("detail");
    };

    if (loadingAll || loadingMy) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-800" />
            </div>
        );
    }

    if (view === "consent" && selectedCourse) {
        return (
            <div className="max-w-3xl mx-auto py-10 animate-in fade-in zoom-in duration-500">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("list")}
                    className="mb-6 hover:bg-slate-100 rounded"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Selection
                </Button>

                <Card className=" shadow-none bg-transparent border-none rounded-none overflow-hidden">
                    <div className="h-2 bg-red-600" />
                    <CardHeader className="bg-white p-8 space-y-4">
                        <div className="p-3 bg-red-50 rounded-full w-fit">
                            <Info className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-lg  text-slate-900  uppercase">Academic Integrity & Consent</CardTitle>
                            <CardDescription className="text-xs font-semibold text-slate-500 ">Mandatory Verification for {selectedCourse.title}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="p-6 space-y-4">
                            <p className="text-sm leading-relaxed text-slate-600">
                                By proceeding with this course, you acknowledge that all materials provided are for educational purposes within the H-Class platform. Unauthorized distribution, sharing, or modification of the content is strictly prohibited.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-xs font-bold text-slate-700">I will uphold academic honesty throughout the evaluation.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-xs font-bold text-slate-700">I agree to the laboratory safety and data privacy protocols.</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                onClick={handleAcceptConsent}
                                className="flex-1 bg-red-800 hover:bg-red-700 text-white rounded  uppercase text-[12px] h-12 shadow-lg shadow-red-900/20"
                            >
                                I Accept and Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setView("list")}
                                className="rounded px-8 h-12 text-[12px]  uppercase"
                            >
                                Decline
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (view === "detail" && selectedCourse) {
        return (
            <div className="max-w-4xl mx-auto py-1 animate-in fade-in slide-in-from-right-4 duration-500">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("list")}
                    className="mb-6 hover:bg-slate-100"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Exit to Library
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none bg-transparent shadow-none rounded overflow-hidden">
                            <div className="h-32 w-full flex items-center justify-center bg-red-800/10">
                                <Book className="w-16 h-16 text-red-800" />
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <Badge variant="outline" className="mb-2 text-[10px]   uppercase rounded-sm border-none bg-slate-100 text-slate-600">
                                        Specialization
                                    </Badge>
                                    <h2 className="text-xl  text-slate-900 leading-tight">{selectedCourse.title}</h2>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase">Price: ${selectedCourse.price}</p>
                                </div>

                                <Separator className="bg-slate-100" />

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px]  text-slate-500 uppercase ">
                                        <span>Course Status</span>
                                        <span>{selectedCourse.status}</span>
                                    </div>
                                    <Progress value={0} className="h-1.5 rounded-none bg-slate-100" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-center">
                                        <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                                        <p className="text-[10px]  text-slate-900">{courseSessions?.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) || 0}m</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase">Total Time</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-center">
                                        <GraduationCap className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                                        <p className="text-[10px]  text-slate-900">{selectedCourse.passMark}%</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase">Pass mark</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg  text-slate-900 uppercase flex items-center gap-2">
                                <FileText className="w-5 h-5 text-red-600" />
                                Module Breakdown
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase ">Syllabus v.2026.03</span>
                        </div>

                        {loadingSessions ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-6 h-6 animate-spin text-red-800" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {courseSessions?.length === 0 && (
                                    <div className="p-8 text-center border border-dashed border-slate-200 rounded">
                                        <p className="text-slate-400 text-xs font-bold uppercase">No modules provisioned for this course</p>
                                    </div>
                                )}
                                {courseSessions?.map((module: any, idx: number) => (
                                    <div key={module.id} className="space-y-1">
                                        <div
                                            className={cn(
                                                "group flex items-center gap-4 p-4 rounded border transition-all duration-300",
                                                module.status === "ENDED"
                                                    ? "bg-white border-slate-100 opacity-80"
                                                    : "bg-white border-slate-200 hover:border-red-400 cursor-pointer shadow-sm"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 flex items-center justify-center rounded shrink-0",
                                                module.status === "ENDED" ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500"
                                            )}>
                                                {module.status === "ENDED" ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : (
                                                    <span className="text-[12px] ">{idx + 1}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h5 className={cn(
                                                    "text-sm font-bold leading-tight",
                                                    module.status === "ENDED" ? "text-slate-400" : "text-slate-800"
                                                )}>
                                                    {module.title}
                                                </h5>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {formatDuration(module.duration || 0)}
                                                    </span>
                                                    {module.status === "ENDED" && (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] h-4 rounded-sm px-1 uppercase ">Completed</Badge>
                                                    )}
                                                    {module.status === "LIVE" && (
                                                        <Badge className="bg-red-50 text-red-600 animate-pulse border-none text-[8px] h-4 rounded-sm px-1 uppercase ">Live Now</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            {module.status !== "ENDED" && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-red-500">
                                                    <Play className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Nested Session Notes */}
                                        {courseNotes?.filter((n: any) => n.sessionId === module.id).map((note: any) => (
                                            <div key={note.id} className="ml-14 flex items-center justify-between p-2 px-3 bg-slate-50/50 rounded border border-transparent hover:border-slate-200 transition-all border-dashed group/note">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[200px]">{note.title}</span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-6 text-[8px] uppercase text-red-800 hover:bg-red-50">Download</Button>
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Assessments Section */}
                                {courseAssessments && courseAssessments.length > 0 && (
                                    <div className="pt-6 space-y-3">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase  pl-1 border-l-2 border-red-800 ml-1">Final Assessments</h4>
                                        {courseAssessments.map((asmt: any) => (
                                            <div key={asmt.id} className="flex items-center gap-4 p-4 rounded border border-red-100 bg-red-50/30 group hover:border-red-300 transition-all">
                                                <div className="h-10 w-10 flex items-center justify-center rounded bg-red-100 text-red-800 group-hover:bg-red-800 group-hover:text-white transition-colors">
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-sm font-bold text-slate-800">{asmt.title}</h5>
                                                    <span className="text-[9px] font-bold text-red-500/60 uppercase ">{asmt.type.replace('_', ' ')}</span>
                                                </div>
                                                <Button size="sm" className="bg-white hover:bg-red-800 hover:text-white text-red-800 border-red-200 border text-[10px] uppercase h-8 px-4 shadow-none">Start Now</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-center p-8 border border-dashed border-slate-200 rounded">
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded px-8 h-10 text-[11px]  uppercase ">
                                Start Next Session
                                <Play className="w-3.5 h-3.5 ml-2 fill-white" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const enrolledCourseIds = myEnrollments?.data?.map((e: any) => e.courseId) || [];

    return (
        <div className="space-y-10 max-w-7xl animate-in fade-in duration-700 pb-10">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-4 gap-6 pt-4">
                <div className="space-y-1">
                    <h1 className="text-xl  text-slate-900 leading-none uppercase">CHOOSE COURSE OR OUTGOING</h1>
                    <p className="text-slate-500 text-sm   opacity-70">Enrolled Specializations & Progress</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex gap-8">
                        <div>
                            <p className="text-[10px]  text-slate-500 uppercase  mb-1 font-bold">In Progress</p>
                            <p className="text-2xl  text-slate-900 font-bold">{myEnrollments?.data?.length || 0}</p>
                        </div>
                        <div>
                            <p className="text-[10px]  text-slate-500 uppercase  mb-1 font-bold">Available</p>
                            <p className="text-2xl  text-slate-900 font-bold">{(allCoursesData?.data?.length || 0) - enrolledCourseIds.length}</p>
                        </div>
                    </div>

                    {isStaff && (
                        <Button
                            onClick={() => navigate("/create-course")}
                            className="bg-red-800 hover:bg-black text-white rounded font-bold uppercase text-[11px] h-11 px-6 shadow-lg shadow-red-900/10 active:scale-95 transition-all flex gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Course
                        </Button>
                    )}
                </div>
            </div>

            {/* Continue Learning Horizontal Section */}
            {myEnrollments?.data && myEnrollments.data.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-[11px]  uppercase  text-slate-500 font-bold">Your Learning Path</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-8 w-8 rounded border-slate-200">
                                <ChevronLeft className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-8 w-8 rounded border-slate-200">
                                <ChevronRight className="h-4 w-4 text-slate-600" />
                            </Button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {allCoursesData?.data?.filter((c: any) => enrolledCourseIds.includes(c.id)).map((course: any) => (
                            <Card
                                key={course.id}
                                onClick={() => handleCourseSelect(course)}
                                className="shrink-0 w-[300px] md:w-[350px] snap-start border border-slate-100 rounded shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden bg-white cursor-pointer"
                            >
                                <CardContent className="p-6 space-y-5 flex flex-col h-full relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="h-10 w-10 flex items-center justify-center rounded rotate-3 group-hover:rotate-0 transition-transform bg-red-800/10">
                                            <Book className="h-5 w-5 text-red-800" />
                                        </div>
                                        <Badge variant="outline" className="text-[8px]  uppercase  rounded-sm">
                                            Enrolled
                                        </Badge>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-lg  text-slate-900 leading-tight group-hover:text-red-700 transition-colors uppercase font-bold">
                                            {course.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Valuation: ${course.price}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px]  uppercase  text-slate-400">
                                            <span>Progress</span>
                                            <span className="text-slate-900">30%</span>
                                        </div>
                                        <Progress value={30} className="h-1 rounded-none bg-slate-100" />
                                    </div>

                                    <Separator className="bg-slate-50" />

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 12h 30m</span>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations Grid */}
            <div className="px-4 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">

                        <h3 className="text-md  text-slate-800 font-bold">Available Specializations</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCoursesData?.data?.filter((c: any) => !enrolledCourseIds.includes(c.id)).map((course: any) => (
                        <div key={course.id} className="group bg-white border border-slate-100 p-6 rounded flex items-center justify-between hover:border-red-200 transition-all shadow-xs overflow-hidden relative">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="h-12 w-12 flex items-center justify-center rounded transition-transform group-hover:scale-110 bg-slate-50">
                                    <GraduationCap className="h-6 w-6 text-red-800" />
                                </div>
                                <div>
                                    <h5 className=" text-[13px] text-slate-800 uppercase leading-none mb-1 font-bold">{course.title}</h5>
                                    <p className="text-[12px] font-bold text-red-600/60 uppercase">Price: ${course.price}</p>
                                </div>
                            </div>

                            {!isStaff ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isEnrolling === course.id}
                                    onClick={() => handleEnroll(course.id)}
                                    className="h-10 px-4 text-slate-400 group-hover:text-red-800 group-hover:bg-red-50 transition-all font-bold uppercase text-[10px] border border-transparent hover:border-red-200"
                                >
                                    {isEnrolling === course.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll Now"}
                                </Button>
                            ) : (
                                <Badge variant="destructive" className="text-xs  text-red-100 p-2 border-none rounded">
                                    Students Only
                                </Badge>
                            )}
                        </div>
                    ))}

                    {allCoursesData?.data?.filter((c: any) => !enrolledCourseIds.includes(c.id)).length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded">
                            <p className="text-slate-400 text-sm font-bold uppercase ">No new courses available for enrollment</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Trophy = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
);

export default MyCourses;
