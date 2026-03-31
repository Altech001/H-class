import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useDomains } from "@/hooks/use-domains";
import { format } from "date-fns";
import {
    CheckCircle2,
    Clock,
    ExternalLink,
    Globe,
    Info,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Subdomains = () => {
    const { useGetMyDomain, requestDomain } = useDomains();
    const { data: domain, isLoading } = useGetMyDomain();
    const [isRequesting, setIsRequesting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleRequestDomain = async () => {
        setIsRequesting(true);
        try {
            await requestDomain();
            toast.success("Domain request submitted successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Failed to request domain");
        } finally {
            setIsRequesting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return <Badge className="bg-success/20 text-success border border-success/20 hover:bg-success/20 px-4 text-[10px]">Active</Badge>;
            case "pending":
                return <Badge className="bg-amber-200/20 text-amber-600 hover:bg-amber-200/70 border px-4 text-[10px]">Pending</Badge>;
            case "error":
                return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/20 border px-4 text-[10px]">Error</Badge>;
            default:
                return <Badge variant="secondary" className="px-4 text-[10px]">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-sm font-bold">Portal Subdomains</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        Configure your unique portal access and manage your LMS domain on <span className="text-primary font-bold">h-class.com</span>
                    </p>
                </div>

                {!domain && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded font-bold  hover:shadow-primary/30 active:scale-95 transition-all gap-2">
                                <Plus className="h-5 w-5" />
                                Request Portal Domain
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-none border shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Request Portal Access</DialogTitle>
                                <DialogDescription>
                                    Our system will automatically generate a unique, professional subdomain for your LMS portal based on your profile.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold">Automatic Provisioning</p>
                                            <p className="text-xs text-muted-foreground mt-1">Your domain will be ready in 2-4 hours after approval.</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground italic text-center">
                                    Example: yourname.h-class.com
                                </p>
                            </div>
                            <DialogFooter>
                                <Button
                                    className="w-full h-11 rounded font-medium text-base shadow-lg shadow-primary/20"
                                    onClick={handleRequestDomain}
                                    disabled={isRequesting}
                                >
                                    {isRequesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Confirm Request
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Statistics & Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded border shadow-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground min-h-[160px] flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Globe className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <h3 className="text-sm font-bold opacity-80 text-[10px]">Active Portals</h3>
                            <p className="text-2xl font-bold mt-1">{domain?.status === 'ACTIVE' ? 1 : 0}</p>
                            <div className="flex items-center gap-2 mt-4 text-xs font-bold ">
                                <CheckCircle2 className="h-4 w-4" />
                                {domain?.status === 'ACTIVE' ? "System active" : "No active domain"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded border shadow-none bg-white overflow-hidden">
                        <div className="bg-slate-100 px-6 py-4 flex items-center gap-3">
                            <Info className="h-5 w-5 text-primary" />
                            <span className="text-sm font-bold text-primary ">Domain Policy</span>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                Each account is eligible for <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-2">one unique subdomain</span>. Requests are processed within <span className="text-foreground font-bold">2-4 hours</span>.
                            </p>
                            <div className="pt-2">
                                <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                                    <div className={`h-full bg-primary ${domain ? 'w-full' : 'w-0'}`} />
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase text-right">{domain ? '1 of 1 used' : '0 of 1 used'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Records Table */}
                <Card className="lg:col-span-2 rounded-none border-none shadow-none bg-white overflow-hidden flex flex-col min-h-[400px]">
                    <CardHeader className="p-6 border-b border-muted/50 flex flex-row items-center justify-between bg-slate-50/50">
                        <div>
                            <CardTitle className="text-xl ">Portal Configuration</CardTitle>
                            <CardDescription className="text-xs ">Your provisioned access point</CardDescription>
                        </div>
                        <div className="relative w-48 sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                            <Input
                                placeholder="Search domain..."
                                className="pl-9 h-9 rounded focus-visible:ring-0 focus-visible:ring-offset-0 border- outline-none focus:border-primary bg-white/70 border ring-0 ring-border/50 focus-visible:ring-primary text-xs font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[200px] font-medium text-[12px] text-muted-foreground/70 px-6 h-12">Entry Point</TableHead>
                                    <TableHead className="font-medium text-[12px] text-muted-foreground/70 h-12">Type</TableHead>
                                    <TableHead className="font-medium text-[12px] text-muted-foreground/70 h-12">Status</TableHead>
                                    <TableHead className="font-medium text-[12px] text-muted-foreground/70 h-12">Created</TableHead>
                                    <TableHead className="text-right px-6 h-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domain ? (
                                    <TableRow className="group hover:bg-muted/20 border-b border-muted/40 transition-colors">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-foreground">{domain.subdomain}.h-class.com</span>
                                                <span className="text-[10px] font-medium text-primary opacity-60">LMS Portal</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-bold px-1.5 py-0 rounded bg-slate-100 text-[10px] border">CNAME</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(domain.status)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] font-medium text-muted-foreground">{format(new Date(domain.createdAt), "MMM dd, yyyy")}</span>
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground/60" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center py-10">
                                            <div className="flex flex-col items-center gap-2">
                                                <Globe className="h-8 w-8 text-muted-foreground/20" />
                                                <p className="text-sm font-medium text-muted-foreground">No portal domain provisioned yet.</p>
                                                <p className="text-xs text-muted-foreground/60">Request a subdomain to host your LMS.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="p-4 border-t border-muted/50 bg-slate-50/50 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            System heartbeat: Active
                        </p>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase rounded border-primary/20 hover:bg-primary/5">Refresh</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Subdomains;
