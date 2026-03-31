import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    CheckSquare,
    Clock,
    Download,
    FileText,
    Filter,
    GraduationCap,
    MessageSquare,
    MoreVertical,
    Plus,
    Search,
    TrendingUp,
    Upload,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAssessments } from "@/hooks/use-assessments";
import { useCourses } from "@/hooks/use-courses";
import { useAuthStore } from "@/store/auth-store";
import { useMedia } from "@/hooks/use-media";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const TasksResults = () => {
    const { user } = useAuthStore();
    const { useGetCourses, useGetCourseStudents } = useCourses();
    const { data: coursesData } = useGetCourses({ tutorId: user?.id });
    const courses = coursesData?.data || [];

    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");

    const { uploadFile } = useMedia();
    const { useGetAssessmentsByCourse, useGetSubmissions, gradeSubmission, createAssessment } = useAssessments();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("submissions");

    const { data: assessments, isLoading: loadingAssessments } = useGetAssessmentsByCourse(selectedCourseId);
    const { data: submissions, isLoading: loadingSubmissions } = useGetSubmissions(selectedAssessmentId);
    const { data: studentsData } = useGetCourseStudents(selectedCourseId);

    const students = studentsData?.data || [];
    const studentMap = Object.fromEntries(students.map((s: any) => [s.user.id, s.user]));

    const filteredAssessments = assessments?.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const filteredSubmissions = submissions?.filter(s => {
        const student = studentMap[s.studentId];
        const studentName = student ? `${student.firstName} ${student.lastName}` : "";
        return studentName.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

    // Auto-select first course and first assessment for convenience
    useEffect(() => {
        if (courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(courses[0].id);
        }
    }, [courses]);

    useEffect(() => {
        if (assessments && assessments.length > 0) {
            setSelectedAssessmentId(assessments[0].id);
        } else {
            setSelectedAssessmentId("");
        }
    }, [assessments]);

    // Dialog States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [isMarkingOpen, setIsMarkingOpen] = useState(false);
    const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

    // Upload Task States
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadType, setUploadType] = useState<"ASSIGNMENT" | "MODULE_QUIZ" | "FINAL_ASSESSMENT">("ASSIGNMENT");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);

    const handleUploadTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId) {
            toast.error("Please select a course first");
            return;
        }
        if (!uploadTitle || !selectedFile) {
            toast.error("Please provide a title and select a file");
            return;
        }

        setIsCreatingAssessment(true);
        try {
            const { key } = await uploadFile(`courses/${selectedCourseId}/assessments`, selectedFile);
            await createAssessment({
                courseId: selectedCourseId,
                title: uploadTitle,
                type: uploadType,
                s3Key: key
            });
            toast.success("Task uploaded successfully");
            setIsUploadOpen(false);
            setUploadTitle("");
            setSelectedFile(null);
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to upload task");
        } finally {
            setIsCreatingAssessment(false);
        }
    };

    const handleGradeSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubmission) return;
        setIsSubmittingGrade(true);
        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            await gradeSubmission({
                submissionId: selectedSubmission.id,
                data: {
                    score: Number(formData.get("score")),
                    feedback: formData.get("feedback") as string
                }
            });
            toast.success("Grade submitted successfully");
            setIsMarkingOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to submit grade");
        } finally {
            setIsSubmittingGrade(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h2 className="text-md text-slate-900 leading-tight  uppercase ">Assessment & Tasks</h2>
                    <p className="text-slate-500 text-[12px] font-medium mt-1 uppercase ">
                        Manage course evaluations and track student progress.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger className="w-[200px] h-10 rounded-none border-slate-200 text-xs font-bold uppercase transition-all bg-white">
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            {courses.map((c: any) => (
                                <SelectItem key={c.id} value={c.id} className="text-xs uppercase font-bold">{c.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded border-slate-200 text-xs font-bold uppercase h-10 px-4">
                                <Upload className="h-4 w-4 mr-2" /> Upload Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-none border-none shadow-2xl">
                            <form onSubmit={handleUploadTask}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl uppercase er">Upload Educational Resource</DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-400 uppercase">
                                        Distribute new assignments or study materials to your classes.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title" className="text-[10px] uppercase text-slate-500">Task Title</Label>
                                        <Input
                                            id="title"
                                            value={uploadTitle}
                                            onChange={(e) => setUploadTitle(e.target.value)}
                                            placeholder="e.g. Advanced Thermodynamics Quiz"
                                            className="rounded-none border-slate-100 bg-slate-50 focus:bg-white transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="type" className="text-[10px] uppercase text-slate-500">Task Type</Label>
                                            <Select value={uploadType} onValueChange={(v: any) => setUploadType(v)}>
                                                <SelectTrigger className="rounded-none border-slate-100 bg-slate-50 capitalize">
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none">
                                                    <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                                    <SelectItem value="MODULE_QUIZ">Module Quiz</SelectItem>
                                                    <SelectItem value="FINAL_ASSESSMENT">Final Assessment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] uppercase text-slate-500">Target Course</Label>
                                            <div className="h-10 border border-slate-100 bg-slate-50 flex items-center px-3 text-[10px] font-bold text-slate-400 uppercase">
                                                {courses.find(c => c.id === selectedCourseId)?.title || "None Selected"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] uppercase text-slate-500">Resource File</Label>
                                        <div
                                            className={cn(
                                                "border-2 border-dashed p-8 text-center transition-all cursor-pointer relative",
                                                selectedFile ? "border-primary/50 bg-primary/5" : "border-slate-100 bg-slate-50/50 hover:border-primary/30"
                                            )}
                                            onClick={() => document.getElementById('task-file-input')?.click()}
                                        >
                                            <input
                                                id="task-file-input"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className={cn("h-8 w-8 transition-colors", selectedFile ? "text-primary" : "text-slate-300")} />
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                    {selectedFile ? selectedFile.name : "Click to browse or drag & drop files"}
                                                </p>
                                                <p className="text-[8px] text-slate-300 uppercase">PDF, DOCX, JPG (Max 15MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsUploadOpen(false)} className="text-xs font-bold uppercase rounded-none">Cancel</Button>
                                    <Button type="submit" disabled={isCreatingAssessment} className="text-xs font-bold uppercase rounded-none px-8">
                                        {isCreatingAssessment && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        Confirm Upload
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {[
                    { label: "Pending Mark", value: (submissions?.filter((s: any) => !s.gradedAt).length) || "0", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Enrolled Students", value: students.length || "0", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Avg. Grade", value: "N/A", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Course Tasks", value: assessments?.length || "0", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
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
                    <form onSubmit={handleGradeSubmission}>
                        <div className="p-8 text-slate-900">
                            <DialogTitle className="text-md  uppercase ">Academic Evaluation</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-400 mt-1 ">
                                Grading submission for <span className="font-bold text-slate-900">{selectedSubmission?.student?.firstName} {selectedSubmission?.student?.lastName} </span>
                            </DialogDescription>
                        </div>
                        <div className="p-8 space-y-8 bg-white">
                            <div className="flex items-center rounded justify-between p-4 bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-[12px]  uppercase text-slate-900">{selectedSubmission?.assessment?.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">Submitted {selectedSubmission?.createdAt && formatDistanceToNow(new Date(selectedSubmission.createdAt), { addSuffix: true })}</p>
                                    </div>
                                </div>
                                <Button type="button" variant="destructive" size="sm" className="text-[12px] font-bold rounded-none border-slate-200" onClick={() => window.open(selectedSubmission?.downloadUrl, '_blank')}>
                                    View Paper
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px]  uppercase text-slate-500">Numeric Score (0-100)</Label>
                                    <Input name="score" type="number" defaultValue={selectedSubmission?.score || ""} placeholder="85" required className="rounded-none border-slate-100 h-10 text-lg font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px]  uppercase text-slate-500">Grade Preview</Label>
                                    <div className="h-10 border border-slate-100 flex items-center px-4 font-bold text-slate-400 bg-slate-50">
                                        Auto-calculated
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px]  uppercase text-slate-500">Staff Remarks & Detailed Comments</Label>
                                <Textarea name="feedback" defaultValue={selectedSubmission?.feedback || ""} placeholder="Explain the strengths and weaknesses of this submission..." className="rounded-none border-slate-100 min-h-[120px] bg-slate-50 focus:bg-white transition-all text-xs font-medium leading-relaxed" />
                            </div>
                        </div>
                        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setIsMarkingOpen(false)} className="text-sm font-bold rounded-none ">Discard</Button>
                            <Button type="submit" disabled={isSubmittingGrade} className=" text-white text-sm font-bold rounded-none px-10 transition-all">
                                {isSubmittingGrade && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Submit Evaluation
                            </Button>
                        </DialogFooter>
                    </form>
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
                            <div className="flex gap-2">
                                {activeTab === "submissions" && (
                                    <Select value={selectedAssessmentId} onValueChange={setSelectedAssessmentId}>
                                        <SelectTrigger className="w-[200px] h-9 rounded-none border-slate-100 bg-white text-[11px] font-bold uppercase">
                                            <SelectValue placeholder="Filter by Assessment" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            {assessments?.map((a: any) => (
                                                <SelectItem key={a.id} value={a.id} className="text-[11px] uppercase font-bold">{a.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
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
                                    {loadingSubmissions ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-200" />
                                            </TableCell>
                                        </TableRow>
                                    ) : (filteredSubmissions?.length === 0 || !selectedAssessmentId) ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-xs uppercase font-bold">
                                                {!selectedAssessmentId ? "Select an assessment to view submissions" : "No submissions found"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSubmissions?.map((sub: any) => {
                                            const student = studentMap[sub.studentId];
                                            return (
                                                <TableRow key={sub.id} className="group hover:bg-slate-50/30 transition-colors border-slate-50">
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8 shadow-none rounded-none border border-slate-100">
                                                                <AvatarImage src={student?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${student?.firstName || sub.studentId}`} />
                                                                <AvatarFallback>{student?.firstName?.[0] || '?'}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-xs font-bold text-slate-900 uppercase ">
                                                                {student ? `${student.firstName} ${student.lastName}` : `Student ${sub.studentId.split('-')[0]}`}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-slate-700 uppercase">
                                                                {assessments?.find((a: any) => a.id === sub.assessmentId)?.title || "Unknown Task"}
                                                            </span>
                                                            <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5 font-bold uppercase">
                                                                <FileText className="h-3 w-3" /> External Resource
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-[10px]  text-slate-500 uppercase">{formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn(
                                                            "rounded-full px-2.5 py-0.2 text-[9px] uppercase shadow-none border  ",
                                                            sub.gradedAt
                                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                                : "bg-amber-50 text-amber-600 border-amber-100"
                                                        )}>
                                                            {sub.gradedAt ? "Evaluated" : "Waiting"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {sub.score ? (
                                                            <span className="text-sm  text-slate-900 er">{sub.score}%</span>
                                                        ) : (
                                                            <span className="text-slate-300 font-bold uppercase text-[10px]">Pending</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-primary transition-colors cursor-pointer">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                            <span className="text-[9px]  uppercase ">{sub.feedback ? "1 Remarks" : "0 Remarks"}</span>
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
                                                                        setSelectedSubmission(sub);
                                                                        setIsMarkingOpen(true);
                                                                    }}
                                                                    className="text-[10px]  uppercase cursor-pointer flex items-center gap-2 p-2"
                                                                >
                                                                    <CheckSquare className="h-3.5 w-3.5 text-primary" /> Mark & Grade
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => window.open(sub.downloadUrl, '_blank')}
                                                                    className="text-[10px]  uppercase cursor-pointer flex items-center gap-2 p-2"
                                                                >
                                                                    <FileText className="h-3.5 w-3.5" /> View Files
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
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
                                    {loadingAssessments ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-200" />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredAssessments?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-xs uppercase font-bold">
                                                No tasks found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAssessments?.map((task: any) => (
                                            <TableRow key={task.id} className="group hover:bg-slate-50/30 transition-colors border-slate-50">
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-900 uppercase">{task.title}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 ">{task.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-[11px] font-bold text-slate-500  px-1.5 py-0.5  uppercase">
                                                        Course ID: {task.courseId.split('-')[0]}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-[11px] font-bold text-slate-600">{new Date(task.createdAt).toLocaleDateString()}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 w-24">
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                            <span>{task.submissionsCount || 0} Submissions</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary transition-all duration-500"
                                                                style={{ width: `${Math.min((task.submissionsCount || 0) * 5, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                        NORMAL
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="rounded-full px-2 py-0.2 text-[9px] uppercase shadow-none border font-bold bg-primary/10 text-primary border-primary/20">
                                                        Active
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
                                                            <DropdownMenuItem className="text-[11px] font-bold uppercase rounded-none cursor-pointer">Download Resource</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-[11px] font-bold uppercase rounded-none cursor-pointer text-rose-500">Delete Assessment</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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
