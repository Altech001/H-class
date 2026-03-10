import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ChevronLeft,
    ChevronRight,
    PlayCircle,
    Clock,
    BookOpen,
    ShieldCheck,
    Globe,
    Lock,
    Server,
    Shield,
    Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const myCourses = [
    {
        id: 1,
        title: "Introduction to Cybersecurity",
        instructor: "Dr. Sarah Chen",
        progress: 65,
        thumbnail: "/cyber_security_course_thumb.png", // Will need to handle the real path or use a placeholder if not found, but I generated these.
        duration: "12h 30m",
        modules: 12,
        category: "Cyber",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        id: 2,
        title: "Network Security & Defense",
        instructor: "Prof. James Miller",
        progress: 30,
        thumbnail: "/cloud_computing_course_thumb.png",
        duration: "15h 45m",
        modules: 18,
        category: "IT",
        icon: Server,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        id: 3,
        title: "Ethical Hacking & Pentesting",
        instructor: "Ms. Emily Park",
        progress: 85,
        thumbnail: "/cyber_security_course_thumb.png",
        duration: "20h 10m",
        modules: 24,
        category: "Cyber",
        icon: Lock,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        id: 4,
        title: "Cloud Infrastructure Security",
        instructor: "David Wilson",
        progress: 10,
        thumbnail: "/cloud_computing_course_thumb.png",
        duration: "10h 20m",
        modules: 10,
        category: "IT",
        icon: Globe,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    }
];

const MyCourses = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="space-y-10 max-w-7xl animate-in fade-in duration-700 pb-10">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-4 gap-6">
                <div className="space-y-0">

                </div>

                <div className="flex gap-4">
                    <div className=" p-4 rounded-none min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-600   mb-1">In Progress</p>
                        <p className="text-2xl font-black text-slate-900">4</p>
                    </div>
                    <div className=" p-4 rounded-none min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-600   mb-1">Completed</p>
                        <p className="text-2xl font-black text-slate-900">12</p>
                    </div>
                </div>
            </div>

            {/* Continue Learning Horizontal Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-[12px] font-black  text-slate-600 ">Continue Learning</h3>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("left")}
                            className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("right")}
                            className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

                    {myCourses.map((course) => (
                        <Card
                            key={course.id}
                            className="shrink-0 w-[320px] md:w-[380px] snap-start border border-slate-100 rounded-none shadow-none hover: transition-all duration-500 group relative overflow-hidden bg-white"
                        >
                            {/* Large Watermark Icon */}
                            <div className="absolute -right-6 -top-6 text-slate-50 opacity-10 pointer-events-none group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                                <course.icon className="h-48 w-48" />
                            </div>

                            <CardContent className="p-0 flex flex-col h-full relative z-10">
                                {/* Thumbnail Header */}
                                <div className="h-40 w-full relative overflow-hidden bg-slate-200">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                                    {/* Using a placeholder because the generated image paths are deep. In a real app we'd use icons or dynamic imports */}
                                    <div className={cn("absolute inset-0 flex items-center justify-center opacity-80 blur-sm", course.bg)}>
                                        <course.icon className={cn("h-28 w-28", course.color)} />
                                    </div>
                                    <div className="absolute bottom-4 left-6 z-20">
                                        <span className="bg-white/10 backdrop-blur-md border rounded border-white/20 text-white text-[9px] font-black  px-2 py-1 ">
                                            {course.category} Specialization
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                                            <Play className="h-10 w-10 text-slate-900 fill-slate-900" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors  ">
                                            {course.title}
                                        </h4>
                                        <p className="text-[11px] font-bold text-slate-400 mt-1">Instructor: {course.instructor}</p>
                                    </div>

                                    {/* Progress Section */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-black   text-slate-500">
                                            <span>Progress</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <Progress value={course.progress} className="h-1 rounded-none bg-slate-100" />
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 ">{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="h-3 w-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 ">{course.modules} Modules</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-8 rounded text-[10px] border-rose-500 text-rose-500   hover:bg-rose-50 hover:text-rose-500 hover:border-rose-500">
                                            Resume <ChevronRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recommendations Grid */}
            <div className="px-4 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-emerald-600" />
                    <h3 className="text-xl font-black text-slate-900  ">Recommended for you</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Cloud Security Architecture", icon: Shield, col: "text-blue-600", bg: "bg-blue-50" },
                        { title: "Advanced Network Forensics", icon: Server, col: "text-purple-600", bg: "bg-purple-50" },
                        { title: "Cyber Policy & Governance", icon: Lock, col: "text-amber-600", bg: "bg-amber-50" },
                    ].map((item, i) => (
                        <div key={i} className="group relative bg-white border border-slate-100 p-6 flex items-start gap-4 transition-all hover:bg-slate-50 cursor-pointer overflow-hidden">
                            <div className={cn("shrink-0 h-12 w-12 flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                                <item.icon className={cn("h-6 w-6", item.col)} />
                            </div>
                            <div className="relative z-10">
                                <h5 className="font-black text-sm text-slate-800   leading-4 mb-2">{item.title}</h5>
                                <p className="text-[10px] font-bold text-slate-400  ">Enroll Now</p>
                            </div>
                            <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none group-hover:scale-150 transition-transform">
                                <item.icon className="h-16 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
