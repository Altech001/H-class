import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    FileText,
    MoreVertical,
    Plus,
    Search,
    Video,
    Upload,
    Trash2,
    Edit2,
    ExternalLink,
    FileDown,
    Play,
    CheckCircle2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

// --- Types ---

interface Lecture {
    id: string;
    title: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    status: "upcoming" | "ongoing" | "completed";
}

interface Note {
    id: string;
    title: string;
    subject: string;
    uploadDate: string;
    fileSize: string;
    fileType: string;
}

// --- Mock Data ---

const MOCK_LECTURES: Lecture[] = [
    {
        id: "1",
        title: "Introduction to Quantum Mechanics",
        subject: "Physics",
        date: "2024-03-25",
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        status: "upcoming",
    },
    {
        id: "2",
        title: "Organic Chemistry: Carbonyl Compounds",
        subject: "Chemistry",
        date: "2024-03-20",
        startTime: "02:00 PM",
        endTime: "03:30 PM",
        status: "ongoing",
    },
    {
        id: "3",
        title: "Advanced Calculus: Integration Techniques",
        subject: "Mathematics",
        date: "2024-03-18",
        startTime: "09:00 AM",
        endTime: "10:30 AM",
        status: "completed",
    },
];

const MOCK_NOTES: Note[] = [
    {
        id: "1",
        title: "Quantum Mechanics Lecture 01",
        subject: "Physics",
        uploadDate: "2024-03-15",
        fileSize: "2.4 MB",
        fileType: "PDF",
    },
    {
        id: "2",
        title: "Periodic Table Overview",
        subject: "Chemistry",
        uploadDate: "2024-03-12",
        fileSize: "1.8 MB",
        fileType: "PDF",
    },
    {
        id: "3",
        title: "Limits and Continuity Handouts",
        subject: "Mathematics",
        uploadDate: "2024-03-10",
        fileSize: "3.1 MB",
        fileType: "PDF",
    },
];

export default function ClassNotesPage() {
    const [lectures, setLectures] = useState<Lecture[]>(MOCK_LECTURES);
    const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
    const [searchQuery, setSearchQuery] = useState("");

    const handleStartLecture = (id: string) => {
        setLectures(prev => prev.map(l => l.id === id ? { ...l, status: "ongoing" } : l));
    };

    const handleEndLecture = (id: string) => {
        setLectures(prev => prev.map(l => l.id === id ? { ...l, status: "completed" } : l));
    };

    const handleDeleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Classes & Notes</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Manage your lectures and study materials in one place.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search lectures or notes..."
                            className="pl-9 bg-white border-slate-200 focus:ring-primary/20 transition-all text-sm rounded"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Tabs defaultValue="lectures" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-slate-100 p-1">
                    <TabsTrigger value="lectures" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-sm font-medium">
                        <Video className="w-4 h-4 mr-2" />
                        Live Lectures
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-sm font-medium">
                        <FileText className="w-4 h-4 mr-2" />
                        Study Materials
                    </TabsTrigger>
                </TabsList>

                {/* --- Lectures Content --- */}
                <TabsContent value="lectures" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-slate-800">Your Schedule</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-none rounded transition-all active:scale-95 text-sm gap-2">
                                    <Plus className="w-4 h-4" />
                                    Schedule Lecture
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Schedule New Lecture</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details for your upcoming live session.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Lecture Title</Label>
                                        <Input id="title" placeholder="e.g. Introduction to Physics" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input id="date" type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="physics">Physics</SelectItem>
                                                    <SelectItem value="chemistry">Chemistry</SelectItem>
                                                    <SelectItem value="math">Mathematics</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start">Start Time</Label>
                                            <Input id="start" type="time" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end">End Time</Label>
                                            <Input id="end" type="time" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="rounded">Schedule Lecture</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {lectures.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase())).map((lecture) => (
                            <Card key={lecture.id} className="overflow-hidden border-slate-100 rounded hover:border-primary/30 shadow-none transition-all hover:shadow group">
                                <CardHeader className="pb-3 bg-slate-50/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge
                                            variant={lecture.status === "ongoing" ? "destructive" : lecture.status === "upcoming" ? "secondary" : "outline"}
                                            className={`capitalize px-2 py-0.5 text-[10px] font-bold ${lecture.status === "ongoing" ? "animate-pulse" : ""}`}
                                        >
                                            {lecture.status === "ongoing" && <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />}
                                            {lecture.status}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="text-sm">Edit details</DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm text-destructive">Cancel lecture</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">{lecture.title}</CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500 uppercase tracking-wider">{lecture.subject}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center text-xs text-slate-600">
                                            <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                            {lecture.date}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-600">
                                            <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                            {lecture.startTime} - {lecture.endTime}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        {lecture.status === "upcoming" && (
                                            <Button
                                                onClick={() => handleStartLecture(lecture.id)}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 gap-2 rounded"
                                            >
                                                <Play className="w-3.5 h-3.5" />
                                                Start Active Lecture
                                            </Button>
                                        )}
                                        {lecture.status === "ongoing" && (
                                            <div className="flex gap-2">
                                                <Button className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs h-9 gap-2 rounded">
                                                    <Video className="w-3.5 h-3.5" />
                                                    Join Zoom
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleEndLecture(lecture.id)}
                                                    className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs h-9 rounded"
                                                >
                                                    End Session
                                                </Button>
                                            </div>
                                        )}
                                        {lecture.status === "completed" && (
                                            <Button disabled className="w-full bg-slate-100 text-slate-400 text-xs h-9 gap-2 rounded">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Lecture Completed
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Notes Content --- */}
                <TabsContent value="notes" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-slate-800">Class Notes & Handouts</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-none rounded transition-all active:scale-95 text-sm gap-2">
                                    <Upload className="w-4 h-4" />
                                    Upload Notes
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Upload Study Materials</DialogTitle>
                                    <DialogDescription>
                                        Upload PDF notes or handouts for your students.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="note-title">Title</Label>
                                        <Input id="note-title" placeholder="e.g. Chapter 1: Introduction" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="note-subject">Subject</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="physics">Physics</SelectItem>
                                                <SelectItem value="chemistry">Chemistry</SelectItem>
                                                <SelectItem value="math">Mathematics</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="file">File (PDF only)</Label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-slate-50/50">
                                            <FileDown className="w-8 h-8 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600">Click to upload or drag and drop</span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Maximum file size 50MB</span>
                                            <input type="file" id="file" className="hidden" accept=".pdf" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="rounded">Upload Now</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="bg-white rounded overflow-hidden shadow-none">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[350px] text-xs font-semibold uppercase text-slate-500 py-4">Title</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4">Subject</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4">Date Added</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase text-slate-500 py-4">Size</TableHead>
                                    <TableHead className="text-right text-xs font-semibold uppercase text-slate-500 py-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map((note) => (
                                    <TableRow key={note.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{note.title}</p>
                                                    <p className="text-[11px] text-slate-400">PDF Document</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-bold">
                                                {note.subject}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">{note.uploadDate}</TableCell>
                                        <TableCell className="text-sm text-slate-600">{note.fileSize}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-slate-100">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="h-8 w-8 text-slate-600 hover:text-destructive hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

