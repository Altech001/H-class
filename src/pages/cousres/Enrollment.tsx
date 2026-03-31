import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChevronLeft,
    CreditCard,
    ShieldCheck,
    Trophy,
    Clock,
    Loader2,
    Lock,
    BookOpen,
    CheckCircle2,
    Calendar,
    ArrowRight,
    Key
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ManualEnrollmentForm = ({ course }: { course: any }) => {
    const [accessCode, setAccessCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessCode) {
            toast.error("Please enter a valid activation code.");
            return;
        }

        setIsProcessing(true);

        // Simulate activation delay
        setTimeout(() => {
            toast.success("Activation successful! You are now enrolled.");
            navigate("/courses?success=true");
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Key className="w-3 h-3 text-red-800" />
                            Voucher / Activation Code
                        </label>
                        <input
                            type="text"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                            placeholder="ENTER VOUCHER CODE"
                            className="w-full bg-white border border-slate-200 rounded p-4 text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-all uppercase"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-red-800 hover:bg-black text-white py-6 rounded text-sm uppercase tracking-widest font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95"
                >
                    {isProcessing ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying Code...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Verify and Continue
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    <Lock className="w-3 h-3" />
                    256-bit Secure Verification Gateway
                </div>
            </div>
        </form>
    );
};

const Enrollment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useGetCourse } = useCourses();
    const [loading, setLoading] = useState(true);

    const { data: course, isLoading: courseLoading } = useGetCourse(id!);

    useEffect(() => {
        if (id) {
            setLoading(false);
        }
    }, [id]);

    if (courseLoading || loading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-red-800 mx-auto" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Secure Gateway...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold">Course Not Found</h1>
                <Button onClick={() => navigate("/courses")} className="mt-4">Back to Library</Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in zoom-in duration-500">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/courses")}
                className="mb-8 hover:bg-slate-100 rounded-none text-slate-500"
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Return to Specializations
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Left side: Course Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <Badge variant="outline" className="bg-red-50 text-red-800 border-red-100 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">
                            Enrolling Now
                        </Badge>
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight uppercase tracking-tight">
                            {course.title}
                        </h1>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                            {course.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-slate-100 rounded shadow-sm">
                            <Clock className="w-4 h-4 text-slate-300 mb-2" />
                            <p className="text-sm font-bold text-slate-900">12h 30m</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                        </div>
                        <div className="p-4 bg-white border border-slate-100 rounded shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-slate-300 mb-2" />
                            <p className="text-sm font-bold text-slate-900">Lifetime</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Access</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guaranteed Outcomes</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Professional Certification upon completion
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Access to laboratory & research sessions
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                24/7 dedicated academic support
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right side: Activation Area */}
                <div className="lg:col-span-3">
                    <Card className="border-none shadow-2xl bg-white overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-800" />
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                                <Key className="w-4 h-4 text-red-800" />
                                Manual Activation
                            </CardTitle>
                            <CardDescription className="text-xs font-medium text-slate-400">
                                Enter your voucher or access code. Instant course access upon verification.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-8 pt-0">
                            <ManualEnrollmentForm course={course} />

                            <Separator className="my-8 bg-slate-50" />

                            <div className="bg-slate-50/50 p-4 rounded border border-dashed border-slate-200">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Subtotal</span>
                                    <span className="text-xs font-bold text-slate-800">${course.price}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Gateway Fees</span>
                                    <span className="text-xs font-bold text-emerald-600">Free</span>
                                </div>
                                <Separator className="mb-3 bg-slate-200/50" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Total Due Today</span>
                                    <span className="text-xl font-bold text-slate-900">${course.price}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Enrollment;
