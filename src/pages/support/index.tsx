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
    Send,
    Loader2,
    ShieldAlert,
    Phone
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { useAuthStore } from "@/store/auth-store";
import { format } from "date-fns";
import { toast } from "sonner";

const SupportChat = () => {
    const { user } = useAuthStore();
    const { useGetConversations, useGetMessages, sendMessage, createConversation } = useChat();
    const { data: conversations, isLoading: loadingConversations } = useGetConversations();

    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const supportConversation = conversations?.find(c => c.type === "SUPPORT");
    const conversationId = supportConversation?.id;

    const { data: apiMessages, isLoading: loadingMessages } = useGetMessages(conversationId || "");

    // Auto-create support conversation if missing
    useEffect(() => {
        if (!loadingConversations && conversations && !supportConversation) {
            createConversation({ type: "SUPPORT" }).catch(() => {
                toast.error("Failed to initialize support chat");
            });
        }
    }, [conversations, loadingConversations, supportConversation, createConversation]);

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
        if (!inputValue.trim() || !conversationId) return;

        const content = inputValue.trim();
        setInputValue("");

        try {
            await sendMessage({
                conversationId,
                data: { content }
            });
        } catch (error) {
            toast.error("Failed to send message to support");
            setInputValue(content);
        }
    };

    if (loadingConversations || (!conversationId && !loadingConversations)) {
        return (
            <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-120px)] w-full overflow-hidden bg-white border border-border/40 rounded-xl shadow-sm animate-in fade-in duration-500">
            {/* Support Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border/40 shadow-sm bg-primary/5">
                            <AvatarFallback><ShieldAlert className="h-5 w-5 text-primary" /></AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-tight text-slate-900">
                                Platform Support
                            </h3>
                            <p className="text-[10px] font-bold text-success uppercase">Typically replies instantly</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="hidden sm:flex gap-2 h-9 text-xs font-bold uppercase rounded-lg">
                            <Phone className="h-3 w-3" />
                            Call Support
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
                    <ScrollArea className="h-full w-full" ref={scrollRef}>
                        <div className="p-6 space-y-6 max-w-3xl mx-auto">
                            {!apiMessages || apiMessages.length === 0 ? (
                                <div className="text-center py-20 space-y-4">
                                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                        <ShieldAlert className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 uppercase">How can we help you?</p>
                                        <p className="text-xs font-medium text-slate-500 mt-1 max-w-[250px] mx-auto">
                                            Send us a message and our support team will get back to you shortly.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                apiMessages.slice().reverse().map((msg) => {
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
                                                        Support Agent
                                                    </p>
                                                )}
                                                <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
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
                    <div className="max-w-3xl mx-auto">
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
                                placeholder="Describe your issue..."
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-medium h-10"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || !conversationId}
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
            </div>
        </div>
    );
};

export default SupportChat;
