import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useNotes } from "@/hooks/use-notes";
import { useCourses } from "@/hooks/use-courses";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Download,
    Upload,
    Loader2,
    BookOpen,
    Search,
    Plus,
    ChevronDown,
    Eye,
    Trash2,
    MoreHorizontal,
    RefreshCw,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Notes = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const user = useAuthStore((s) => s.user);
    const isTutor = user?.role?.toUpperCase() === "TUTOR";
    const isStudent = user?.role?.toUpperCase() === "STUDENT";

    const { useGetCourses, useGetMyEnrollments } = useCourses();
    const { useGetNotesByCourse, getNoteDownloadUrl, getUploadUrl, createNote, isGettingDownloadUrl, isCreatingNote, isGettingUploadUrl } = useNotes();

    // Fetch relevant courses
    const { data: tutorCoursesData } = useGetCourses(isTutor ? { tutorId: user?.id } : undefined);
    const { data: enrollmentsData } = useGetMyEnrollments();
    const { data: allCoursesData } = useGetCourses(isStudent ? { status: "PUBLISHED" } : undefined);

    const tutorCourses = tutorCoursesData?.data || [];
    const enrollments = enrollmentsData?.data || [];
    const allCourses = allCoursesData?.data || [];
    const enrolledCourses = allCourses.filter((c: any) => enrollments.some((e: any) => e.courseId === c.id));

    // Available courses for context selection per role
    const availableCourses = isTutor ? tutorCourses : enrolledCourses;

    // Derive selected course from URL param
    const urlCourseId = searchParams.get("courseId") || "";
    const [selectedCourseId, setSelectedCourseId] = useState(urlCourseId);

    useEffect(() => {
        if (urlCourseId && urlCourseId !== selectedCourseId) {
            setSelectedCourseId(urlCourseId);
        }
    }, [urlCourseId]);

    const handleCourseChange = (val: string) => {
        setSelectedCourseId(val);
        setSearchParams(val ? { courseId: val } : {});
    };

    // Notes query
    const { data: notes, isLoading: loadingNotes, refetch: refetchNotes } = useGetNotesByCourse(selectedCourseId);

    // Upload state
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [search, setSearch] = useState("");

    const handleUpload = async () => {
        if (!selectedCourseId || !uploadTitle.trim() || !uploadFile) {
            toast.error("Please fill in the title and select a file.");
            return;
        }
        setIsUploading(true);
        try {
            // 1. Get pre-signed S3 URL
            const { uploadUrl, s3Key } = await getUploadUrl({
                courseId: selectedCourseId,
                contentType: uploadFile.type || "application/octet-stream",
                fileName: uploadFile.name,
            });

            // 2. PUT file directly to S3
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                body: uploadFile,
                headers: { "Content-Type": uploadFile.type || "application/octet-stream" },
            });
            if (!uploadRes.ok) throw new Error("S3 upload failed");

            // 3. Create note record
            await createNote({ courseId: selectedCourseId, title: uploadTitle.trim(), s3Key });

            toast.success("Note uploaded successfully!");
            setUploadTitle("");
            setUploadFile(null);
            setShowUploadForm(false);
            refetchNotes();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (note: any) => {
        try {
            const url = await getNoteDownloadUrl(note.id);
            if (url) window.open(url, "_blank");
        } catch {
            toast.error("Failed to get download link.");
        }
    };

    const handlePreview = async (note: any) => {
        try {
            const url = await getNoteDownloadUrl(note.id);
            if (url) navigate("/pdf-view", { state: { pdfUrl: url, title: note.title } });
        } catch {
            toast.error("Failed to preview note.");
        }
    };

    const filteredNotes = (notes || []).filter((n: any) =>
        n.title.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCourse = availableCourses.find((c: any) => c.id === selectedCourseId);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-500">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        {isTutor ? "Course Notes" : "My Notes"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {isTutor
                            ? "Upload and manage notes for your courses."
                            : "Access notes from your enrolled courses."}
                    </p>
                </div>
                {isTutor && selectedCourseId && (
                    <Button
                        onClick={() => setShowUploadForm((v) => !v)}
                        className="bg-red-800 hover:bg-black text-white font-bold uppercase text-xs h-10 px-5 gap-2 shadow-lg shadow-red-900/20 active:scale-95 transition-all shrink-0"
                    >
                        {showUploadForm ? (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Cancel Upload
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Note
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* ── Course Selector ── */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Select Course
                </p>
                {availableCourses.length === 0 ? (
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <BookOpen className="w-4 h-4" />
                        <span>
                            {isTutor
                                ? "You haven't created any courses yet."
                                : "You haven't enrolled in any courses yet."}
                        </span>
                        <Button
                            size="sm"
                            variant="link"
                            className="text-red-800 h-auto p-0 text-xs font-bold"
                            onClick={() => navigate(isTutor ? "/create-course" : "/courses")}
                        >
                            {isTutor ? "Create one →" : "Browse courses →"}
                        </Button>
                    </div>
                ) : (
                    <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                        <SelectTrigger className="w-full md:w-[360px] bg-white border-slate-200 text-sm font-semibold">
                            <SelectValue placeholder="Choose a course to view notes..." />
                        </SelectTrigger>
                        <SelectContent>
                            {availableCourses.map((c: any) => (
                                <SelectItem key={c.id} value={c.id} className="text-sm font-medium">
                                    {c.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* ── Upload Form (Tutor only) ── */}
            {isTutor && showUploadForm && selectedCourseId && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                        <Upload className="w-4 h-4 text-red-800" />
                        Upload New Note
                        {selectedCourse && (
                            <span className="text-slate-400 font-semibold normal-case text-xs ml-1">
                                → {selectedCourse.title}
                            </span>
                        )}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Note Title *</label>
                            <Input
                                placeholder="e.g. Lecture 1: Introduction to React"
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                                className="h-10 border-slate-200 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">File *</label>
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                className="h-10 border-slate-200 text-sm cursor-pointer"
                            />
                        </div>
                    </div>
                    {uploadFile && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-medium truncate">{uploadFile.name}</span>
                            <span className="text-slate-400 shrink-0">
                                ({(uploadFile.size / 1024).toFixed(0)} KB)
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleUpload}
                            disabled={isUploading || !uploadFile || !uploadTitle.trim()}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-xs h-9 px-5 gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setShowUploadForm(false); setUploadFile(null); setUploadTitle(""); }}
                            className="text-xs text-slate-400 hover:text-slate-700 font-bold uppercase"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Notes List ── */}
            {!selectedCourseId ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-xl gap-3">
                    <FileText className="w-10 h-10 text-slate-300" />
                    <p className="text-sm font-bold text-slate-500 uppercase">
                        Select a course to view notes
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Search + Count */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search notes..."
                                className="pl-8 h-9 text-sm border-slate-200"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">
                                {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400"
                                onClick={() => refetchNotes()}
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {loadingNotes ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-7 h-7 animate-spin text-red-800" />
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-xl gap-3">
                            <FileText className="w-10 h-10 text-slate-300" />
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-500 uppercase">
                                    {search ? "No matching notes" : "No notes yet"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {isTutor && !search
                                        ? "Upload the first note for this course."
                                        : ""}
                                </p>
                            </div>
                            {isTutor && !search && (
                                <Button
                                    size="sm"
                                    onClick={() => setShowUploadForm(true)}
                                    className="bg-red-800 hover:bg-black text-white text-xs font-bold uppercase h-9 px-4 gap-2 mt-2"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload First Note
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredNotes.map((note: any) => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    isTutor={isTutor}
                                    onDownload={() => handleDownload(note)}
                                    onPreview={() => handlePreview(note)}
                                    isLoadingDownload={isGettingDownloadUrl}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Note Card ─────────────────────────────────────────────────────────────────
const NoteCard = ({
    note,
    isTutor,
    onDownload,
    onPreview,
    isLoadingDownload,
}: {
    note: any;
    isTutor: boolean;
    onDownload: () => void;
    onPreview: () => void;
    isLoadingDownload: boolean;
}) => {
    const ext = note.s3Key?.split(".").pop()?.toUpperCase() || "DOC";
    const extColors: Record<string, string> = {
        PDF: "bg-red-50 text-red-700",
        DOC: "bg-blue-50 text-blue-700",
        DOCX: "bg-blue-50 text-blue-700",
        PPT: "bg-orange-50 text-orange-700",
        PPTX: "bg-orange-50 text-orange-700",
    };
    const extColor = extColors[ext] || "bg-slate-50 text-slate-600";

    return (
        <div className="group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200">
            {/* Icon */}
            <div className={cn("h-11 w-11 rounded-xl flex flex-col items-center justify-center shrink-0 gap-0.5", extColor)}>
                <FileText className="w-4 h-4" />
                <span className="text-[8px] font-black">{ext}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{note.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onPreview}
                    disabled={isLoadingDownload}
                    className="h-8 px-3 text-[10px] font-bold uppercase text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-1"
                >
                    <Eye className="w-3 h-3" />
                    Preview
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDownload}
                    disabled={isLoadingDownload}
                    className="h-8 px-3 text-[10px] font-bold uppercase text-red-800 hover:bg-red-50 gap-1"
                >
                    {isLoadingDownload ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <Download className="w-3 h-3" />
                    )}
                    Download
                </Button>
                {isTutor && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-400 hover:text-slate-700"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Note
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
};

export default Notes;