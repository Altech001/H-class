import {
    User,
    Shield,
    Bell,
    Languages,
    Eye,
    EyeOff,
    CloudUpload,
    Camera,
    LogOut,
    Mail,
    Lock,
    Globe,
    Monitor
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
    return (
        <div className="space-y-8 max-w-5xl animate-in fade-in duration-700 pb-12 font-sans">
            {/* Header */}
            <div>

                <p className="text-muted-foreground mt-1">Manage your account information, security and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-muted w-fit justify-start p-1 rounded h-14 border border-border/50">
                    <TabsTrigger value="profile" className="rounded px-6 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded px-6 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold gap-2">
                        <Lock className="h-4 w-4" />
                        Security
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="profile" className="mt-0">
                    <Card className="bg-transparent border-none overflow-hidden shadow-none">
                        <div className="h-32 relative">
                            <div className="absolute  left-8 md:left-12">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-1 ring-slate-100">
                                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                                        <AvatarFallback>HM</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary shadow-lg ring-2 ring-white hover:scale-110 transition-transform">
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <CardContent className="pt-5 px-8 md:px-12 pb-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname" className="text-sm font-bold text-slate-700 ml-1">Full Name</Label>
                                        <Input id="fullname" defaultValue="Hussen Muhammed" className="h-12 rounded bg-slate-50 border-slate-300 focus-visible:ring-primary " />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input id="email" defaultValue="hussen@hclass.com" className="h-12 pl-12 rounded bg-slate-50 border-slate-300 focus-visible:ring-primary " />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-sm font-bold text-slate-700 ml-1">Bio</Label>
                                        <textarea
                                            id="bio"
                                            className="w-full min-h-[120px] p-4 rounded bg-slate-50 border-slate-300 border text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all "
                                            placeholder="Tell us about yourself..."
                                            defaultValue="Passionate learner and aspiring full-stack developer. Currently mastering advanced calculus and UI design."
                                        />
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                    <div className="grid gap-6">
                        <Card className="rounded-none border-none shadow-none  p-8">
                            <CardTitle className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                Change Password
                            </CardTitle>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm   text-muted-foreground ml-1">Current Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded bg-slate-50 border-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm   text-muted-foreground ml-1">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded bg-slate-50 border-slate-100" />
                                </div>

                            </div>
                            <Button className="mt-8 rounded h-11 px-8 font-semibold shadow-lg shadow-primary/20">Update Password</Button>
                        </Card>
                        <Card className=" shadow-none p-6 bg-transparent border-destructive/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-destructive">
                                    <LogOut className="h-6 w-6" />
                                    <div>
                                        <h4 className="font-semibold">Deactivate Account</h4>
                                        <p className="text-xs opacity-70 font-medium">Once you deactivate, your data will be permanently hidden.</p>
                                    </div>
                                </div>
                                <Button variant="destructive" className="rounded font-bold shadow-lg shadow-destructive/20">Deactivate</Button>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
