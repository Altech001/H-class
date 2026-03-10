import { useState } from "react";
import {
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Phone,
    GraduationCap,
    Filter,
    Download,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const studentsData = [
    {
        id: "STU001",
        name: "Hussen JD",
        email: "hussen@example.com",
        grade: "Grade 12",
        status: "active",
        attendance: "95%",
        lastActive: "2 mins ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hussen"
    },
    {
        id: "STU002",
        name: "Sarah Miller",
        email: "sarah.m@example.com",
        grade: "Grade 11",
        status: "active",
        attendance: "88%",
        lastActive: "1 hour ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
        id: "STU003",
        name: "Robert Fox",
        email: "robert.f@example.com",
        grade: "Grade 12",
        status: "inactive",
        attendance: "72%",
        lastActive: "2 days ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
    },
    {
        id: "STU004",
        name: "Emily Wang",
        email: "emily.w@example.com",
        grade: "Grade 10",
        status: "active",
        attendance: "98%",
        lastActive: "Just now",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    },
    {
        id: "STU005",
        name: "Michael Chen",
        email: "m.chen@example.com",
        grade: "Grade 12",
        status: "active",
        attendance: "91%",
        lastActive: "5 mins ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    }
];

const Students = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = studentsData.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h2 className="text-xl  text-slate-900 leading-tight">Student Directory</h2>
                    <p className="text-slate-500 text-[12px] font-medium mt-1">Manage student enrollments and track academic engagement across all grades.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded border-slate-200 text-xs font-bold uppercase  h-10 px-4">
                        <Download className="h-4 w-4 mr-2" /> Export PDF
                    </Button>
                    <Button size="sm" className="rounded text-white text-xs font-bold uppercase  h-10 px-4">
                        <UserPlus className="h-4 w-4 mr-2" /> Add Student
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {[
                    { label: "Total Students", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Currently Active", value: "482", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Avg Attendance", value: "92.4%", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Performance", value: "+12.5%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                    <Card key={i} className="rounded-sm border-none shadow-none hover:shadow-md transition-all relative overflow-hidden group bg-white">
                        <div className="absolute -right-2 -bottom-2 text-slate-100 opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-500">
                            <stat.icon className="h-16 w-16" />
                        </div>
                        <CardContent className="p-5 flex items-center gap-4 relative z-10">
                            <div className={`h-12 w-12 flex items-center justify-center shrink-0`}>
                                <stat.icon className={`${stat.color} h-6 w-6`} />
                            </div>
                            <div>
                                <p className="text-2xl  text-slate-900">{stat.value}</p>
                                <p className="text-[13px] text-slate-400 ">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden mx-2">
                <CardHeader className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search by name, ID or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 rounded focus-visible:ring-0 focus-visible:ring-offset-0 border- outline-none focus:border-primary bg-white/70 border ring-0 ring-border/50 focus-visible:ring-primary text-xs font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-none bg-transparent rounded-none h-10 px-4 text-xs font-bold ">
                            <Filter className="h-4 w-4 mr-2" /> Grade Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12 px-6">Student</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">Student ID</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">Grade Level</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">Attendance</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">Status</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">Last Activity</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id} className="group hover:bg-slate-50/30 transition-colors border-slate-50">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 shadow-none rounded-none">
                                                    <AvatarImage src={student.avatar} />
                                                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{student.name}</span>
                                                    <span className="text-[11px] text-slate-400 font-medium">{student.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-[11px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 border border-slate-100">
                                                {student.id}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-semibold text-slate-600">{student.grade}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm  text-slate-800">{student.attendance}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(
                                                "rounded-full px-2.5 py-0.2 text-[9px]  uppercase ",
                                                student.status === "active"
                                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none hover:bg-transparent"
                                                    : "bg-rose-100 text-rose-400 border border-rose-200 shadow-none hover:bg-transparent"
                                            )}>
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] font-bold text-slate-500">{student.lastActive}</span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-slate-200 py-1">
                                                    <DropdownMenuItem className="text-[11px] rounded-none  cursor-pointer">View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[11px] rounded-none  cursor-pointer">Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[11px] rounded-none  cursor-pointer text-destructive">Suspend Access</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-xs font-bold uppercase ">
                                        No students found matching your criteria
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Students;
