import React, { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Activity,
  MoreVertical,
  ShieldCheck,
  Edit,
  Trash2,
  Filter,
  ArrowUpDown,
  Link as LinkIcon,
  Monitor,
  Phone
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Operator, UserRole } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { CreateOperatorDialog } from "./operators/CreateOperatorDialog";
import { EditOperatorDialog } from "./operators/EditOperatorDialog";
import { LinkOperatorPOSDialog } from "./LinkOperatorPOSDialog";
import { useManagement } from "@/context/ManagementContext";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty";

interface OperatorManagerProps {
  userRole?: UserRole;
}

export const OperatorManager = ({ userRole = "Super Admin" }: OperatorManagerProps) => {
  const { 
    operators, 
    terminals, 
    linkOperatorsToPos, 
    updateOperator, 
    createOperator, 
    deleteOperator 
  } = useManagement();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

  // RBAC: Check if the user can perform linkage
  const canLink = userRole === "Super Admin" || userRole === "Supervisor";

  const filteredOperators = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return operators.filter(op => 
      op.name.toLowerCase().includes(term) || 
      op.email.toLowerCase().includes(term) ||
      (op.phone && op.phone.toLowerCase().includes(term)) ||
      op.id.toLowerCase().includes(term)
    );
  }, [operators, searchTerm]);

  const stats = useMemo(() => {
    const active = operators.filter(o => o.status === "Active").length;
    const totalDistributed = operators.reduce((acc, curr) => acc + curr.cardsDistributed, 0);
    return {
      total: operators.length,
      active,
      distributed: totalDistributed
    };
  }, [operators]);

  const toggleStatus = (id: string, current: string) => {
    const newStatus = current === "Active" ? "Inactive" : "Active";
    const op = operators.find(o => o.id === id);
    if (op) {
      updateOperator({ ...op, status: newStatus as any });
      toast.success(`Operator status updated to ${newStatus}`);
    }
  };

  const handleCreate = (newOperator: Operator) => {
    createOperator(newOperator);
    setIsCreateOpen(false);
    toast.success("New operator registered successfully");
  };

  const handleUpdate = (updatedOperator: Operator) => {
    updateOperator(updatedOperator);
    setIsEditOpen(false);
    setSelectedOperator(null);
    toast.success("Operator profile updated");
  };

  const handleDelete = (id: string) => {
    deleteOperator(id);
    toast.success("Operator removed from system");
  };

  const handleLink = (operatorId: string, posIds: string[]) => {
    if (posIds.length === 0) return;
    const posId = posIds[0];
    const pos = terminals.find(p => p.id === posId);
    if (!pos) return;

    linkOperatorsToPos([operatorId], posId);
    
    setIsLinkOpen(false);
    setSelectedOperator(null);
    toast.success(`Operator linked to ${pos.name}`);
  };

  const openEdit = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsEditOpen(true);
  };

  const openLink = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsLinkOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Operator Management</h1>
            {userRole === "Supervisor" && (
              <Badge className="bg-primary/20 text-primary border-primary/20">Supervisor View</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2 text-lg">Manage personnel and distribution logistics.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shadow-xl shadow-primary/30 h-12 px-6 rounded-xl font-bold bg-primary hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            Add Operator
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Operators", value: stats.total, icon: Users, color: "var(--primary)", desc: `${stats.active} Active currently` },
          { label: "Total Distributed", value: stats.distributed.toLocaleString(), icon: Activity, color: "var(--success)", desc: "Cards processed" },
          { label: "System Roles", value: "2 Tiers", icon: ShieldCheck, color: "var(--warning)", desc: "Policy compliant" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border border-border/40 shadow-xl bg-card/40 backdrop-blur-md overflow-hidden group">
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
                  <span style={{ color: stat.color }}>●</span>
                  <span>{stat.desc}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border border-border/40 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="bg-white/[0.02] pb-6 border-b border-border/20 p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
              <Input 
                placeholder="Search by name, email, or phone..." 
                className="pl-12 bg-white/5 border-border/40 focus:ring-primary/20 h-11 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-11 px-4 gap-2 border-border/40 bg-white/5 rounded-xl text-muted-foreground hover:text-foreground">
              <Filter size={18} />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/20 h-16">
                <TableHead className="text-muted-foreground font-bold px-8">Operator</TableHead>
                <TableHead className="text-muted-foreground font-bold">Role</TableHead>
                <TableHead className="text-muted-foreground font-bold">Assigned POS</TableHead>
                <TableHead className="text-muted-foreground font-bold">
                   <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                      Cards Distributed <ArrowUpDown size={14} />
                   </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-bold">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredOperators.length > 0 ? (
                  filteredOperators.map((op, idx) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={op.id}
                      className="group border-border/10 hover:bg-white/[0.03] transition-colors h-20"
                    >
                      <TableCell className="px-8">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-primary/20 ring-4 ring-primary/5 transition-transform group-hover:scale-105">
                            <AvatarImage src={op.avatarUrl} />
                            <AvatarFallback className="bg-muted text-foreground font-bold">{op.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="font-bold text-base text-foreground tracking-tight">{op.name}</p>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/70">
                               <span>{op.email}</span>
                               {op.phone && (
                                 <>
                                   <span className="opacity-30">●</span>
                                   <span className="flex items-center gap-1"><Phone size={10} /> {op.phone}</span>
                                 </>
                               )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`px-3 py-1 rounded-lg font-bold text-xs ${op.role === "Supervisor" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"}`}>
                          {op.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {op.posName ? (
                          <div className="flex items-center gap-2 text-primary font-bold text-xs">
                            <Monitor size={14} />
                            {op.posName}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No terminal linked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-sm">
                             <span className="font-black text-foreground">{op.cardsDistributed.toLocaleString()}</span>
                             <span className="text-[10px] text-muted-foreground/60 font-bold">DISTRIBUTED</span>
                          </div>
                          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (op.cardsDistributed / 1500) * 100)}%` }}
                              className="h-full bg-primary" 
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
                          <span className={`text-xs font-black uppercase tracking-tighter w-12 ${op.status === "Active" ? "text-success" : "text-warning"}`}>
                            {op.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-white/5 h-10 w-10 rounded-xl transition-all">
                              <MoreVertical size={20} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40 p-2 rounded-xl shadow-2xl">
                            <DropdownMenuItem 
                              onClick={() => openEdit(op)}
                              className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors"
                            >
                              <Edit size={18} /> <span className="font-bold">Edit Profile</span>
                            </DropdownMenuItem>
                            
                            {canLink && (
                              <DropdownMenuItem 
                                onClick={() => openLink(op)}
                                className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors"
                              >
                                <LinkIcon size={18} /> <span className="font-bold">Link to POS</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors">
                              <Mail size={18} /> <span className="font-bold">Contact</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors">
                              <Activity size={18} /> <span className="font-bold">Performance</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/20 my-1.5" />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(op.id)}
                              className="text-destructive gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-destructive/10 focus:text-destructive transition-colors"
                            >
                              <Trash2 size={18} /> <span className="font-bold">Remove Access</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64">
                       <Empty className="border-none">
                          <EmptyContent>
                            <EmptyTitle>No operators found</EmptyTitle>
                            <EmptyDescription>Try adjusting your search or add a new operator.</EmptyDescription>
                          </EmptyContent>
                        </Empty>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateOperatorDialog 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <EditOperatorDialog 
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedOperator(null);
        }}
        onUpdate={handleUpdate}
        operator={selectedOperator}
      />

      <LinkOperatorPOSDialog
        isOpen={isLinkOpen}
        onClose={() => {
          setIsLinkOpen(false);
          setSelectedOperator(null);
        }}
        onLink={handleLink}
        sourceType="operator"
        sourceItem={selectedOperator}
        availableTargets={terminals}
      />
    </div>
  );
};