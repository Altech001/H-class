import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Printer, Download, MapPin, Phone, Mail, Globe, ShieldCheck } from "lucide-react";

interface ResultEntry {
    id: number;
    year: string;
    code: string;
    module: string;
    units: number;
    score: number;
    grade: string;
    points: number;
}

const resultsData: ResultEntry[] = [
    { id: 1, year: "2023-2024", code: "1101 HSS", module: "Communication Skills", units: 10, score: 78, grade: "B+", points: 4.5 },
    { id: 2, year: "2023-2024", code: "1201 HSS", module: "Essentials Of International Relations", units: 15, score: 79, grade: "B+", points: 4.5 },
    { id: 3, year: "2023-2024", code: "1204 HSS", module: "French", units: 10, score: 77, grade: "B+", points: 4.5 },
    { id: 4, year: "2023-2024", code: "1203 HSS", module: "International Law", units: 15, score: 76, grade: "B+", points: 4.5 },
    { id: 5, year: "2024-2025", code: "1301 HSS", module: "International Negotiations", units: 15, score: 78, grade: "B+", points: 4.5 },
];

const StudentReportCard = () => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-700">
            {/* Action Buttons - Hidden on Print */}
            <div className="max-w-4xl mx-auto flex justify-end gap-3 mb-6 print:hidden">
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="rounded font-bold text-slate-600 border-slate-200"
                >
                    Back
                </Button>
                <Button
                    onClick={handlePrint}
                    className="bg-[#1e4e96] hover:bg-[#1a4482] text-white rounded font-bold gap-2 px-6"
                >
                    <Printer className="w-4 h-4" />
                    Print Report Card
                </Button>
            </div>

            {/* Main Report Card Container */}
            <div
                ref={printRef}
                className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none border border-slate-200 print:border-none p-8 md:p-12 relative overflow-hidden"
            >
                {/* Background Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-12">
                    <img src="/icons/photos.png" alt="" className="w-[500px]" />
                </div>

                {/* Header: Logo and School Info */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-900 pb-8 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 shrink-0 flex items-center justify-center p-2 border-2 border-slate-100 rounded-lg">
                            <img src="/icons/photos.png" alt="Logo" className="object-contain" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">H-Class</h1>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">Aspire and progress</p>
                            <div className="h-1.5 w-12 bg-red-600 mt-2" />
                        </div>
                    </div>

                    <div className="text-right space-y-1.5 pt-2">
                        <div className="flex items-center justify-end gap-2 text-slate-600">
                            <span className="text-xs font-bold">Blue Tower, 4th Floor, Suite 402</span>
                            <MapPin className="w-3.5 h-3.5 text-red-600" />
                        </div>
                        <div className="flex items-center justify-end gap-2 text-slate-600">
                            <span className="text-xs font-bold">+256 700 000 000 | +256 770 000 000</span>
                            <Phone className="w-3.5 h-3.5 text-red-600" />
                        </div>
                        <div className="flex items-center justify-end gap-2 text-slate-600">
                            <span className="text-xs font-bold">admissions@h-class.com</span>
                            <Mail className="w-3.5 h-3.5 text-red-600" />
                        </div>
                        <div className="flex items-center justify-end gap-2 text-slate-600">
                            <span className="text-xs font-bold uppercase tracking-tighter">www.h-class.com</span>
                            <Globe className="w-3.5 h-3.5 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Report Title */}
                <div className="py-10 text-center">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-[0.2em]">Official Progress Report Card</h2>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <div className="h-[1px] w-12 bg-slate-300" />
                        <span className="text-[12px] font-black text-red-600 uppercase tracking-[0.3em]">WEEK 1 STAFF EVALUATION</span>
                        <div className="h-[1px] w-12 bg-slate-300" />
                    </div>
                </div>

                {/* Student Identification */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b-2 border-slate-100 p-6 rounded mb-10">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Name</p>
                        <p className="text-[13px] font-black text-slate-900 uppercase">Hussen J. Doe</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Student ID</p>
                        <p className="text-[13px] font-black text-slate-900 uppercase">HCL-2026-0492</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Course Stream</p>
                        <p className="text-[13px] font-black text-slate-900 uppercase">Cyber Security</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Level</p>
                        <p className="text-[13px] font-black text-slate-900 uppercase">Grade 12</p>
                    </div>
                </div>

                {/* Results Table */}
                <div className="mb-10 min-h-[400px]">
                    <Table className="border-collapse border border-slate-200">
                        <TableHeader>
                            <TableRow className="bg-slate-900 hover:bg-slate-900 border-none">
                                <TableHead className="text-white font-black uppercase text-[10px] tracking-widest py-4 border-r border-slate-800">#</TableHead>
                                <TableHead className="text-white font-black uppercase text-[10px] tracking-widest py-4 border-r border-slate-800">Module Code</TableHead>
                                <TableHead className="text-white font-black uppercase text-[10px] tracking-widest py-4 border-r border-slate-800">Core Modules & Components</TableHead>
                                <TableHead className="text-white font-black uppercase text-[10px] tracking-widest py-4 border-r border-slate-800 text-center">Score</TableHead>
                                <TableHead className="text-white font-black uppercase text-[10px] tracking-widest py-4 border-r border-slate-800 text-center">Grade</TableHead>
                                <TableHead className="text-white font-black uppercase text-[10px] tracking-widest py-4 text-center">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resultsData.map((item, idx) => (
                                <TableRow key={item.id} className="border-b border-slate-200 hover:bg-transparent">
                                    <TableCell className="text-[12px] font-bold text-slate-600 border-r border-slate-200 py-4">{item.id}</TableCell>
                                    <TableCell className="text-[12px] font-bold text-slate-900 border-r border-slate-200 py-4">{item.code}</TableCell>
                                    <TableCell className="text-[12px] font-black text-slate-800 border-r border-slate-200 py-4">{item.module}</TableCell>
                                    <TableCell className="text-[12px] font-black text-slate-900 border-r border-slate-200 py-4 text-center">{item.score}</TableCell>
                                    <TableCell className="text-[12px] font-black text-rose-700 border-r border-slate-200 py-4 text-center">{item.grade}</TableCell>
                                    <TableCell className="text-[12px] font-black text-slate-900 py-4 text-center">{item.points.toFixed(1)}</TableCell>
                                </TableRow>
                            ))}
                            {/* Empty rows to fill space */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={`empty-${i}`} className="border-b border-slate-100 hover:bg-transparent h-12">
                                    <TableCell className="border-r border-slate-100"></TableCell>
                                    <TableCell className="border-r border-slate-100"></TableCell>
                                    <TableCell className="border-r border-slate-100"></TableCell>
                                    <TableCell className="border-r border-slate-100"></TableCell>
                                    <TableCell className="border-r border-slate-100"></TableCell>
                                    <TableCell className=""></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer Summary and Legend */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t-2 border-slate-100 pt-8">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Legend & Notes</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold text-slate-500 italic">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> M.E: Missed Exam</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> R: Retake Required</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> EX: Exempted</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> CR: Credit Transfer</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 text-white relative flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cumulative Performance</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter">4.49</span>
                                <span className="text-xs font-bold opacity-60 uppercase">CGPA</span>
                            </div>
                        </div>
                        <div className="h-full w-[1px] bg-white/10 mx-6" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Current Session</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tracking-tighter text-red-500">4.64</span>
                                <span className="text-xs font-bold opacity-60 uppercase">GPA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Footer */}
                <div className="mt-16 flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="space-y-1 text-slate-400 italic">
                        <p className="text-[10px] font-medium tracking-tighter">Report Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p className="text-[10px] font-medium tracking-tighter">Reference Token: HCL-VER-992-001</p>
                        <div className="flex items-center gap-1.5 mt-2 opacity-50">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Digitally Signed & Certified</span>
                        </div>
                    </div>

                    <div className="flex gap-16">
                        <div className="text-center w-40">
                            <div className="h-12 border-b-2 border-slate-900 mb-2 relative">
                                {/* Sample Digital Signature Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-40 italic font-serif text-slate-300 text-sm">
                                    H-Class Registrar
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-900 uppercase">Registrar's Signature</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Academic Board</p>
                        </div>

                        <div className="text-center w-40">
                            <div className="bg-slate-100 rounded-lg h-24 w-24 mx-auto mb-2 flex items-center justify-center border-2 border-slate-200 border-dashed">
                                <div className="text-[10px] font-black text-slate-300 uppercase -rotate-12 select-none">OFFICIAL SEAL</div>
                            </div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Institutional Stamp</p>
                        </div>
                    </div>
                </div>

                {/* CSS for print page breaks and layout */}
                <style>{`
          @media print {
            body { background: white !important; padding: 0 !important; }
            .print\\:shadow-none { box-shadow: none !important; }
            .print\\:border-none { border: none !important; }
            .print\\:hidden { display: none !important; }
            @page { margin: 1cm; }
          }
        `}</style>
            </div>
        </div>
    );
};

export default StudentReportCard;
