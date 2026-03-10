import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, User, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const classes = [
  {
    id: 1,
    subject: "Mathematics: Calculus II",
    teacher: "Dr. Sarah Chen",
    status: "live",
    time: "Ongoing"
  },
  {
    id: 2,
    subject: "Modern Physics: Quantum",
    teacher: "Prof. James Miller",
    status: "live",
    time: "Ongoing"
  },
  {
    id: 3,
    subject: "Organic Chemistry",
    teacher: "Dr. Robert Smith",
    status: "upcoming",
    time: "10:00 AM"
  },
  {
    id: 4,
    subject: "European History",
    teacher: "Prof. Sarah Johnson",
    status: "upcoming",
    time: "1:00 PM"
  },
  {
    id: 5,
    subject: "English Literature",
    teacher: "Ms. Emily Park",
    status: "upcoming",
    time: "3:30 PM"
  }
];

const LiveClass = () => {
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
    <div className="space-y-8 max-w-6xl mx-auto py-4 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex items-end justify-between px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Current Sessions</h1>
          <p className="text-slate-500 text-[12px] font-medium">Select a class to attend your live academic session.</p>
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
        {classes.map((cls) => (
          <Card
            key={cls.id}
            className="group relative bg-white hover:border-slate-400 transition-all duration-300 rounded flex flex-col shrink-0 w-[290px] min-h-[300px] snap-start overflow-hidden border-[0.5px] border-slate-200"
          >
            {/* Corner Fill Badge */}
            <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-10`}>
              <div className={`absolute top-0 right-0 w-[150%] h-[150%] translate-x-[40%] -translate-y-[40%] rotate-45 ${cls.status === 'live' ? 'bg-destructive' : 'bg-slate-300'} flex items-center justify-center pt-8`}>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                  {cls.status === 'live' ? 'Live' : 'Ended'}
                </span>
              </div>
            </div>

            <CardContent className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${cls.status === 'live' ? 'bg-destructive/10 text-destructive' : 'bg-slate-100 text-slate-400'}`}>
                  <Video className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-2 mb-8 flex-1">
                <h3 className="text-[16px] font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors pr-8">
                  {cls.subject}
                </h3>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium">
                  <User className="h-4 w-4" />
                  {cls.teacher}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 mt-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
                    <Clock className="h-3.5 w-3.5" />
                    {cls.time}
                  </div>
                </div>

                <Button
                  variant={cls.status === 'live' ? "default" : "outline"}
                  size="sm"
                  disabled={cls.status !== 'live'}
                  className={`w-full rounded-none h-11 text-[11px] font-black transition-all ${cls.status === 'live'
                    ? 'bg-emerald-900 hover:bg-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-60'
                    }`}
                >
                  {cls.status === 'live' ? 'Attend Session' : 'Session Ended'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveClass;
