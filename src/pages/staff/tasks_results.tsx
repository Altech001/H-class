import { useState } from "react";
import {
    Search,
    Plus,
    MoreVertical,
    FileText,
    CheckSquare,
    MessageSquare,
    Filter,
    Download,
    Upload,
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ChevronRight,
    GraduationCap
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const tasksData = [
    {
        id: "TSK-2024-001",
        title: "Calculus III: Chain Rule Application",
        subject: "Mathematics",
        assignedTo: "Grade 12-A",
        dueDate: "Dec 15, 2023",
        submissions: 24,
        totalStudents: 30,
        status: "active",
        priority: "high"
    },
    {
        id: "TSK-2024-002",
        title: "Quantum Mechanics Fundamentals",
        subject: "Physics",
        assignedTo: "Grade 11-B",
        dueDate: "Dec 18, 2023",
        submissions: 12,
        totalStudents: 28,
        status: "active",
        priority: "medium"
    },
    {
        id: "TSK-2024-003",
        title: "The Great Gatsby: Character Analysis",
        subject: "English Literature",
        assignedTo: "Grade 10-C",
        dueDate: "Dec 10, 2023",
        submissions: 30,
        totalStudents: 30,
        status: "closed",
        priority: "low"
    }
];

const submissionsData = [
    {
        id: "SUB-001",
        student: "Hussen JD",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hussen",
        task: "Calculus III: Chain Rule Application",
        submittedAt: "2 mins ago",
        status: "pending",
        fileSize: "2.4 MB",
        type: "PDF",
        grade: null,
        comments: 0
    },
    {
        id: "SUB-002",
        student: "Sarah Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        task: "Quantum Mechanics Fundamentals",
        submittedAt: "1 hour ago",
        status: "marked",
        fileSize: "1.8 MB",
        type: "DOCX",
        grade: "A+",
        comments: 2
    },
    {
        id: "SUB-003",
        student: "Robert Fox",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        task: "Calculus III: Chain Rule Application",
        submittedAt: "5 hours ago",
        status: "pending",
        fileSize: "3.1 MB",
        type: "PDF",
        grade: null,
        comments: 0
    },
    {
        id: "SUB-004",
        student: "Emily Wang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        task: "The Great Gatsby: Character Analysis",
        submittedAt: "1 day ago",
        status: "marked",
        fileSize: "4.2 MB",
        type: "PDF",
        grade: "B",
        comments: 5
    }
];

const TasksResults = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("submissions");

    // Dialog States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isMarkingOpen, setIsMarkingOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-7xl animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h2 className="text-md text-slate-900 leading-tight  uppercase ">Assessment & Tasks</h2>
                    <p className="text-slate-500 text-[12px] font-medium mt-1 uppercase ">
                        Track submissions, grade assignments, and manage academic resources.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded border-slate-200 text-xs font-bold uppercase h-10 px-4">
                                <Upload className="h-4 w-4 mr-2" /> Upload Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-none border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl  uppercase er">Upload Educational Resource</DialogTitle>
                                <DialogDescription className="text-xs font-medium text-slate-400 uppercase">
                                    Distribute new assignments or study materials to your classes.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-[10px]  uppercase text-slate-500">Task Title</Label>
                                    <Input id="title" placeholder="e.g. Advanced Thermodynamics Quiz" className="rounded-none border-slate-100 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject" className="text-[10px]  uppercase text-slate-500">Subject</Label>
                                        <Select>
                                            <SelectTrigger className="rounded-none border-slate-100 bg-slate-50 capitalize">
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none">
                                                <SelectItem value="math">Mathematics</SelectItem>
                                                <SelectItem value="physics">Physics</SelectItem>
                                                <SelectItem value="english">English</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="grade" className="text-[10px]  uppercase text-slate-500">Target Grade</Label>
                                        <Select>
                                            <SelectTrigger className="rounded-none border-slate-100 bg-slate-50 uppercase">
                                                <SelectValue placeholder="Grade" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none">
                                                <SelectItem value="10">Grade 10</SelectItem>
                                                <SelectItem value="11">Grade 11</SelectItem>
                                                <SelectItem value="12">Grade 12</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-[10px]  uppercase text-slate-500">Instructions (Optional)</Label>
                                    <Textarea id="description" placeholder="Provide extra context for students..." className="rounded-none border-slate-100 bg-slate-50 min-h-[100px]" />
                                </div>
                                <div className="border-2 border-dashed border-slate-100 p-8 text-center bg-slate-50/50 group hover:border-primary/30 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Click to browse or drag & drop files</p>
                                        <p className="text-[8px] text-slate-300 uppercase">PDF, DOCX, JPG (Max 15MB)</p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="text-xs font-bold uppercase rounded-none">Cancel</Button>
                                <Button className="text-xs font-bold uppercase rounded-none px-8">Confirm Upload</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button size="sm" className="rounded text-white bg-slate-900 hover:bg-slate-800 text-xs font-bold uppercase h-10 px-4 transition-colors">
                        <Plus className="h-4 w-4 mr-2" /> New Assignment
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {[
                    { label: "Pending Mark", value: "24", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Completion Rate", value: "88%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Avg. Grade", value: "B+", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Active Tasks", value: "12", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                    <Card key={i} className="rounded border-none shadow-none hover:shadow-md transition-all relative overflow-hidden group bg-white">
                        <div className="absolute -right-2 -bottom-2 text-slate-100 opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-500">
                            <stat.icon className="h-16 w-16" />
                        </div>
                        <CardContent className="p-5 flex items-center gap-4 relative z-10">
                            <div className={cn("h-12 w-12 flex items-center justify-center shrink-0 rounded-full", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div>
                                <p className="text-2xl text-slate-900 ">{stat.value}</p>
                                <p className="text-[13px] text-slate-400  ">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Marking Dialog - Reusable for all students */}
            <Dialog open={isMarkingOpen} onOpenChange={setIsMarkingOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-none border-none p-0 overflow-hidden shadow-2xl">
                    <div className="p-8 text-slate-900">
                        <DialogTitle className="text-md  uppercase ">Academic Evaluation</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-400 mt-1 ">
                            Grading submission for <span className="font-bold text-slate-900">{selectedStudent?.student} </span>
                        </DialogDescription>GRADE ASSIGNMENTS
                    </div>
                    <div className="p-8 space-y-8 bg-white">
                        <div className="flex items-center rounded justify-between p-4 bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-[12px]  uppercase text-slate-900">{selectedStudent?.task}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">{selectedStudent?.fileSize} • Submitted {selectedStudent?.submittedAt}</p>
                                </div>
                            </div>
                            <Button variant="destructive" size="sm" className="text-[12px] font-bold rounded-none border-slate-200">
                                View Paper
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px]  uppercase text-slate-500">Numeric Score (0-100)</Label>
                                <Input type="number" placeholder="85" className="rounded-none border-slate-100 h-10 text-lg font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px]  uppercase text-slate-500">Letter Grade</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-slate-100 h-10 font-bold">
                                        <SelectValue placeholder="Grade" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none font-bold">
                                        {['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map(g => (
                                            <SelectItem key={g} value={g} className="rounded-none">{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px]  uppercase text-slate-500">Staff Remarks & Detailed Comments</Label>
                            <Textarea placeholder="Explain the strengths and weaknesses of this submission..." className="rounded-none border-slate-100 min-h-[120px] bg-slate-50 focus:bg-white transition-all text-xs font-medium leading-relaxed" />
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                        <Button variant="outline" onClick={() => setIsMarkingOpen(false)} className="text-sm font-bold rounded-none ">Discard</Button>
                        <Button className=" text-white text-sm font-bold rounded-none px-10 transition-all">Submit Evaluation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main Content Area */}
            <Card className="rounded-none border-none shadow-none bg-white overflow-hidden mx-2">
                <Tabs defaultValue="submissions" onValueChange={setActiveTab} className="w-full">
                    <CardHeader className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <TabsList className="bg-slate-100 p-1 rounded-none h-10">
                                <TabsTrigger value="submissions" className="text-xs font-bold uppercase rounded px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Submissions</TabsTrigger>
                                <TabsTrigger value="tasks" className="text-xs font-bold uppercase rounded px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Task List</TabsTrigger>
                            </TabsList>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search details..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 rounded-none border-transparent bg-slate-50 text-xs font-medium focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-none bg-transparent rounded-none h-10 px-4 text-xs  uppercase flex items-center gap-2 hover:bg-slate-50">
                                <Filter className="h-4 w-4" /> Filter
                            </Button>
                            <Button variant="outline" size="sm" className="border-none bg-transparent rounded-none h-10 px-4 text-xs  uppercase flex items-center gap-2 hover:bg-slate-50">
                                <Download className="h-4 w-4" /> Export
                            </Button>
                        </div>
                    </CardHeader>

                    <TabsContent value="submissions" className="m-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="text-[10px] uppercase  text-slate-700 h-12 px-6 ">Student</TableHead>
                                        <TableHead className="text-[10px] uppercase  text-slate-700 h-12 ">Assigned Task</TableHead>
                                        <TableHead className="text-[10px] uppercase  text-slate-700 h-12 ">Submitted</TableHead>
                                        <TableHead className="text-[10px] uppercase  text-slate-700 h-12 ">Status</TableHead>
                                        <TableHead className="text-[10px] uppercase  text-slate-700 h-12 ">Grade</TableHead>
                                        <TableHead className="text-[10px] uppercase  text-slate-700 h-12 ">Feedback</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissionsData.map((sub) => (
                                        <TableRow key={sub.id} className="group hover:bg-slate-50/30 transition-colors border-slate-50">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 shadow-none rounded-none border border-slate-100">
                                                        <AvatarImage src={sub.avatar} />
                                                        <AvatarFallback>{sub.student[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-bold text-slate-900 uppercase ">{sub.student}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-700 uppercase">{sub.task}</span>
                                                    <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5 font-bold uppercase">
                                                        <FileText className="h-3 w-3" /> {sub.fileSize} • {sub.type}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-[10px]  text-slate-500 uppercase">{sub.submittedAt}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "rounded-full px-2.5 py-0.2 text-[9px] uppercase shadow-none border  ",
                                                    sub.status === "marked"
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {sub.status === "marked" ? "Evaluated" : "Waiting"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {sub.grade ? (
                                                    <span className="text-sm  text-slate-900 er">{sub.grade}</span>
                                                ) : (
                                                    <span className="text-slate-300 font-bold uppercase text-[10px]">Pending</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-primary transition-colors cursor-pointer">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    <span className="text-[9px]  uppercase ">{sub.comments} Remarks</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-none border-slate-200 py-1 shadow-xl">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedStudent(sub);
                                                                setIsMarkingOpen(true);
                                                            }}
                                                            className="text-[10px]  uppercase cursor-pointer flex items-center gap-2 p-2"
                                                        >
                                                            <CheckSquare className="h-3.5 w-3.5 text-primary" /> Mark & Grade
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-[10px]  uppercase cursor-pointer flex items-center gap-2 p-2">
                                                            <FileText className="h-3.5 w-3.5" /> View Files
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedStudent(sub);
                                                                setIsMarkingOpen(true);
                                                            }}
                                                            className="text-[10px]  uppercase cursor-pointer flex items-center gap-2 p-2"
                                                        >
                                                            <MessageSquare className="h-3.5 w-3.5" /> Add Remark
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="tasks" className="m-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="text-[10px] uppercase font-bold text-slate-700 h-12 px-6">Task Title</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-slate-700 h-12">Assigned To</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-slate-700 h-12">Due Date</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-slate-700 h-12">Submissions</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-slate-700 h-12">Priority</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-slate-700 h-12">Status</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tasksData.map((task) => (
                                        <TableRow key={task.id} className="group hover:bg-slate-50/30 transition-colors border-slate-50">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900">{task.title}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 ">{task.subject}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-[11px] font-bold text-slate-500  px-1.5 py-0.5  uppercase">
                                                    {task.assignedTo}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-[11px] font-bold text-slate-600">{task.dueDate}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 w-24">
                                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                        <span>{Math.round((task.submissions / task.totalStudents) * 100)}%</span>
                                                        <span>{task.submissions}/{task.totalStudents}</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-500"
                                                            style={{ width: `${(task.submissions / task.totalStudents) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        task.priority === 'high' ? "bg-rose-500" : task.priority === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                                                    )} />
                                                    <span className="text-[12px] font-bold text-slate-600">{task.priority}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "rounded-full px-2 py-0.2 text-[9px] uppercase shadow-none border font-bold",
                                                    task.status === "active"
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : "bg-slate-100 text-slate-400 border-slate-200"
                                                )}>
                                                    {task.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-none border-slate-200 py-1">
                                                        <DropdownMenuItem className="text-[11px] font-bold uppercase rounded-none cursor-pointer">Edit Task</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-[11px] font-bold uppercase rounded-none cursor-pointer">Duplicate</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-[11px] font-bold uppercase rounded-none cursor-pointer text-rose-500">Close Submissions</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};

export default TasksResults;
