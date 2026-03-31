import React from "react";
import {
    Users,
    BookOpen,
    Video,
    CheckSquare,
    TrendingUp,
    Clock,
    ArrowUpRight,
    MoreHorizontal,
    Play,
    FileText,
    CalendarDays
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Area,
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const engagementData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 38 },
    { name: "Thu", value: 65 },
    { name: "Fri", value: 48 },
    { name: "Sat", value: 80 },
    { name: "Sun", value: 72 },
];

const stats = [
    {
        title: "Total Students",
        value: "1,284",
        change: "+12.5%",
        trend: "up",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Active Classes",
        value: "12",
        change: "Live now",
        trend: "neutral",
        icon: Video,
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
    {
        title: "Notes Shared",
        value: "450",
        change: "+24 this week",
        trend: "up",
        icon: BookOpen,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "Tasks Pending",
        value: "86",
        change: "-5% from last week",
        trend: "up",
        icon: CheckSquare,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    }
];

const upcomingLectures = [
    { id: 1, title: "Advanced Mathematics", time: "10:00 AM", students: 45, status: "live" },
    { id: 2, title: "Physics: Mechanics", time: "01:30 PM", students: 32, status: "scheduled" },
    { id: 3, title: "Organic Chemistry", time: "04:00 PM", students: 28, status: "scheduled" },
];

export default function StaffDashboard() {
    return (
        <div className="p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl tracking-tight text-slate-900">Lecturer Dashboard</h1>
                    <p className="text-slate-500 text-xs">Welcome back! Here's a quick overview of your classes.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded text-xs bg-white">
                        <CalendarDays className="w-3.5 h-3.5 mr-2" />
                        Schedule
                    </Button>
                    <Button size="sm" className="rounded text-xs shadow-none">
                        <Play className="w-3.5 h-3.5 mr-2" />
                        Start Session
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-slate-100 rounded shadow-none">
                        <CardContent className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                {stat.trend === "up" && (
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {stat.change}
                                    </Badge>
                                )}
                            </div>
                            <div>
                                <p className="text-[12px] text-slate-400">{stat.title}</p>
                                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Engagement Chart */}
                <Card className="lg:col-span-3 border-slate-100 rounded shadow-none overflow-hidden flex flex-col">
                    <CardHeader className="p-4 pb-0 shrink-0">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-bold">Student Engagement</CardTitle>
                                <CardDescription className="text-[10px]">Weekly interactive participation levels</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 min-h-0 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Upcoming Lectures & Activity */}
                <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                    <Card className="border-slate-100 rounded shadow-none overflow-hidden flex flex-col flex-1">
                        <CardHeader className="p-4 shrink-0">
                            <CardTitle className="text-sm font-bold">Today's Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 overflow-y-auto no-scrollbar">
                            <div className="space-y-4">
                                {upcomingLectures.map((lecture) => (
                                    <div key={lecture.id} className="group flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${lecture.status === 'live' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                                                {lecture.status === 'live' ? <Video className="w-4 h-4 animate-pulse" /> : <Clock className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-900">{lecture.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-slate-400 font-medium">{lecture.time}</span>
                                                    <span className="text-[10px] text-slate-300">•</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{lecture.students} Students</span>
                                                </div>
                                            </div>
                                        </div>
                                        {lecture.status === 'live' ? (
                                            <Button size="sm" className="h-7 px-3 text-[10px] rounded bg-rose-600 hover:bg-rose-700 shadow-none">
                                                Join
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-600 transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card className="border-slate-100 rounded shadow-none shrink-0">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-indigo-50 text-indigo-600">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Need to Grade</p>
                                    <p className="text-[10px] text-slate-500">14 Physics assignments pending</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] rounded border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                                View Tasks
                            </Button>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </div>
    );
}
