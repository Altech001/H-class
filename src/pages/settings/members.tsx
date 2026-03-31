import { useState, useMemo } from "react";
import {
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Shield,
    ShieldCheck,
    UserCheck,
    UserCog,
    Filter,
    Download,
    Trash2,
    Edit,
    Key,
    CheckCircle2,
    XCircle,
    Loader2,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";
import { toast } from "sonner";

const MembersPage = () => {
    const { useGetUsers, createUser, updateUserRole, updateUser, deleteUser } = useAdmin();
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data: apiData, isLoading } = useGetUsers({ search: searchQuery });

    const membersList = useMemo(() => {
        const data = apiData?.data || [];
        if (roleFilter === "all") return data;
        return data.filter((member: any) => member.role === roleFilter);
    }, [apiData, roleFilter]);

    const getRoleBadge = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return <Badge className="bg-red-50 text-red-600 border-red-100  text-[9px] font-bold  rounded-sm shadow-none">System Admin</Badge>;
            case "tutor":
                return <Badge className="bg-blue-50 text-blue-600 border-blue-100  text-[9px] font-bold  rounded-sm shadow-none">Academic Tutor</Badge>;
            case "staff":
                return <Badge className="bg-amber-50 text-amber-600 border-amber-100  text-[9px] font-bold  rounded-sm shadow-none">Operations Staff</Badge>;
            default:
                return <Badge className="bg-slate-50 text-slate-500 border-slate-100  text-[9px] font-bold  rounded-sm shadow-none">Student</Badge>;
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin": return <ShieldCheck className="w-4 h-4 text-red-600" />;
            case "tutor": return <UserCheck className="w-4 h-4 text-blue-600" />;
            case "staff": return <UserCog className="w-4 h-4 text-amber-600" />;
            default: return <Users className="w-4 h-4 text-slate-400" />;
        }
    };

    const handleUpdateRole = async (id: string, newRole: string) => {
        try {
            await updateUserRole({ id, role: newRole });
            toast.success("Member role updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to update role");
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const data = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
            };

            await updateUser({ id: selectedUser.id, data });
            toast.success("Member dossier updated successfully");
            setIsEditModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to update member");
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const data = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                role: formData.get("role") as string,
                password: "Password123!", // Default password for new members
            };

            await createUser(data);
            toast.success("New member provisioned successfully");
            setIsAddModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to create member");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        setIsDeleting(id);
        try {
            await deleteUser(id);
            toast.success("Member access revoked successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to delete member");
        } finally {
            setIsDeleting(null);
        }
    };

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="space-y-1">

                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-none bg-red-800 hover:bg-red-900 text-white h-11 px-6 font-semibold text-[14px] shadow-lg shadow-red-900/10"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Provision Member
                    </Button>
                    <Button variant="outline" className="rounded-none border-slate-200 h-11 px-6 font-semibold text-[14px] hover:bg-slate-50">
                        <Download className="w-4 h-4 mr-2" />
                        Audit Export
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
                {[
                    { label: "Total Accounts", value: apiData?.meta?.total || "0", icon: Users, trend: "Live" },
                    { label: "Privileged", value: apiData?.data?.filter((u: any) => u.role !== 'STUDENT').length || "0", icon: ShieldCheck, trend: "Auth" },
                    { label: "Search Results", value: membersList.length || "0", icon: Loader2, trend: "Query" },
                    { label: "System Status", value: "Active", icon: CheckCircle2, trend: "100%" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-none bg-white relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-12 h-12" />
                        </div>
                        <CardContent className="p-5 space-y-1">
                            <p className="text-[10px] font-bold text-slate-400  st">{stat.label}</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                <span className="text-[10px] font-bold text-emerald-600 mb-1">{stat.trend}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table Control Bar */}
            <Card className="rounded-none border-none shadow-sm bg-white mx-4">
                <CardHeader className="p-6 border-b border-slate-50 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <Input
                                placeholder="Universal search: Name, Email, ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 rounded-none border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-red-800 transition-all font-medium  text-xs"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[180px] h-11 rounded-none border-slate-200 text-xs font-bold  transition-all focus:ring-0 focus:ring-offset-0 focus:border-red-800 outline-none">
                                    <SelectValue placeholder="Role Perspective" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-slate-200">
                                    <SelectItem value="all" className="text-xs     rounded-none ">All Designations</SelectItem>
                                    <SelectItem value="ADMIN" className="text-xs   rounded-none  ">Administrator</SelectItem>
                                    <SelectItem value="TUTOR" className="text-xs   rounded-none  ">Academic Tutor</SelectItem>
                                    <SelectItem value="STAFF" className="text-xs   rounded-none  ">Operations Staff</SelectItem>
                                    <SelectItem value="STUDENT" className="text-xs rounded-none    ">Students</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-red-800" />
                            <p className="text-[10px] font-bold text-slate-400  st">Querying central database...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="h-14 px-6 text-[10px] font-bold text-slate-500  st">Designated Member</TableHead>
                                    <TableHead className="h-14 text-[10px] font-bold text-slate-500  st">Auth Group</TableHead>
                                    <TableHead className="h-14 text-[10px] font-bold text-slate-500  st text-center">Protocol Status</TableHead>
                                    <TableHead className="h-14 text-[10px] font-bold text-slate-500  st">Provisioned</TableHead>
                                    <TableHead className="h-14 text-[10px] font-bold text-slate-500  st">Last Access</TableHead>
                                    <TableHead className="h-14 w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {membersList.map((member: any) => (
                                    <TableRow key={member.id} className="group border-slate-50 hover:bg-slate-50/30 transition-all">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 rounded-none shadow-sm ring-2 ring-white ring-offset-2 ring-offset-slate-50">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.firstName} ${member.lastName}`} />
                                                    <AvatarFallback className="rounded-none bg-slate-900 text-white text-xs font-bold">
                                                        {member.firstName?.[0]}{member.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 leading-tight">
                                                        {member.firstName} {member.lastName}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium">{member.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(member.role)}
                                                {getRoleBadge(member.role)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {(member.status === "active" || !member.status) ? (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600  bg-emerald-50 px-2 py-0.5 rounded-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400  bg-slate-100 px-2 py-0.5 rounded-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                    Inactive
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-semibold text-slate-500 font-mono">
                                                {new Date(member.createdAt || "").toLocaleDateString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] font-bold text-slate-600 ">
                                                {member.lastLogin || "Never"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-20 group-hover:opacity-100 transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-none border-slate-200 p-1 bg-white">
                                                    <DropdownMenuLabel className="text-[10px] font-bold  text-slate-400 px-2 py-1.5">Action Protocols</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEditModal(member)} className="rounded-none text-xs font-bold  cursor-pointer flex items-center justify-between">
                                                        Update Dossier <Edit className="w-3.5 h-3.5 ml-2 text-slate-400" />
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="bg-slate-100" />

                                                    <DropdownMenuLabel className="text-[10px] font-bold  text-slate-400 px-2 py-1.5">Role Arbitration</DropdownMenuLabel>
                                                    {["ADMIN", "TUTOR", "STAFF", "STUDENT"].filter(r => r !== member.role).map(role => (
                                                        <DropdownMenuItem
                                                            key={role}
                                                            onClick={() => handleUpdateRole(member.id, role)}
                                                            className="rounded-none text-xs font-bold  cursor-pointer flex items-center gap-2"
                                                        >
                                                            <Key className="w-3.5 h-3.5 text-slate-300" />
                                                            Assign {role}
                                                        </DropdownMenuItem>
                                                    ))}

                                                    <DropdownMenuSeparator className="bg-slate-100" />

                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteUser(member.id)}
                                                        disabled={isDeleting === member.id}
                                                        className="rounded-none text-xs font-bold  cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 flex items-center justify-between"
                                                    >
                                                        {isDeleting === member.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Revoke Access"}
                                                        <Trash2 className="w-3.5 h-3.5 ml-2 text-red-400" />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Empty State Illustration */}
            {!isLoading && membersList.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                    <div className="h-20 w-20 bg-slate-50 flex items-center justify-center rounded-full mb-6">
                        <Users className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 ">Zero Correlation Found</h3>
                    <p className="text-slate-400 text-sm max-w-sm mt-1">No database entries matched your current search parameters or filter perspectives.</p>
                </div>
            )}

            {/* Footer Control */}
            <div className="flex items-center justify-center px-4 pt-10 pb-10">
                <p className="text-[10px] font-bold text-slate-400  st text-center max-w-2xl px-10 leading-relaxed opacity-50">
                    Proprietary Administrative Interface — Authorized access only. All actions are logged under the Platform Integrity Protocol v.4.0. Unauthorized duplication of user data is strictly prohibited.
                </p>
            </div>

            {/* Dossier Update Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="rounded-none border-none shadow-2xl p-0 overflow-hidden max-w-md bg-white">

                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="text-xl font-bold   text-slate-900">Update Member Dossier</DialogTitle>
                        <DialogDescription className="text-xs  font-bold text-slate-500 st pt-1">Administrative Override Mode</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <form onSubmit={handleUpdateUser}>
                            <div className="px-8 space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold  text-slate-500">First Name</Label>
                                        <Input name="firstName" defaultValue={selectedUser.firstName} className="rounded-none border-slate-200 h-10 focus:ring-0 focus:border-red-800 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold  text-slate-500">Last Name</Label>
                                        <Input name="lastName" defaultValue={selectedUser.lastName} className="rounded-none border-slate-200 h-10 focus:ring-0 focus:border-red-800 text-xs font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold  text-slate-500">Email Designation</Label>
                                    <Input name="email" defaultValue={selectedUser.email} className="rounded-none border-slate-200 h-10 focus:ring-0 focus:border-red-800 text-xs font-bold" />
                                </div>
                                <div className="p-4 bg-slate-50 rounded border border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[10px] font-bold  text-slate-500">Current Authorization</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900">{selectedUser.role}</span>
                                        <Badge className="bg-white border-slate-200 text-slate-400 text-[9px] shadow-none  font-bold">Priority: {selectedUser.role === 'ADMIN' ? 'High' : 'Normal'}</Badge>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="p-8 pt-4 bg-slate-50/50">
                                <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-none text-xs font-bold  h-11 px-6">Cancel</Button>
                                <Button type="submit" className="rounded-none bg-slate-900 hover:bg-black text-white text-xs font-bold  h-11 px-8 shadow-lg shadow-slate-900/10">Commit Changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
            {/* Provision Member Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="rounded-none border-none shadow-2xl p-0 overflow-hidden max-w-md bg-white">

                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="text-xl font-bold   text-slate-900">Provision New Member</DialogTitle>
                        <DialogDescription className="text-xs  font-bold text-slate-500 st pt-1">Internal Personnel Registry</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser}>
                        <div className="px-8 space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold  text-slate-500">First Name</Label>
                                    <Input name="firstName" required className="rounded-none border-slate-200 h-10 focus:ring-0 focus:border-red-800 text-xs font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold  text-slate-500">Last Name</Label>
                                    <Input name="lastName" required className="rounded-none border-slate-200 h-10 focus:ring-0 focus:border-red-800 text-xs font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold  text-slate-500">Email Designation</Label>
                                <Input name="email" type="email" required className="rounded-none border-slate-200 h-10 focus:ring-0 focus:border-red-800 text-xs font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold  text-slate-500">Authorization Role</Label>
                                <Select name="role" defaultValue="STUDENT">
                                    <SelectTrigger className="rounded-none border-slate-200 h-10 focus:ring-0 focus:border-red-800 text-xs font-bold">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-slate-200">
                                        <SelectItem value="ADMIN" className="text-xs font-bold">Administrator</SelectItem>
                                        <SelectItem value="TUTOR" className="text-xs font-bold">Academic Tutor</SelectItem>
                                        <SelectItem value="STAFF" className="text-xs font-bold">Operations Staff</SelectItem>
                                        <SelectItem value="STUDENT" className="text-xs font-bold">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-4 bg-red-50/50 border border-red-100/50 space-y-2">
                                <p className="text-[9px] font-bold text-red-800 flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> SECURITY PROTOCOL
                                </p>
                                <p className="text-[10px] text-red-600/80 leading-relaxed font-medium">
                                    New members are provisioned with a temporary identifier. They must initiate a password reset upon first authentication.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="p-8 pt-4 bg-slate-50/50">
                            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-none text-xs font-bold  h-11 px-6">Cancel</Button>
                            <Button type="submit" disabled={isCreating} className="rounded-none bg-slate-900 hover:bg-black text-white text-xs font-bold  h-11 px-8 shadow-lg shadow-slate-900/10">
                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Commit Provision
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MembersPage;
