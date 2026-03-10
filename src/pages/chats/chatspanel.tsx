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
    Smile
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    id: string;
    sender: {
        name: string;
        avatar: string;
        isMe: boolean;
    };
    content: string;
    timestamp: string;
    status?: "sent" | "delivered" | "read";
}

const initialMessages: Message[] = [
    {
        id: "1",
        sender: { name: "Academic Support", avatar: "/icons/photos.png", isMe: false },
        content: "Hello Hussen! Welcome to H-Class Support. How can we assist you with your studies today?",
        timestamp: "09:00 AM",
    },
];

const ChatPanel = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: { name: "Me", avatar: "", isMe: true },
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sent"
        };

        setMessages([...messages, newMessage]);
        setInputValue("");
    };

    const MessageStatus = ({ status }: { status?: string }) => {
        if (status === "sent") return <Check className="h-3 w-3 text-muted-foreground" />;
        if (status === "delivered") return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
        if (status === "read") return <CheckCheck className="h-3 w-3 text-primary" />;
        return null;
    };

    return (
        <div className="flex  overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">

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
                            <h3 className="font-bold text-sm ">Academic Support</h3>
                            <p className="text-[10px] text-success font-bold uppercase ">Direct Channel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex"><Phone className="h-4 w-4" /></Button>
                        {/* <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex"><VideoIcon className="h-4 w-4" /></Button> */}
                        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full w-full" ref={scrollRef}>
                        <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
                            <div className="flex justify-center my-4">
                                <span className="bg-secondary/40 text-[10px] px-3 py-1 rounded-full font-bold uppercase text-muted-foreground/80 border border-border/50 backdrop-blur-sm">Today</span>
                            </div>

                            {messages.map((msg, i) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex flex-col animate-in slide-in-from-bottom-2 duration-300",
                                        msg.sender.isMe ? "items-end" : "items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "group relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                                            msg.sender.isMe
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-background border border-border/40 rounded-tl-none"
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        <div
                                            className={cn(
                                                "flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                                                msg.sender.isMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <span className={cn("text-[9px] font-medium", msg.sender.isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                                {msg.timestamp}
                                            </span>
                                            {msg.sender.isMe && <MessageStatus status={msg.status} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                    disabled={!inputValue.trim()}
                                    className={cn(
                                        "rounded-xl h-10 w-10 ml-1 transition-all duration-300 bg-black shadow-lg active:scale-95",
                                        inputValue.trim() ? "bg-primary text-primary-foreground scale-100" : "bg-black text-muted-foreground scale-90 opacity-100"
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
