import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  X,
  CloudUpload,
  Download,
  Clock,
  ChevronLeft,
  ChevronRight,
  TicketsIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockTasks = [
  {
    id: "TASK-01",
    code: "2301 HSS",
    title: "Silent Alliances And Fractured Norms",
    score: 58,
    total: 70,
    start: "10th Nov 2025 at 10:00PM EAT",
    end: "1st Dec 2025 at 11:59PM EAT",
    status: "submitted",
    subject: "Humanities & Social Sciences",
    accent: "#16a34a",
  },
  {
    id: "TASK-02",
    code: "2302 HSS",
    title: "Individual Course Work",
    score: 55,
    total: 80,
    start: "23rd Jan 2026 at 12:55AM EAT",
    end: "7th Feb 2026 at 12:59AM EAT",
    status: "submitted",
    subject: "Humanities & Social Sciences",
    accent: "#d97706",
  },
  {
    id: "TASK-04",
    code: "2401 PHYS",
    title: "Quantum Mechanics Problem Set",
    score: 0,
    total: 100,
    start: "1st Mar 2026 at 08:00AM EAT",
    end: "15th Mar 2026 at 11:59PM EAT",
    status: "pending",
    subject: "Physics",
    accent: "#7c3aed",
  }
];

const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-10 animate-in fade-in duration-700 overflow-hidden">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .modal { animation: modalIn 0.28s cubic-bezier(.22,.68,0,1.2); }
        .overlay { animation: overlayIn 0.2s ease; }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      {/* Page Header */}
      <div className="flex items-end justify-between px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-bold uppercase tracking-tight text-emerald-600">Active Assignments</h1>
          <p className="text-slate-500 text-[12px] font-medium">Review and submit your academic tasks before the deadline.</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-10 w-10 border-slate-200 rounded-full hover:bg-slate-50"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-10 w-10 border-slate-200 rounded-full hover:bg-slate-50"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mockTasks.map((task) => (
          <Card
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="group relative bg-white cursor-pointer hover:border-slate-400 transition-all duration-300 rounded-sm flex flex-col shrink-0 w-[290px] min-h-[300px] snap-start overflow-hidden border-[0.5px] border-slate-200"
          >
            {/* Corner Fill Badge */}
            <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-10`}>
              <div className={`absolute top-0 right-0 w-[150%] h-[150%] translate-x-[40%] -translate-y-[40%] rotate-45 ${task.status === 'submitted' ? 'bg-emerald-600' : 'bg-amber-500'} flex items-center justify-center pt-8`}>
                <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                  {task.status === 'submitted' ? 'Done' : 'Pending'}
                </span>
              </div>
            </div>

            <CardContent className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${task.status === 'submitted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <FileText className="h-5 w-5" />
                </div>
                {task.status === 'submitted' && (
                  <div className="text-right pr-6">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Grade</span>
                    <span className="text-[14px] font-bold text-slate-900">{Math.round((task.score / task.total) * 100)}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-8 flex-1">
                <h3 className="text-[15px] font-extrabold text-slate-900 leading-snug group-hover:text-primary transition-colors pr-8">
                  {task.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {task.code} • {task.subject}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 mt-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    <Clock className="h-3.5 w-3.5" />
                    Due: {task.end.split(' at ')[0]}
                  </div>
                </div>

                <Button
                  variant={task.status === 'submitted' ? "outline" : "default"}
                  size="sm"
                  className={`w-full rounded-none h-11 text-[11px] font-black transition-all ${task.status === 'submitted'
                    ? 'border-emerald-100 text-emerald-700 hover:bg-emerald-50'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                >
                  {task.status === 'submitted' ? 'Review Results' : 'Submit Task'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {selectedTask && (
        <div
          className="overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 "
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="modal bg-white rounded-none w-full max-w-lg overflow-hidden border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="relative p-10 border-b border-slate-50">
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className={`h-14 w-14 rounded-sm flex items-center justify-center shrink-0 ${selectedTask.status === 'submitted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <FileText className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedTask.code}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedTask.subject}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{selectedTask.title}</h2>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-10 space-y-8">
              {selectedTask.status === "submitted" ? (
                <>
                  <div className="grid grid-cols-2 gap-8 p-8 bg-slate-50 rounded-sm">
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Final Score</p>
                      <p className="text-3xl font-black text-slate-900">
                        {selectedTask.score}
                        <span className="text-slate-300 ml-1">/{selectedTask.total}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Academic Standing</p>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-emerald-600">
                          {Math.round((selectedTask.score / selectedTask.total) * 100)}%
                        </span>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-none uppercase text-[9px] font-black px-2">Distinction</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-4">Instructor Feedback</h4>
                    <div className="p-6 border-l-4 border-emerald-600 bg-emerald-50/30">
                      <p className="text-[13px] text-slate-600 leading-relaxed font-medium italic">
                        "Your analysis of {selectedTask.title.toLowerCase()} was comprehensive and showed deep understanding of the core concepts. The presentation of findings was logical and well-supported."
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-sm flex items-center justify-center border border-amber-200">
                        <Download className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">Assignment_Template.docx</p>
                        <p className="text-[11px] text-amber-600/70 font-medium">Download requirements before starting</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100 bg-white rounded-none font-bold text-[10px]">DOWNLOAD</Button>
                  </div>

                  <div className="group relative">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-4">Submit Your Work</h4>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer rounded-sm">
                      <CloudUpload className="h-10 w-10 text-slate-300 mb-3" />
                      <span className="text-[12px] font-bold text-slate-600">Click or drag files to upload</span>
                      <span className="text-[10px] text-slate-400 mt-1 uppercase font-black">PDF, DOCX (Max 25MB)</span>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-10 pb-10 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedTask(null)}
                className="flex-1 h-12 rounded-none text-[11px] font-black uppercase tracking-widest border-slate-200"
              >
                Close
              </Button>
              {selectedTask.status === "pending" && (
                <Button
                  className="flex-1 h-12 rounded-none text-[11px] font-black uppercase tracking-widest bg-slate-900"
                >
                  Confirm Submission
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;