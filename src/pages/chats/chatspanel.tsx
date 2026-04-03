import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Check,
    CheckCheck,
    Image as ImageIcon,
    Mic,
    Paperclip,
    Phone,
    Send,
    Loader2,
    Search,
    MessageSquare,
    MoreVertical,
    Plus,
    UserCircle,
    GraduationCap,
    HelpCircle
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useChat } from "@/hooks/use-chat";
import { useAuthStore } from "@/store/auth-store";
import { useCourses } from "@/hooks/use-courses";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Label } from "@/components/ui/label";

const ChatPanel = () => {
    const { user } = useAuthStore();
    const { useGetConversations, useGetMessages, sendMessage, createConversation } = useChat();
    const { data: conversations, isLoading: loadingConversations } = useGetConversations();
    const { useGetCourses } = useCourses();
    const { data: myCourses } = useGetCourses(user?.role === "TUTOR" ? { tutorId: user?.id } : undefined);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createCourseId, setCreateCourseId] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: apiMessages, isLoading: loadingMessages } = useGetMessages(selectedId || "");

    // Filter conversations based on search and EXCLUDE Support chats
    const filteredConversations = useMemo(() => {
        if (!conversations) return [];
        return conversations.filter(c => {
            if (c.type === "SUPPORT") return false; // Hide support chats from here
            const name = getConversationName(c, user?.id).toLowerCase();
            return name.includes(searchQuery.toLowerCase());
        });
    }, [conversations, searchQuery, user?.id]);

    // Select first conversation on load if none selected
    useEffect(() => {
        if (!selectedId && filteredConversations.length > 0) {
            setSelectedId(filteredConversations[0].id);
        }
    }, [filteredConversations, selectedId]);

    // Scroll to bottom
    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollRef.current) {
                const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            }
        };
        scrollToBottom();
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [apiMessages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedId) return;

        const content = inputValue.trim();
        setInputValue("");

        try {
            await sendMessage({
                conversationId: selectedId,
                data: { content }
            });
        } catch (error) {
            toast.error("Failed to send message");
            setInputValue(content);
        }
    };

    const handleCreateCourseChat = async () => {
        if (!createCourseId) {
            toast.error("Please select a course");
            return;
        }

        if (user?.role !== "TUTOR" && user?.role !== "ADMIN") {
            toast.error("Only Tutors can create Course chats");
            return;
        }

        try {
            const newConv = await createConversation({ type: "COURSE", courseId: createCourseId });
            if (newConv) {
                setSelectedId(newConv.id);
                toast.success("Course channel created successfully");
                setIsCreateOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to create Group channel");
        }
    };

    const selectedConversation = conversations?.find(c => c.id === selectedId);

    if (loadingConversations) {
        return (
            <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-white border border-border/40 rounded-xl shadow-sm animate-in fade-in duration-500">
            {/* Conversations Sidebar */}
            <div className="w-full sm:w-80 border-r flex flex-col bg-slate-50/50">
                <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-black text-lg uppercase tracking-tight">Messages</h2>
                        
                        {(user?.role === "TUTOR" || user?.role === "ADMIN") && (
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>New Course Chat</DialogTitle>
                                        <DialogDescription>
                                            Create a group channel for your enrolled students.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Select Course</Label>
                                            <Select value={createCourseId} onValueChange={setCreateCourseId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select one of your courses..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {myCourses?.data?.map((course: any) => (
                                                        <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                                    ))}
                                                    {(!myCourses?.data || myCourses.data.length === 0) && (
                                                        <p className="text-sm text-center py-2 text-muted-foreground">No courses found</p>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button onClick={handleCreateCourseChat} className="w-full font-bold">
                                        Create Group Channel
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white border-slate-200 h-9 text-xs font-medium"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="divide-y divide-border/10">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                                <MessageSquare className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                                <p className="text-xs font-bold text-muted-foreground uppercase">No chats found</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedId(conv.id)}
                                    className={cn(
                                        "w-full p-4 flex items-center gap-3 transition-all hover:bg-slate-100/50 text-left relative",
                                        selectedId === conv.id && "bg-white shadow-sm ring-1 ring-black/5 z-10"
                                    )}
                                >
                                    {selectedId === conv.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                    )}
                                    <div className="relative">
                                        <Avatar className="h-11 w-11 border border-border/40 shrink-0">
                                            <AvatarImage src={getConversationAvatar(conv, user?.id)} />
                                            <AvatarFallback><UserCircle /></AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success rounded-full border-2 border-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className="font-bold text-sm truncate uppercase tracking-tighter">
                                                {getConversationName(conv, user?.id)}
                                            </h4>
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {format(new Date(conv.updatedAt), "HH:mm")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-xs text-muted-foreground truncate font-medium">
                                                {conv.type === "COURSE" ? (
                                                    <span className="flex items-center gap-1">
                                                        <GraduationCap className="h-3 w-3" /> Class Group
                                                    </span>
                                                ) : conv.type === "SUPPORT" ? (
                                                    <span className="text-primary font-bold">Support Team</span>
                                                ) : (
                                                    "Private Message"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
                {selectedId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-border/40">
                                    <AvatarImage src={getConversationAvatar(selectedConversation, user?.id)} />
                                    <AvatarFallback><UserCircle /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-tight">
                                        {getConversationName(selectedConversation, user?.id)}
                                    </h3>
                                    <p className="text-[10px] font-bold text-success uppercase">Active Now</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-hidden relative">
                            {loadingMessages && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}
                            <ScrollArea className="h-full" ref={scrollRef}>
                                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                                    {!apiMessages || apiMessages.length === 0 ? (
                                        <div className="text-center py-20">
                                            <p className="text-sm font-bold text-muted-foreground uppercase opacity-20">No messages yet</p>
                                        </div>
                                    ) : (
                                        apiMessages.slice().reverse().map((msg, idx) => {
                                            const isMe = msg.senderId === user?.id;
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        "flex flex-col animate-in slide-in-from-bottom-2 duration-300",
                                                        isMe ? "items-end" : "items-start"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed relative group",
                                                            isMe
                                                                ? "bg-slate-900 text-white rounded-tr-none shadow-lg"
                                                                : "bg-white border border-border/50 text-slate-800 rounded-tl-none shadow-sm"
                                                        )}
                                                    >
                                                        {!isMe && (
                                                            <p className="text-[10px] font-black text-primary uppercase mb-1 opacity-50">
                                                                {msg.senderId === selectedConversation?.courseId ? "Tutor" : "Student"}
                                                            </p>
                                                        )}
                                                        <p className="font-medium">{msg.content}</p>
                                                        <div className={cn(
                                                            "flex items-center gap-1.5 mt-2",
                                                            isMe ? "justify-end" : "justify-start"
                                                        )}>
                                                            <span className="text-[9px] font-bold opacity-40 uppercase">
                                                                {format(new Date(msg.createdAt), "hh:mm a")}
                                                            </span>
                                                            {isMe && <CheckCheck className="h-3 w-3 opacity-30" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-border/40">
                            <div className="max-w-4xl mx-auto">
                                <Card className="p-1 px-2 flex items-center gap-1 bg-white border border-slate-200 rounded-xl shadow-sm ring-1 ring-black/5">
                                    <div className="flex items-center gap-0.5 border-r border-border/40 pr-1">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary transition-colors">
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        placeholder="Type something..."
                                        className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-medium h-10"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim()}
                                        size="icon"
                                        className={cn(
                                            "h-10 w-10 rounded-xl transition-all duration-300",
                                            inputValue.trim() ? "bg-primary scale-100 shadow-lg" : "bg-slate-200 text-slate-400 scale-95"
                                        )}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center ring-8 ring-slate-50">
                            <MessageSquare className="h-10 w-10 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-lg uppercase tracking-tight">Select a conversation</h3>
                            <p className="text-sm text-slate-500 font-medium">Select a chat from the sidebar to start messaging.</p>
                        </div>
                        <Button variant="outline" className="text-xs font-bold uppercase gap-2 h-10 px-6 rounded-xl border-slate-200" onClick={() => window.location.href='/support'}>
                            <HelpCircle className="h-4 w-4" />
                            Need Help? Contact Support
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getConversationName = (conv: any, currentUserId?: string) => {
    if (!conv) return "Unknown";
    if (conv.type === "COURSE") return conv.course?.title || "Course Group";
    if (conv.type === "SUPPORT") return "Platform Support";
    
    // For DIRECT, find the other participant
    const otherParticipant = conv.participants?.find((p: any) => p.userId !== currentUserId);
    if (otherParticipant?.user) {
        return `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`;
    }
    return "Private Chat";
};

const getConversationAvatar = (conv: any, currentUserId?: string) => {
    if (!conv) return "";
    if (conv.type === "SUPPORT" || conv.type === "COURSE") return "/icons/photos.png";
    const otherParticipant = conv.participants?.find((p: any) => p.userId !== currentUserId);
    return otherParticipant?.user?.avatarUrl || "";
};

export default ChatPanel;
