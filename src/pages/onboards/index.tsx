import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Onboard() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { useGetProfile, updateProfile } = useUsers();
    const { data: profile, isLoading } = useGetProfile();
    const navigate = useNavigate();

    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName || "");
            setLastName(profile.lastName || "");
        }
    }, [profile]);

    const handleCompleteSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (firstName !== profile?.firstName || lastName !== profile?.lastName) {
                await updateProfile({ firstName, lastName });
            }
            toast.success("Profile updated! Welcome to H-Class.");
            navigate("/"); // Redirect to dashboard
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update profile.");
            console.error("Onboarding Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50/50 dark:bg-zinc-950 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome Aboard! 🎉</CardTitle>
                    <CardDescription>
                        Let's get your profile set up so you can start learning or teaching.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCompleteSetup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Complete Setup & Go to Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
