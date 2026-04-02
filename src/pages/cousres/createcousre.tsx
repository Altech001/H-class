import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Book,
    ChevronLeft,
    Layout,
    Plus,
    Save,
    Settings,
    Trash2,
    Info,
    DollarSign,
    Trophy,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCourses } from "@/hooks/use-courses";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CreateCourse = () => {
    const navigate = useNavigate();
    const { createCourse, publishCourse } = useCourses();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        passMark: "50",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (shouldPublish: boolean) => {
        if (!formData.title || !formData.description || !formData.price) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.title.length < 3) {
            toast.error("Title must be at least 3 characters");
            return;
        }

        if (formData.description.length < 10) {
            toast.error("Description must be at least 10 characters");
            return;
        }

        if (shouldPublish) {
            setIsPublishing(true);
        } else {
            setIsSubmitting(true);
        }

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                price: parseFloat(Number(formData.price).toFixed(2)),
                passMark: parseInt(formData.passMark) || 50,
            };

            const courseResult = await createCourse(payload);
            const courseId = courseResult?.data?.id || courseResult?.id; // Assuming response format
            
            if (shouldPublish && courseId) {
                await publishCourse(courseId);
                toast.success("Course published successfully!");
            } else {
                toast.success("Course saved as Draft!");
            }
            
            navigate("/courses");
        } catch (error: any) {
            const errorData = error.response?.data?.error;
            let errorMessage = errorData?.message || "Failed to process course";

            if (errorData?.details) {
                const details = Object.entries(errorData.details)
                    .map(([field, msgs]: [string, any]) => `${field}: ${msgs.join(", ")}`)
                    .join("; ");
                errorMessage = `${errorMessage} (${details})`;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
            setIsPublishing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in  duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-1">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/courses")}
                        className="mb-4 -ml-2 text-muted-foreground hover:text-foreground rounded-none"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Library
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-1">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="text-xl  text-slate-800">General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-bold text-slate-700 ml-1 uppercase">Course Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Advanced Cybersecurity Fundamentals"
                                        className="h-12 rounded border-slate-200 focus:border-red-800 focus:ring-red-800 transition-all font-medium text-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-bold text-slate-700 ml-1 uppercase">Syllabus Overview  ({formData.description.length}/200)</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Outline the core objectives and learning outcomes..."
                                        className="min-h-[160px] rounded border-slate-200 focus:border-red-800 focus:ring-red-800 transition-all font-medium text-slate-800 scrollbar-hide focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader className="px-0">
                            <CardTitle className="text-md  text-slate-800 uppercase">Valuation Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-xs font-bold text-slate-700 ml-1 uppercase">Course Fee (USD)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="299.00"
                                            className="h-12 pl-12 rounded border-slate-200 focus:border-red-800 focus:ring-red-800 transition-all font-bold text-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 ml-1 italic">Platform commission: 20%</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="passMark" className="text-xs font-bold text-slate-700 ml-1 uppercase">Grading threshold (%)</Label>
                                    <div className="relative">
                                        <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="passMark"
                                            name="passMark"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.passMark}
                                            onChange={handleInputChange}
                                            placeholder="50"
                                            className="h-12 pl-12 rounded border-slate-200 focus:border-red-800 focus:ring-red-800 transition-all font-bold text-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 ml-1 italic">Minimum score for certification</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info/Status Area */}
                <div className="space-y-8">
                    <Card className="rounded border-slate-200 shadow-none bg-slate-50/50 backdrop-blur-sm sticky top-8">
                        <CardHeader className=" border-b border-slate-100 p-6 rounded-t">
                            <CardTitle className="text-sm font-bold uppercase tracking-tight">Final Verification</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={cn("mt-1 shrink-0 p-1 rounded-full", formData.title ? "bg-emerald-100" : "bg-slate-100")}>
                                        <CheckCircle2 className={cn("w-3 h-3", formData.title ? "text-emerald-800" : "text-slate-400")} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-600 ">Structural integrity check</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={cn("mt-1 shrink-0 p-1 rounded-full", formData.description ? "bg-emerald-100" : "bg-slate-100")}>
                                        <CheckCircle2 className={cn("w-3 h-3", formData.description ? "text-emerald-800" : "text-slate-400")} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-600 ">Syllabus documentation</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={cn("mt-1 shrink-0 p-1 rounded-full", formData.price ? "bg-emerald-100" : "bg-slate-100")}>
                                        <CheckCircle2 className={cn("w-3 h-3", formData.price ? "text-emerald-800" : "text-slate-400")} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-600 ">Valuation accuracy</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    onClick={() => handleCreate(true)}
                                    disabled={isSubmitting || isPublishing}
                                    className="w-full h-12 rounded bg-red-800 hover:bg-black text-white font-bold uppercase text-[12px] transition-all active:scale-95"
                                >
                                    {isPublishing ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Publish Course
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleCreate(false)}
                                    disabled={isSubmitting || isPublishing}
                                    className="w-full h-12 rounded border-slate-200 text-slate-600 font-bold uppercase text-[11px]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : null}
                                    Save as Draft
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-slate-900 rounded shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <Info className="w-24 h-24 text-white" />
                        </div>
                        <h4 className="text-white text-[12px] font-bold uppercase mb-2">Publishing Protocol</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                            Once published, your course will be visible to all students for enrollment. You can add specific modules and sessions from the course detail view after creation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
