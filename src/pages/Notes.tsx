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
import { Badge } from "@/components/ui/badge";

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

import { useNavigate } from "react-router-dom";

const subjectColors: Record<string, any> = {
    Chemistry: { bg: "bg-emerald-50", accent: "bg-emerald-800", text: "text-emerald-800", border: "border-emerald-200", hover: "group-hover:bg-emerald-800" },
    History: { bg: "bg-amber-50", accent: "bg-amber-700", text: "text-amber-700", border: "border-amber-200", hover: "group-hover:bg-amber-700" },
    Physics: { bg: "bg-blue-50", accent: "bg-blue-800", text: "text-blue-800", border: "border-blue-200", hover: "group-hover:bg-blue-800" },
    English: { bg: "bg-rose-50", accent: "bg-rose-700", text: "text-rose-700", border: "border-rose-200", hover: "group-hover:bg-rose-700" },
    "Lecture 1": { bg: "bg-emerald-50", accent: "bg-emerald-800", text: "text-emerald-800", border: "border-emerald-200", hover: "group-hover:bg-emerald-800" },
    "Lecture 2": { bg: "bg-amber-50", accent: "bg-amber-700", text: "text-amber-700", border: "border-amber-200", hover: "group-hover:bg-amber-700" },
    "Lecture 3": { bg: "bg-blue-50", accent: "bg-blue-800", text: "text-blue-800", border: "border-blue-200", hover: "group-hover:bg-blue-800" },
};

const Notes = () => {
    const navigate = useNavigate();

    const handleSelectNote = (note: any) => {
        navigate("/pdf-view", { state: { pdfUrl: note.pdfUrl, title: note.title } });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Academic Resources</h1>
                    <p className="text-slate-500 text-xs font-semibold uppercase  opacity-70">Digital Library of Course Materials</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase ">System Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {mockNotes.map((note) => {
                    const colors = subjectColors[note.subject] || subjectColors.Chemistry;
                    return (
                        <div
                            key={note.id}
                            onClick={() => handleSelectNote(note)}
                            className="group flex flex-col md:flex-row items-stretch border border-slate-200 bg-white hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden rounded shadow-none hover:shadow-xl"
                        >
                            {/* Accent Sidebar */}
                            {/* <div className={`w-full md:w-2 bg-emerald-50 transition-all duration-300 ${colors.accent}`} /> */}

                            <div className="flex-1 p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={`text-[9px] font-black uppercase rounded-sm border-none ${colors.bg} ${colors.text}`}>
                                        {note.subject}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">REF: {note.id}</span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                                        {note.title}
                                    </h3>
                                    <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed mt-2">
                                        {note.preview}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                            <User className="h-3.5 w-3.5" />
                                            {note.staff}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase">
                                            <FileText className="h-3.5 w-3.5" />
                                            {note.size}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded text-[10px] font-black uppercase  text-[#1e4e96] hover:bg-slate-50">
                                        View Document
                                        <ArrowRight className="h-3 w-3 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-16 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between p-6">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded  flex items-center justify-center">
                        <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[11px]   text-slate-900">Student Archive Access</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-tighter">H-Class Learning Management v2.4.0</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Last Updated</p>
                        <p className="text-[11px] font-black text-slate-700">Today, 04:30 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notes;