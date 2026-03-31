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
    Smile,
    Loader2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { useAuthStore } from "@/store/auth-store";
import { format } from "date-fns";
import { toast } from "sonner";

const ChatPanel = () => {
    const { user } = useAuthStore();
    const { useGetConversations, useGetMessages, sendMessage, createConversation } = useChat();
    const { data: conversations, isLoading: loadingConversations } = useGetConversations();

    const supportConversation = conversations?.find(c => c.type === "SUPPORT");
    const conversationId = supportConversation?.id;

    const { data: apiMessages, isLoading: loadingMessages } = useGetMessages(conversationId || "");

    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-create support conversation if missing
    useEffect(() => {
        if (!loadingConversations && conversations && !supportConversation) {
            createConversation({ type: "SUPPORT" });
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
        // Set a timeout to ensure content is rendered
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
            toast.error("Failed to send message");
            setInputValue(content); // Restore input on failure
        }
    };

    const MessageStatus = ({ status }: { status?: string }) => {
        if (status === "sent") return <Check className="h-3 w-3 text-muted-foreground" />;
        if (status === "delivered") return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
        if (status === "read") return <CheckCheck className="h-3 w-3 text-primary" />;
        return <Check className="h-3 w-3 text-muted-foreground/50" />;
    };

    if (loadingConversations) {
        return (
            <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col h-[calc(100vh-120px)] w-full overflow-hidden">
                {/* Chat Header */}
                <div className="flex-none flex items-center justify-between p-4 border-b z-20">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shadow-none rounded-none">
                            <AvatarImage src="/icons/photos.png" />
                            <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-sm">Academic Support</h3>
                            <p className="text-[10px] text-success font-bold uppercase">Direct Channel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex"><Phone className="h-4 w-4" /></Button>
                        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-hidden relative">
                    {loadingMessages && conversationId && (
                        <div className="absolute inset-0 z-10 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                    <ScrollArea className="h-full w-full" ref={scrollRef}>
                        <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
                            {!apiMessages || apiMessages.length === 0 ? (
                                <div className="text-center py-20 space-y-2">
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Smile className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">Welcome to Academic Support</p>
                                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                                        Send a message to start a conversation with our tutors.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center my-4">
                                        <span className="bg-secondary/40 text-[10px] px-3 py-1 rounded-full font-bold uppercase text-muted-foreground/80 border border-border/50 backdrop-blur-sm">Today</span>
                                    </div>

                                    {apiMessages.map((msg) => {
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
                                                        "group relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                                                        isMe
                                                            ? "bg-primary text-white rounded-tr-none"
                                                            : "bg-background border border-border/40 rounded-tl-none"
                                                    )}
                                                >
                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                    <div
                                                        className={cn(
                                                            "flex items-center gap-1 mt-1.5 opacity-100 group-hover:opacity-100 transition-opacity",
                                                            isMe ? "justify-end" : "justify-start"
                                                        )}
                                                    >
                                                        <span className={cn("text-[9px] font-medium", isMe ? "text-white" : "text-white")}>
                                                            {format(new Date(msg.createdAt), "hh:mm a")}
                                                        </span>
                                                        {isMe && <MessageStatus status="sent" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="flex-none p-4 bg-background/40 backdrop-blur-sm border-t border-border/30">
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-1 px-2 flex items-center gap-1 bg-background border border-slate-900/20 rounded-xl">
                            <div className="flex items-center gap-0.5 pr-2 border-r border-border/40">
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </div>

                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Type your message here..."
                                className="flex-1 bg-transparent text-sm h-10 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none outline-none ring-0 placeholder:text-muted-foreground/40"
                            />

                            <div className="flex items-center gap-0.5">
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                                    <Smile className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                                    <Mic className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={handleSendMessage}
                                    size="icon"
                                    disabled={!inputValue.trim() || !conversationId}
                                    className={cn(
                                        "rounded-xl h-10 w-10 ml-1 transition-all duration-300 bg-black shadow-lg active:scale-95",
                                        inputValue.trim() && conversationId ? "bg-primary text-primary-foreground scale-100" : "bg-black text-muted-foreground scale-90 opacity-100"
                                    )}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
