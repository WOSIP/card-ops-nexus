import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  UserCheck, 
  UserX, 
  Mail, 
  Activity,
  MoreVertical,
  ShieldCheck
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Operator } from "@/types";

const mockOperators: Operator[] = [
  {
    id: "op1",
    name: "Elena Rodriguez",
    email: "elena.r@cardportal.com",
    role: "Supervisor",
    status: "Active",
    cardsDistributed: 1240,
    avatarUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/operator-1-4a1c503c-1775420726687.webp"
  },
  {
    id: "op2",
    name: "Marcus Chen",
    email: "m.chen@cardportal.com",
    role: "Operator",
    status: "Active",
    cardsDistributed: 842,
    avatarUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/operator-2-ec7c7d6e-1775420727065.webp"
  },
  {
    id: "op3",
    name: "Sarah Jenkins",
    email: "s.jenkins@cardportal.com",
    role: "Operator",
    status: "Inactive",
    cardsDistributed: 210,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: "op4",
    name: "David Smith",
    email: "d.smith@cardportal.com",
    role: "Operator",
    status: "Active",
    cardsDistributed: 530,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  }
];

export const OperatorManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleStatus = (id: string, current: string) => {
    const newStatus = current === "Active" ? "Inactive" : "Active";
    toast.success(`Operator status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Operator Management</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage personnel and distribution logistics.</p>
        </div>
        <Button className="gap-2 shadow-xl shadow-primary/30 h-12 px-6 rounded-xl font-bold">
          <Plus size={20} />
          Add Operator
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Operators", value: "24", icon: Users, color: "var(--primary)", desc: "18 Active currently" },
          { label: "Distribution Rate", value: "125/day", icon: Activity, color: "#10b981", desc: "+15% this week" },
          { label: "System Roles", value: "3 Tiers", icon: ShieldCheck, color: "#8b5cf6", desc: "Policy compliant" },
        ].map((stat, i) => (
          <Card key={i} className="border border-border/40 shadow-xl bg-card/40 backdrop-blur-md overflow-hidden group">
            <div className="h-1.5 w-full" style={{ backgroundColor: stat.color }} />
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{stat.label}</p>
                  <h3 className="text-3xl font-black mt-2 text-foreground">{stat.value}</h3>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-foreground group-hover:scale-110 transition-transform" style={{ color: stat.color }}>
                  <stat.icon size={26} />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-muted-foreground/80 bg-white/[0.03] w-fit px-3 py-1.5 rounded-lg border border-white/5">
                <span style={{ color: stat.color }}>•</span>
                <span>{stat.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border/40 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="bg-white/[0.02] pb-6 border-b border-border/20 p-8">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-12 bg-white/5 border-border/40 focus:ring-primary/20 h-11 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/20 h-16">
                <TableHead className="text-muted-foreground font-bold px-8">Operator</TableHead>
                <TableHead className="text-muted-foreground font-bold">Role</TableHead>
                <TableHead className="text-muted-foreground font-bold">Cards Distributed</TableHead>
                <TableHead className="text-muted-foreground font-bold">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOperators.filter(op => 
                op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                op.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((op) => (
                <TableRow key={op.id} className="border-border/10 hover:bg-white/[0.03] transition-colors h-20">
                  <TableCell className="px-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-primary/20 ring-4 ring-primary/5">
                        <AvatarImage src={op.avatarUrl} />
                        <AvatarFallback className="bg-muted text-foreground font-bold">{op.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-base text-foreground tracking-tight">{op.name}</p>
                        <p className="text-xs font-medium text-muted-foreground/70">{op.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`px-3 py-1 rounded-lg font-bold text-xs ${op.role === "Supervisor" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"}`}>
                      {op.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <span className="font-black text-foreground">{op.cardsDistributed.toLocaleString()}</span>
                         <span className="text-[10px] text-muted-foreground/60 font-bold">/ 1,500</span>
                      </div>
                      <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" 
                          style={{ width: `${Math.min(100, (op.cardsDistributed / 1500) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={op.status === "Active"} 
                        onCheckedChange={() => toggleStatus(op.id, op.status)}
                      />
                      <span className={`text-xs font-black uppercase tracking-tighter ${op.status === "Active" ? "text-emerald-400" : "text-rose-400"}`}>
                        {op.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-white/5 h-10 w-10 rounded-xl">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40 p-2 rounded-xl shadow-2xl">
                        <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors">
                          <Mail size={18} /> <span className="font-bold">Contact Operator</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors">
                          <Activity size={18} /> <span className="font-bold">Performance Report</span>
                        </DropdownMenuItem>
                        <div className="h-px bg-border/20 my-1.5" />
                        <DropdownMenuItem className="text-rose-400 gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-rose-500/10 focus:text-rose-300 transition-colors">
                          <UserX size={18} /> <span className="font-bold">Revoke Access</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};