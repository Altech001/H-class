import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useUsers } from "@/hooks/use-users";
import { format } from "date-fns";
import {
    Bell,
    Calendar,
    Camera,
    ChevronRight,
    Edit2,
    Loader2,
    Mail,
    Settings,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
    const { useGetProfile, updateProfile } = useUsers();
    const { data: profile, isLoading, error } = useGetProfile();
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center text-sm text-muted-foreground">
                Failed to load profile. Please try again.
            </div>
        );
    }

    const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

    const userProfile = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        location: profile.location || "Not provided",
        joinDate: format(new Date(profile.createdAt), "MMMM yyyy"),
        grade: profile.grade || "Grade Student",
        studentId: profile.customStudentId || profile.id.slice(0, 8).toUpperCase(),
        avatar: profile.avatarUrl || "/icons/photos.png",
        bio: profile.bio || "No biography provided.",
    };

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            location: formData.get("location") as string,
            bio: formData.get("bio") as string,
            grade: formData.get("grade") as string,
        };
        try {
            await updateProfile(data);
            toast.success("Profile updated");
            setIsEditing(false);
        } catch {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="max-w-xl mx-auto py-8 px-5 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="h-16 w-16 rounded-full">
                        <AvatarImage src={userProfile.avatar} className="object-cover" />
                        <AvatarFallback className="bg-blue-50 text-blue-600 text-base font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-white border border-border flex items-center justify-center shadow-sm">
                        <Camera className="h-2.5 w-2.5 text-muted-foreground" />
                    </button>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-foreground leading-tight truncate">{userProfile.name}</p>
                    <p className="text-sm text-muted-foreground">{userProfile.grade}</p>
                </div>

                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px] rounded-xl">
                        <form onSubmit={handleUpdateProfile}>
                            <DialogHeader>
                                <DialogTitle className="font-medium">Edit profile</DialogTitle>
                                <DialogDescription className="text-sm">
                                    Update your personal information.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-3 py-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="firstName" className="text-xs text-muted-foreground">First name</Label>
                                        <Input id="firstName" name="firstName" defaultValue={userProfile.firstName} className="h-9 rounded text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="lastName" className="text-xs text-muted-foreground">Last name</Label>
                                        <Input id="lastName" name="lastName" defaultValue={userProfile.lastName} className="h-9 rounded text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="bio" className="text-xs text-muted-foreground">About</Label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        defaultValue={userProfile.bio === "No biography provided." ? "" : userProfile.bio}
                                        className="w-full min-h-[80px] p-2.5 text-sm rounded border border-input bg-background resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="rounded h-9 text-sm px-5">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Contact */}
            <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
                <div className="divide-y divide-border/50">
                    {[
                        { icon: <Mail className="h-3.5 w-3.5" />, label: "Email", value: userProfile.email },
                        { icon: <Calendar className="h-3.5 w-3.5" />, label: "Joined", value: userProfile.joinDate },
                    ].map(({ icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 py-3">
                            <span className="text-muted-foreground">{icon}</span>
                            <span className="text-xs text-muted-foreground w-12 shrink-0">{label}</span>
                            <span className="text-sm text-foreground truncate">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Student status */}
            <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">Status</p>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded px-3 py-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">Verified student</span>
                    <span className="text-xs text-emerald-500 font-mono">· {userProfile.studentId}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;