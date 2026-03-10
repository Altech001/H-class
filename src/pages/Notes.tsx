import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FileText,
    User,
    ChevronLeft,
    Download,
    BookOpen,
    ArrowRight,
    ExternalLink
} from "lucide-react";

const mockNotes = [
    {
        id: "NOTE-2409-01",
        title: "Organic Chemistry: Carbonyl Compounds & Mechanisms",
        preview: "Comprehensive study of nucleophilic addition reactions to the carbonyl group. Includes Grignard reagents, acetal formation, and cyanohydrin synthesis with detailed step-by-step mechanism diagrams.",
        subject: "Lecture 1",
        staff: "Dr. Robert Smith",
        date: "March 07, 2026",
        size: "1.2 MB",
        type: "PDF Document",
        pdfUrl: "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
    },
    {
        id: "NOTE-2409-02",
        title: "Modern European History: Origins of the Great War",
        preview: "Analysis of the long-term and immediate causes of WWI. Examining the alliance systems, naval rivalry between Britain and Germany, and the Balkan crisis leading to the 1914 assassination.",
        subject: "Lecture 2",
        staff: "Prof. Sarah Johnson",
        date: "March 06, 2026",
        size: "0.8 MB",
        type: "PDF Document",
        pdfUrl: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"
    },
    {
        id: "NOTE-2409-03",
        title: "Quantum Mechanics: The Schrödinger Equation",
        preview: "Detailed derivation and interpretation of the time-dependent Schrödinger equation. Discussion on wave functions, probability density, and the physical constraints on valid solutions.",
        subject: "Lecture 3",
        staff: "Dr. James Miller",
        date: "March 05, 2026",
        size: "2.5 MB",
        type: "PDF Document",
        pdfUrl: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"
    },
];

const subjectColors = {
    Chemistry: { bg: "bg-emerald-50", accent: "bg-emerald-800", text: "text-emerald-800", border: "border-emerald-200", hover: "group-hover:bg-emerald-800" },
    History: { bg: "bg-amber-50", accent: "bg-amber-700", text: "text-amber-700", border: "border-amber-200", hover: "group-hover:bg-amber-700" },
    Physics: { bg: "bg-blue-50", accent: "bg-blue-800", text: "text-blue-800", border: "border-blue-200", hover: "group-hover:bg-blue-800" },
    English: { bg: "bg-rose-50", accent: "bg-rose-700", text: "text-rose-700", border: "border-rose-200", hover: "group-hover:bg-rose-700" },
};

const Notes = () => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [pdfLoaded, setPdfLoaded] = useState(false);

    const handleSelectNote = (note) => {
        setPdfLoaded(false);
        setSelectedNote(note);
    };

    const handleBack = () => {
        setSelectedNote(null);
        setPdfLoaded(false);
    };

    if (selectedNote) {
        const colors = subjectColors[selectedNote.subject] || subjectColors.Chemistry;

        return (
            <div className="max-w-4xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">


                {/* Document Header */}
                <div className="bg-white border border-border border-t-0 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 ${colors.accent} flex items-center justify-center shrink-0 rounded-sm`}>
                            <BookOpen className="h-6 w-6 text-white stroke-[1.5]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-black  uppercase ${colors.text}`}>{selectedNote.subject}</span>
                                <span className="text-slate-200">•</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase ">{selectedNote.id}</span>
                            </div>
                            <h1 className="text-lg font-serif font-bold text-slate-900 leading-tight">{selectedNote.title}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase ">
                                    <User className="h-3 w-3" />
                                    {selectedNote.staff}
                                </div>
                                <span className="text-[10px] font-bold text-slate-300">{selectedNote.date}</span>
                                <span className="text-[10px] font-bold text-slate-300">{selectedNote.size}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleBack}
                            className={`hidden md:flex items-center gap-2 px-4 py-2 ${colors.bg} ${colors.border} border rounded text-[10px] font-black ${colors.text} shrink-0`}>
                            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                            Back to Notes List
                        </Button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="relative border border-t-0 border-border rounded-b-none overflow-hidden bg-slate-200" style={{ height: "780px" }}>
                    {!pdfLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10">
                            <div className="h-10 w-10 border-4 border-slate-300 border-t-slate-700 rounded-none animate-spin mb-4" />
                            <p className="text-[11px] font-bold text-slate-500 uppercase ">Loading PDF...</p>
                        </div>
                    )}
                    <iframe
                        src={`${selectedNote.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                        className="w-full h-full"
                        style={{ height: "780px" }}
                        title={selectedNote.title}
                        onLoad={() => setPdfLoaded(true)}
                    />
                </div>
            </div>
        );
    }

    // ── List view ──
    return (
        <div className="max-w-4xl mx-auto py-4 px-4 animate-in fade-in duration-700">

            <div className="flex items-center justify-between mb-12 pb-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-black  text-slate-900">Academic Resources</h1>
                    <p className="text-slate-500 text-[12px] font-medium">Digital Library of Course Materials and Staff Notes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {mockNotes.map((note) => {
                    const colors = subjectColors[note.subject] || subjectColors.Chemistry;
                    return (
                        <div
                            key={note.id}
                            onClick={() => handleSelectNote(note)}
                            className="group flex flex-col md:flex-row items-stretch border-[0.5px] border-slate-200 bg-white hover:border-slate-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden rounded-none shadow-sm hover:shadow-md"
                        >
                            {/* Left accent block */}
                            <div className={`w-full md:w-32 bg-slate-50 md:border-r border-slate-200 flex flex-col items-center justify-center p-4 transition-colors duration-200 ${colors.hover} group-hover:text-white`}>
                                <span className="text-[10px] font-black er uppercase mb-1 opacity-60">REF-ID</span>
                                <span className="text-xs font-black er font-mono">{note.id.split('-').pop()}</span>
                            </div>

                            <div className="flex-1 p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-[9px] font-black  uppercase ${colors.text}`}>{note.subject}</span>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase">{note.date}</span>
                                </div>

                                <h3 className="text-[17px] font-serif font-bold text-slate-900 leading-tight">
                                    {note.title}
                                </h3>

                                <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                    {note.preview}
                                </p>

                                <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase ">
                                        <User className="h-3 w-3" />
                                        {note.staff}
                                    </div>
                                    <div className="flex mr-auto" />
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase">
                                        <FileText className="h-3 w-3" />
                                        {note.type}
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:flex items-center justify-center px-6 bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-12 flex items-center justify-between p-4 bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase text-slate-900">Hussen</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">HC-2409-001-DAY</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-400">Document Archive System v2.0</p>
                </div>
            </div>
        </div>
    );
};

export default Notes;