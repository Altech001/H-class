import { useState, useEffect } from "react";
import {
    Search,
    MoreVertical,
    Download,
    Users,
    Loader2
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

import { useCourses } from "@/hooks/use-courses";
import { useAuthStore } from "@/store/auth-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Students = () => {
    const { user } = useAuthStore();
    const { useGetCourses, useGetCourseStudents } = useCourses();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");

    // Fetch tutor's courses
    const { data: coursesData, isLoading: isLoadingCourses } = useGetCourses({
        tutorId: user?.id,
        status: "PUBLISHED"
    });

    // Fetch students for the selected course
    const { data: studentsDataResponse, isLoading: isLoadingStudents } = useGetCourseStudents(selectedCourseId);

    const students = studentsDataResponse?.data || [];

    const filteredStudents = students.filter((enrollment: any) => {
        const studentName = `${enrollment.user.firstName} ${enrollment.user.lastName}`.toLowerCase();
        const studentId = enrollment.userId.toLowerCase();
        const studentEmail = enrollment.user.email.toLowerCase();
        const query = searchQuery.toLowerCase();

        return studentName.includes(query) ||
            studentId.includes(query) ||
            studentEmail.includes(query);
    });

    // Handle initial course selection
    useEffect(() => {
        if (!selectedCourseId && coursesData?.data && coursesData.data.length > 0) {
            setSelectedCourseId(coursesData.data[0].id);
        }
    }, [coursesData, selectedCourseId]);

    return (
        <div className="space-y-6 max-w-7xl animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h2 className="text-xl  text-slate-900 leading-tight">Student Directory</h2>
                    <p className="text-slate-500 text-[12px] font-medium mt-1">Manage student enrollments and track academic engagement across all grades.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger className="w-[200px] h-10 border-slate-200 rounded uppercase text-[10px] font-bold">
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                            {coursesData?.data?.map((course: any) => (
                                <SelectItem key={course.id} value={course.id} className="text-[11px] uppercase font-bold">
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="rounded border-slate-200 text-xs font-bold uppercase  h-10 px-4">
                        <Download className="h-4 w-4 mr-2" /> Export PDF
                    </Button>

                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {[
                    { label: "Current Enrollments", value: studentsDataResponse?.meta?.total?.toLocaleString() || "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
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

                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12 px-6">Student</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">User ID</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">Enrollment Status</TableHead>
                                <TableHead className=" text-[10px] uppercase font-bold  text-slate-700 h-12">Joined Date</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingStudents ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-300" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((enrollment: any) => (
                                    <TableRow key={enrollment.id} className="group hover:bg-slate-50/30 transition-colors border-slate-50">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 shadow-none rounded-none">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${enrollment.user.firstName}`} />
                                                    <AvatarFallback>{enrollment.user.firstName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{enrollment.user.firstName} {enrollment.user.lastName}</span>
                                                    <span className="text-[11px] text-slate-400 font-medium">{enrollment.user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-[11px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 border border-slate-100">
                                                {enrollment.userId.split('-')[0].toUpperCase()}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(
                                                "rounded-full px-2.5 py-0.2 text-[9px]  uppercase ",
                                                "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none hover:bg-transparent"
                                            )}>
                                                Confirmed
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] font-bold text-slate-500">{new Date(enrollment.createdAt).toLocaleDateString()}</span>
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
