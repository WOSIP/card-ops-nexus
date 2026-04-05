import React, { useState } from "react";
import { 
  Plus, 
  Download, 
  Upload, 
  Filter, 
  MoreVertical, 
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  CreditCard
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Card as CardType, CardStatus } from "@/types";

const mockCards: CardType[] = [
  { id: "1", cardNumber: "4532 **** **** 9012", projectId: "p1", projectName: "Global Rewards", status: "Active", userName: "Sarah Connor", issuedAt: "2024-01-15" },
  { id: "2", cardNumber: "5105 **** **** 4422", projectId: "p2", projectName: "Eco-Friendly Transit", status: "Inactive", userName: "John Doe", issuedAt: "2024-02-10" },
  { id: "3", cardNumber: "4000 **** **** 1111", projectId: "p1", projectName: "Global Rewards", status: "Pending", userName: "Kyle Reese", issuedAt: "2024-03-05" },
  { id: "4", cardNumber: "4532 **** **** 5566", projectId: "p3", projectName: "Student Grant", status: "Blocked", userName: "Miles Dyson", issuedAt: "2023-11-20" },
  { id: "5", cardNumber: "5105 **** **** 8899", projectId: "p2", projectName: "Eco-Friendly Transit", status: "Active", userName: "T-800", issuedAt: "2024-03-12" },
];

const StatusBadge = ({ status }: { status: CardStatus }) => {
  switch (status) {
    case "Active": return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-lg font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Active</Badge>;
    case "Inactive": return <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/10 px-3 py-1 rounded-lg font-bold"><Clock className="w-3.5 h-3.5 mr-1.5" /> Inactive</Badge>;
    case "Pending": return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-3 py-1 rounded-lg font-bold"><Clock className="w-3.5 h-3.5 mr-1.5" /> Pending</Badge>;
    case "Blocked": return <Badge variant="destructive" className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-3 py-1 rounded-lg font-bold"><ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Blocked</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export const CardManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleBatchAction = (action: string) => {
    toast.success(`Batch action "${action}" initiated for selected cards.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Card Management</h1>
          <p className="text-muted-foreground mt-2 text-lg">Inventory oversight and batch operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-border/40 hover:bg-white/5 h-11 px-5 rounded-xl font-bold transition-all">
            <Upload size={18} />
            Import CSV
          </Button>
          <Button className="gap-2 shadow-xl shadow-primary/30 h-11 px-5 rounded-xl font-bold transition-all">
            <Plus size={18} />
            Issue New Card
          </Button>
        </div>
      </div>

      <Card className="border border-border/40 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="bg-white/[0.02] pb-6 border-b border-border/20 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full md:w-[450px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
              <Input 
                placeholder="Search by card number or user..." 
                className="pl-12 bg-white/5 border-border/40 focus:ring-primary/20 h-11 rounded-xl transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 border-border/40 hover:bg-white/5 h-10 px-4 rounded-lg font-bold">
                <Filter size={16} />
                Filter
              </Button>
              <div className="h-6 w-px bg-border/20 mx-2" />
              <Button variant="outline" size="sm" onClick={() => handleBatchAction("Activate")} className="shrink-0 border-border/40 hover:bg-emerald-500/10 hover:text-emerald-400 h-10 px-4 rounded-lg font-bold">Activate All</Button>
              <Button variant="outline" size="sm" onClick={() => handleBatchAction("Block")} className="text-rose-400 border-border/40 hover:bg-rose-500/10 h-10 px-4 rounded-lg font-bold">Block Selected</Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/5 h-10 w-10 rounded-lg shrink-0">
                <Download size={20} className="text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/20 h-16">
                  <TableHead className="w-[100px] text-muted-foreground font-bold px-8">ID</TableHead>
                  <TableHead className="text-muted-foreground font-bold">Card Number</TableHead>
                  <TableHead className="text-muted-foreground font-bold">Project</TableHead>
                  <TableHead className="text-muted-foreground font-bold">User</TableHead>
                  <TableHead className="text-muted-foreground font-bold">Status</TableHead>
                  <TableHead className="text-muted-foreground font-bold">Issued Date</TableHead>
                  <TableHead className="text-right text-muted-foreground font-bold px-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCards.filter(c => 
                  c.cardNumber.includes(searchTerm) || 
                  c.userName?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((card) => (
                  <TableRow key={card.id} className="border-border/10 hover:bg-white/[0.03] transition-colors h-20">
                    <TableCell className="font-mono text-xs font-black text-muted-foreground/60 px-8">#{card.id}</TableCell>
                    <TableCell className="font-bold text-foreground tracking-tight">{card.cardNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold px-2 py-0.5 rounded-md">
                        {card.projectName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">{card.userName}</TableCell>
                    <TableCell>
                      <StatusBadge status={card.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground/80 text-sm font-medium">{card.issuedAt}</TableCell>
                    <TableCell className="text-right px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-white/5 h-10 w-10 rounded-xl">
                            <MoreVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40 p-2 rounded-xl shadow-2xl">
                          <DropdownMenuItem className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-white/5" onClick={() => toast.info(`Viewing details for ${card.id}`)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-white/5" onClick={() => toast.info(`Editing card ${card.id}`)}>Edit Card</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-white/5" onClick={() => toast.success(`Card ${card.id} status updated`)}>Change Status</DropdownMenuItem>
                          <div className="h-px bg-border/20 my-1.5" />
                          <DropdownMenuItem className="text-rose-400 cursor-pointer font-bold py-2.5 rounded-lg focus:bg-rose-500/10">Block Card</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {mockCards.filter(c => 
                  c.cardNumber.includes(searchTerm) || 
                  c.userName?.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <CreditCard className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-lg font-medium">No records found matching your query.</p>
              <Button variant="link" className="text-primary mt-2" onClick={() => setSearchTerm("")}>Clear search</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};