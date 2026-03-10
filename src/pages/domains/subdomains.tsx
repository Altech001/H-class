import { useState } from "react";
import {
    Globe,
    Plus,
    Search,
    MoreHorizontal,
    ExternalLink,
    ShieldCheck,
    Clock,
    AlertCircle,
    CheckCircle2,
    Trash2,
    ArrowRight,
    Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SubdomainRecord {
    id: string;
    subdomain: string;
    type: "A" | "CNAME" | "TXT" | "AAAA";
    content: string;
    status: "active" | "pending" | "error";
    createdAt: string;
}

const initialRecords: SubdomainRecord[] = [
    {
        id: "1",
        subdomain: "portal",
        type: "A",
        content: "192.168.1.1",
        status: "active",
        createdAt: "2024-03-01"
    },
    {
        id: "2",
        subdomain: "api",
        type: "CNAME",
        content: "backend.hclass.com",
        status: "active",
        createdAt: "2024-03-05"
    },
    {
        id: "3",
        subdomain: "staging",
        type: "A",
        content: "192.168.1.50",
        status: "pending",
        createdAt: "2024-03-08"
    },
];

const Subdomains = () => {
    const [records, setRecords] = useState<SubdomainRecord[]>(initialRecords);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const filteredRecords = records.filter(record =>
        record.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: SubdomainRecord["status"]) => {
        switch (status) {
            case "active":
                return <Badge className="bg-success/20 text-success border border-success/20 hover:bg-success/20 px-4  text-[10px] ">Active</Badge>;
            case "pending":
                return <Badge className="bg-amber-200/20 text-amber-600 hover:bg-amber-200/70 border px-4  text-[10px] ">Pending</Badge>;
            case "error":
                return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/20 border px-4  text-[10px] ">Error</Badge>;
        }
    };

    return (
        <div className="space-y-8 max-w-7xl animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>

                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        Configure your subdomains and manage DNS records for <span className="text-primary font-bold">h-class.com</span>
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-11 px-6 rounded font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all gap-2">
                            <Plus className="h-5 w-5" />
                            New Subdomain
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-none border shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold ">Request Subdomain</DialogTitle>
                            <DialogDescription>
                                Enter the details for your new subdomain record.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="subdomain" className="text-sm font-bold">Subdomain Name</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="subdomain" placeholder="e.g. blog" className="h-11 rounded bg-white focus-visible:ring-0 focus-visible:ring-offset-0  outline-none focus:border-primary " />
                                    <span className="text-sm font-semibold text-primary">.hclass.com</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type" className="text-sm font-bold">Record Type</Label>
                                <Select defaultValue="A">
                                    <SelectTrigger className="h-11 border-slate-200 focus:ring-0 focus:ring-offset-0 ring-0 ring-offset-0 text-[14px] text-slate-700 rounded bg-white px-4 shadow-none outline-none">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border shadow-none">
                                        <SelectItem className="rounded-none" value="A">A (IPv4 Address)</SelectItem>
                                        <SelectItem className="rounded-none" value="AAAA">AAAA (IPv6 Address)</SelectItem>
                                        <SelectItem className="rounded-none" value="CNAME">CNAME (Alias)</SelectItem>
                                        <SelectItem className="rounded-none" value="TXT">TXT (Text)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="content" className="text-sm font-bold">Target / Content</Label>
                                <Input id="content" placeholder="e.g. 157.230.1.x" className="h-11  rounded bg-white focus-visible:ring-0 focus-visible:ring-offset-0  outline-none focus:border-primary " />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full h-11 rounded font-medium text-base shadow-lg shadow-primary/20"
                                onClick={() => {
                                    toast({
                                        title: "Request Submitted",
                                        description: "Your subdomain request is being processed by our system.",
                                    });
                                }}
                            >
                                Confirm Request
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Statistics & Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded border shadow-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground min-h-[160px] flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Globe className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <h3 className="text-sm font-bold opacity-80  text-[10px]">Active Subdomains</h3>
                            <p className="text-2xl font-bold mt-1">{records.filter(r => r.status === 'active').length}</p>
                            <div className="flex items-center gap-2 mt-4 text-xs font-bold ">
                                <CheckCircle2 className="h-4 w-4" />
                                All systems functional
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded border shadow-none bg-white overflow-hidden">
                        <div className="bg-slate-100 px-6 py-4 flex items-center gap-3">
                            <Info className="h-5 w-5 text-primary" />
                            <span className="text-sm font-bold text-primary ">Usage Policy</span>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                Subdomains are limited to <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-2">5 records</span> per account. Requests are usually processed within <span className="text-foreground font-bold">2-4 hours</span>.
                            </p>
                            <div className="pt-2">
                                <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                                    <div className="h-full bg-primary w-[60%]" />
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase  text-right">3 of 5 used</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Records Table */}
                <Card className="lg:col-span-2 rounded-none border-none shadow-none bg-white overflow-hidden flex flex-col min-h-[500px]">
                    <CardHeader className="p-6 border-b border-muted/50 flex flex-row items-center justify-between bg-slate-50/50">
                        <div>
                            <CardTitle className="text-xl ">DNS Records</CardTitle>
                            <CardDescription className="text-xs ">Configure points for your domain</CardDescription>
                        </div>
                        <div className="relative w-48 sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                            <Input
                                placeholder="Find records..."
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
                                    <TableHead className="w-[180px] font-medium text-[12px]   text-muted-foreground/70 px-6 h-12">Subdomain</TableHead>
                                    <TableHead className="font-medium text-[12px]   text-muted-foreground/70 h-12">Type</TableHead>
                                    <TableHead className="font-medium text-[12px]   text-muted-foreground/70 h-12">Target Content</TableHead>
                                    <TableHead className="font-medium text-[12px]   text-muted-foreground/70 h-12">Status</TableHead>
                                    <TableHead className="text-right px-6 h-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <TableRow key={record.id} className="group hover:bg-muted/20 border-b border-muted/40 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-foreground">{record.subdomain}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground opacity-60">hclass.com</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-bold px-1.5 py-0 rounded bg-slate-100 text-[10px] border">{record.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-[11px] font-medium text-muted-foreground bg-muted p-1 px-1.5 rounded">{record.content}</code>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(record.status)}
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground/60" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium italic">
                                            No records found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="p-4 border-t border-muted/50 bg-slate-50/50 flex items-center justify-between">
                        <p className="text-[10px] font-bold  text-muted-foreground/60 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Last propagation check: 2 minutes ago
                        </p>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase er rounded border-primary/20 hover:bg-primary/5">Reload Status</Button>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase er rounded border-primary/20 hover:bg-primary/5">Export CSV</Button>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex items-center gap-4 p-5 rounded bg-amber-50/50 border border-amber-200/50 text-amber-800">
                <div className="shrink-0 h-10 w-10 rounded bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-bold ">Important Notice</p>
                    <p className="text-xs font-medium text-amber-900/70">CNAME records cannot coexist with other record types on the same subdomain. Please verify your configuration before saving.</p>
                </div>
            </div>
        </div>
    );
};

export default Subdomains;
