import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, ClipboardList, BarChart3, Award, BookOpen, Users, Play, Calendar as CalendarIcon, ChevronRight, ChevronLeft, Info, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";
import React from "react";
import Autoplay from "embla-carousel-autoplay";

const stats = [
  { label: "Courses Enrolled", value: "6", icon: BookOpen, color: "text-primary" },
  { label: "Tasks Pending", value: "4", icon: ClipboardList, color: "text-accent" },
  { label: "Live Sessions", value: "2", icon: Video, color: "text-success" },
  { label: "Classmates", value: "32", icon: Users, color: "text-muted-foreground" },
];

const banners = [
  {
    title: "System Updates & Announcements",
    description: "Keep an eye on the dashboard for the latest system updates, new features, and important university announcements.",
    color: "bg-[#2563EB]",
  },
  {
    title: "Exam Schedule Released",
    description: "The final exam schedule for the current semester is now available. Please check your course pages for details.",
    color: "bg-[#7C3AED]",
  },
  {
    title: "New Library Resources",
    description: "Successfully integrated with the Global Digital Library. Access over 1 million new academic journals today.",
    color: "bg-[#059669]",
  }
];

const recordings = [
  { title: "Advanced Calculus - Week 4", duration: "1h 20m", date: "Mar 5, 2024", thumbnail: "bg-orange-100" },
  { title: "Quantum Physics Introduction", duration: "45m", date: "Mar 4, 2024", thumbnail: "bg-blue-100" },
  { title: "English: Modernist Poetry", duration: "1h 05m", date: "Mar 2, 2024", thumbnail: "bg-purple-100" },
];

const attendanceData = [
  { name: "Attended", value: 85, fill: "#2563EB" },
  { name: "Missed", value: 15, fill: "#E5E7EB" },
];


const upcomingClasses = [
  { subject: "Mathematics", time: "10:00 AM", teacher: "Dr. Sarah Chen" },
  { subject: "Physics", time: "1:00 PM", teacher: "Prof. James Miller" },
  { subject: "English Literature", time: "3:30 PM", teacher: "Ms. Emily Park" },
];

const Index = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-700 pb-10">
      {/* Announcements Banner */}
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative group"
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={index}>
              <div className={`relative overflow-hidden rounded-none p-8 min-h-[160px] flex flex-col justify-center ${banner.color} text-white shadow-lg`}>
                <div className="absolute -right-10 -top-10 h-20 w-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -left-5 -bottom-5 h-20 w-24 bg-black/10 rounded-full blur-2xl" />
                <div className="relative z-10 space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase  backdrop-blur-sm">Updates</span>
                  </div>
                  <h2 className="text-xl sm:text-xl font-bold">{banner.title}</h2>
                  <p className="text-white/80 text-xs sm:text-sm line-clamp-2">{banner.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 right-8 flex gap-2">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/20 border-none text-white hover:bg-white/40 backdrop-blur-md" />
          <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/20 border-none text-white hover:bg-white/40 backdrop-blur-md" />
        </div>
      </Carousel>

      {/* Stats and Attendance Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black uppercase  text-slate-800">Quick Insights</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-8 w-8 border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-8 w-8 border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-95"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

          {/* Attendance Percentage Card (Circular Progress) */}
          <Card className="shrink-0 w-[240px] md:w-[280px] snap-start rounded-none shadow-none relative overflow-hidden group border border-slate-100">
            <div className="absolute -right-4 -bottom-4 text-slate-100 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <BarChart3 className="h-24 w-24" />
            </div>
            <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
              <p className="text-[11px] font-black uppercase text-muted-foreground/60 mb-4 w-full text-center ">Class Attendance</p>
              <div className="h-32 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                      ))}
                      <Label
                        value={`${attendanceData[0].value}%`}
                        position="center"
                        className="text-2xl font-black fill-slate-900"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regular Stats */}
          {stats.map((stat) => (
            <Card key={stat.label} className="shrink-0 w-[240px] md:w-[280px] snap-start border border-slate-100 rounded-none shadow-none hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white relative overflow-hidden group">
              <div className="absolute -right-1 -top-0 text-slate-100 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 pointer-events-none">
                <stat.icon className="h-20 w-20" />
              </div>
              <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                <div className="h-10 w-10 rounded-sm flex items-center justify-center shrink-0 mb-6 ">
                  {/* <stat.icon className={`h-5 w-5 ${stat.color}`} /> */}
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase ">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Scheduled & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Classes */}
          <Card className="border-none shadow-sm overflow-hidden rounded-none">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">Upcoming Classes</CardTitle>
              </div>
              <Link to="/live-class" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group">
                Full Schedule <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {upcomingClasses.map((cls) => (
                  <div key={cls.subject} className="flex items-center gap-4 p-5 hover:bg-secondary/20 transition-colors">
                    <div className="h-10 w-10 flex items-center justify-center shrink-0">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground text-sm ">{cls.subject}</p>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-xs font-medium text-muted-foreground">{cls.teacher}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-primary/80">
                          <Info className="h-3 w-3" /> Online Session
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 ">{cls.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recordings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-md font-semibold flex items-center gap-2">
                Top Recordings
              </h3>
              <Link to="/recordings" className="text-xs  font-medium text-blue-500 underline hover:text-foreground">See all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordings.map((rec, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden group cursor-pointer hover:shadow-md rounded-none transition-all">
                  <div className={`h-24 w-full ${rec.thumbnail} relative flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
                    <div className="h-10 w-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform z-10">
                      <Play className="h-4 w-4 text-primary fill-primary" />
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {rec.duration}
                    </span>
                  </div>
                  <CardContent className="p-3">
                    <p className="font-bold text-xs truncate group-hover:text-primary transition-colors">{rec.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{rec.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Calendar & Tasks */}
        <div className="space-y-6">
          {/* Calendar Card */}
          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                Daily Calendar
                <CalendarIcon className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-none  border-none w-full"
              />
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Index;
