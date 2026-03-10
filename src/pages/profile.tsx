import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    ShieldCheck,
    Bell,
    Settings,
    Edit2,
    Camera,
    ChevronRight
} from "lucide-react";

const ProfilePage = () => {
    const user = {
        name: "Hussen JD",
        email: "hussen.jd@example.com",
        phone: "+254 700 000 000",
        location: "Nairobi, Kenya",
        joinDate: "March 2024",
        grade: "Grade 12",
        studentId: "STU-2024-001",
        avatar: "/icons/photos.png",
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700 pb-1">
            {/* Profile Header Card */}
            <Card className="border-none shadow-none overflow-hidden rounded-none bg-transparent">
                <div className="h-20 w-full bg-transparent" />
                <CardContent className="relative px-6 pb-2 mt-[-48px]">
                    <div className="flex flex-col sm:flex-row items-end gap-4 sm:gap-6">
                        <div className="relative group">
                            <Avatar className="h-20 w-20 border-4 border-transparent shadow-none rounded-none overflow-hidden bg-transparent">
                                <AvatarImage src={user.avatar} className="object-contain p-2" />
                                <AvatarFallback className="rounded-none bg-transparent text-primary-foreground text-2xl font-bold">
                                    JD
                                </AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-0 right-0 p-1.5 text-white rounded-none shadow-lg bg-primary/90 transition-all opacity-100">
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between gap-4">
                                <div>

                                </div>
                                <Button variant="outline" className="rounded-none gap-2 border-none bg-transparent hover:bg-transparent">
                                    <Edit2 className="h-8 w-8 text-primary" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Information */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-none shadow-none rounded-none bg-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold  tracking-wider text-muted-foreground/70">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-8 w-8  flex items-center justify-center shrink-0">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-muted-foreground  ">Email</p>
                                    <p className="font-medium text-foreground truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-8 w-8  flex items-center justify-center shrink-0">
                                    <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-muted-foreground  ">Phone</p>
                                    <p className="font-medium text-foreground">{user.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-8 w-8  flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-muted-foreground  ">Location</p>
                                    <p className="font-medium text-foreground">{user.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-8 w-8  flex items-center justify-center shrink-0">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-muted-foreground  ">Joined</p>
                                    <p className="font-medium text-foreground">{user.joinDate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none rounded-none bg-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold  tracking-wider text-foreground">Student Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-none border-l-4 border-success">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-success" />
                                    <div>
                                        <p className="text-xs font-bold text-foreground ">Verified Student</p>
                                        <p className="text-[10px] text-muted-foreground">ID: {user.studentId}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Settings & Quick Links */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm rounded-none bg-white">
                        <CardHeader className="pb-3 border-b border-border/40">
                            <CardTitle className="text-base font-bold text-foreground">Account & Security</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9  flex items-center justify-center text-primary   transition-all">
                                            <Bell className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-foreground">Notification Settings</p>
                                            <p className="text-xs text-muted-foreground">Manage your alerts and summaries</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9  flex items-center justify-center text-primary   transition-all">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-foreground">Privacy & Security</p>
                                            <p className="text-xs text-muted-foreground">Password and account access</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9  flex items-center justify-center text-primary   transition-all">
                                            <Settings className="h-4 w-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-foreground">Global Display Preferences</p>
                                            <p className="text-xs text-muted-foreground">Language, theme, and time zone</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-none bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold text-foreground">About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Aspiring software engineer and dedicated Grade 12 student. Passionate about learning new technologies and maintaining a disciplined study routine. "Always Keep small notes and writings" is the personal motto I live by.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
