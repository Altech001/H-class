import { useState } from "react";
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
    Monitor,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

const Settings = () => {
    const { useGetProfile, updateProfile, deleteAccount } = useUsers();
    const { changePassword, logout } = useAuth();
    const { data: profile, isLoading } = useGetProfile();
    const navigate = useNavigate();

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
    });

    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!profile) return null;

    const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("fullname") as string;
        const [firstName, ...rest] = name.split(" ");
        const lastName = rest.join(" ");

        try {
            await updateProfile({
                firstName,
                lastName: lastName || "",
                // Note: email is usually not updated this way or requires verification, 
                // but if we want to support it we can, though usually it's read-only in such forms.
            });
            toast.success("Profile updated");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            await changePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password updated. Please log in again.");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to update password");
        }
    };

    const handleDeactivate = async () => {
        if (!confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) return;
        try {
            await deleteAccount();
            await logout();
            toast.success("Account deactivated");
            navigate("/login");
        } catch (error) {
            toast.error("Failed to deactivate account");
        }
    };

    return (
        <div className="space-y-8 max-w-5xl animate-in fade-in duration-700 pb-12 font-sans">
            <div>
                <p className="text-muted-foreground mt-1">Manage your account information, security and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-muted w-fit justify-start p-1 rounded-full h-14 border border-border/50">
                    <TabsTrigger value="profile" className="rounded-full px-6 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-full px-6 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold gap-2">
                        <Lock className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0">
                    <Card className="bg-transparent border-none overflow-hidden shadow-none">
                        <div className="h-32 relative">
                            <div className="absolute left-8 md:left-12">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-1 ring-slate-100">
                                        <AvatarImage src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`} />
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary shadow-lg ring-2 ring-white hover:scale-110 transition-transform">
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <CardContent className="pt-5 px-8 md:px-12 pb-12">
                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullname" className="text-sm font-bold text-slate-700 ml-1">Full Name</Label>
                                            <Input id="fullname" name="fullname" defaultValue={`${profile.firstName} ${profile.lastName}`} className="h-12 rounded bg-slate-50 border-slate-300 focus-visible:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input id="email" name="email" readOnly defaultValue={profile.email} className="h-12 pl-12 rounded bg-slate-50 border-slate-300 focus-visible:ring-primary opacity-60 cursor-not-allowed" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="rounded h-11 px-8 font-semibold shadow">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                    <div className="grid gap-6">
                        <Card className="rounded-none border-none shadow-none p-8">
                            <CardTitle className="text-xl font-bold mb-6 flex items-center gap-2">
                                Change Password
                            </CardTitle>
                            <form onSubmit={handleChangePassword}>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground ml-1">Current Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-12 rounded bg-slate-50 border-slate-100"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground ml-1">New Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-12 rounded bg-slate-50 border-slate-100"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="mt-8 rounded h-11 px-8 font-semibold shadow">Update Password</Button>
                            </form>
                        </Card>
                        <Card className="shadow-none p-6 bg-transparent border-destructive/20 rounded">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-destructive">
                                    <div>
                                        <h4 className="font-semibold">Deactivate Account</h4>
                                        <p className="text-xs opacity-70 font-medium">Once you deactivate, your data will be permanently hidden.</p>
                                    </div>
                                </div>
                                <Button variant="destructive" className="rounded font-bold shadow-destructive/20" onClick={handleDeactivate}>Deactivate</Button>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
