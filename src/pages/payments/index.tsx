import {
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Filter,
    MoreVertical,
    Plus,
    Wallet,
    History,
    TrendingUp,
    ReceiptText,
    ShieldCheck,
    Clock,
    Search,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const transactions = [
    { id: "1", type: "income", description: "Course Purchase - Advanced React", amount: "299.00", date: "Mar 07, 2024", status: "completed" },
    { id: "2", type: "expense", description: "Domain Renewal - hclass.com", amount: "12.99", date: "Mar 05, 2024", status: "completed" },
    { id: "3", type: "income", description: "Affiliate Payout", amount: "45.50", date: "Mar 02, 2024", status: "pending" },
    { id: "4", type: "expense", description: "Server Hosting Fee", amount: "25.00", date: "Feb 28, 2024", status: "completed" },
    { id: "5", type: "income", description: "Course Purchase - UI Design basics", amount: "199.00", date: "Feb 25, 2024", status: "completed" },
];

const Payments = () => {
    return (
        <div className="space-y-8 max-w-7xl animate-in fade-in duration-700 pb-10 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-muted-foreground mt-1">Manage your transactions and financials.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded font-semibold border-primary/20 hover:bg-primary/5">
                        <Download className="h-4 w-4 mr-2" />
                        Export Statement
                    </Button>
                    <Button className="rounded font-semibold shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4 mr-2" />
                        Withdraw Funds
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-white p-2 shadow-sm">
                <Card className="rounded border-none shadow-none bg-slate-50 text-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <TrendingUp className="h-20 w-20" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-900/60 font-bold  text-[10px]">Total Balance</CardDescription>
                        <CardTitle className="text-xl font-extrabold">UGX 1,280.50</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                            <ArrowUpRight className="h-4 w-4" />
                            30% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded border-none shadow-none bg-slate-50 relative overflow-hidden group">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-muted-foreground font-bold  text-[10px]">Overdraft Amount</CardDescription>
                        <CardTitle className="text-xl font-extrabold">UGX 850.00</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                            <div className="w-[70%] h-full bg-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded border-none shadow-none bg-slate-50 relative overflow-hidden group">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-muted-foreground font-bold  text-[10px]">Balance</CardDescription>
                        <CardTitle className="text-xl font-extrabold">UGX 45.50</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs ">
                            <Clock className="h-4 w-4" />
                            Processing (24h)
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols- gap-8">
                {/* Transaction History */}
                <Card className="lg:col-span-2 rounded border-none shadow-none bg-white overflow-hidden flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between p-6 bg-slate-50/50 border-b">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">

                                Recent Transactions
                            </CardTitle>
                            <CardDescription className="text-xs font-medium ">Financial activity log</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white"><Filter className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white"><Search className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 border-none">
                                    <TableHead className="px-6 font-bold text-[11px]  h-12">Description</TableHead>
                                    <TableHead className="font-bold text-[11px]  h-12">Date</TableHead>
                                    <TableHead className="font-bold text-[11px]  h-12">Amount</TableHead>
                                    <TableHead className="font-bold text-[11px]  h-12">Status</TableHead>
                                    <TableHead className="h-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => (
                                    <TableRow key={t.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-100/60">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                                                    t.type === 'income' ? ' text-emerald-600' : ' text-rose-600'
                                                )}>
                                                    {t.type === 'income' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                                </div>
                                                <span className="font-bold text-[13px] text-slate-800">{t.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[12px] font-medium text-slate-500">{t.date}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "font-extrabold text-[13px]",
                                                t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                                            )}>{t.amount}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(
                                                "px-2 py-0.5 rounded-lg border-none text-[9px] font-bold uppercase tracking-wider",
                                                t.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            )}>
                                                {t.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="p-4 bg-slate-50/30 flex justify-center border-t">
                        <Button variant="link" className="text-xs font-bold text-primary group ">
                            View All Activity
                            <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Payments;
