import React, { useState, useMemo } from "react";
import { 
  Monitor, 
  Plus, 
  MapPin, 
  Zap, 
  Wifi, 
  WifiOff, 
  History,
  CreditCard,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Activity,
  AlertTriangle,
  UserCheck,
  Users,
  FolderKanban,
  X,
  Smartphone,
  Eye,
  Phone,
  Download,
  Upload,
  FileText
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PosTerminal, Transaction, UserRole } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CreatePOSDialog } from "./pos/CreatePOSDialog";
import { EditPOSDialog } from "./pos/EditPOSDialog";
import { ImportPOSDialog } from "./pos/ImportPOSDialog";
import { LinkOperatorPOSDialog } from "./LinkOperatorPOSDialog";
import { POSIdentityDialog } from "./pos/POSIdentityDialog";
import { useManagement } from "@/context/ManagementContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const mockTransactions: Transaction[] = [
  { id: "tx1", cardId: "4532-****-9012", amount: 45.00, timestamp: "2024-03-20 14:22", location: "Central Mall", status: "Success" },
  { id: "tx2", cardId: "5105-****-4422", amount: 12.50, timestamp: "2024-03-20 14:35", location: "Metro Station", status: "Success" },
  { id: "tx3", cardId: "4000-****-1111", amount: 120.00, timestamp: "2024-03-20 15:10", location: "Airport Arrival", status: "Failed" },
  { id: "tx4", cardId: "4532-****-5566", amount: 8.20, timestamp: "2024-03-20 15:45", location: "University Cafeteria", status: "Success" },
  { id: "tx5", cardId: "5105-****-8899", amount: 32.40, timestamp: "2024-03-20 16:02", location: "Central Mall", status: "Success" },
];

interface POSManagerProps {
  userRole?: UserRole;
}

export const POSManager = ({ userRole = "Super Admin" }: POSManagerProps) => {
  const { 
    terminals, 
    operators, 
    projects,
    linkOperatorsToPos, 
    updateTerminal, 
    createTerminal, 
    bulkCreateTerminals,
    deleteTerminal 
  } = useManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [selectedPOS, setSelectedPOS] = useState<PosTerminal | null>(null);
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isIdentityOpen, setIsIdentityOpen] = useState(false);

  // RBAC
  const canLink = userRole === "Super Admin" || userRole === "Supervisor";

  const filteredTerminals = useMemo(() => {
    let result = terminals;

    // Project Filter
    if (projectFilter !== "all") {
      result = result.filter(t => t.projectId === projectFilter);
    }

    // Text Search
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(t => {
        const opNames = (t.operatorIds || []).map(id => {
          const op = operators.find(o => o.id === id);
          return op ? op.name : "";
        }).join(" ");
        return (
          t.name.toLowerCase().includes(term) ||
          t.serialNumber.toLowerCase().includes(term) ||
          t.cardIdentity.toLowerCase().includes(term) ||
          t.phoneNumber.toLowerCase().includes(term) ||
          t.id.toLowerCase().includes(term) ||
          t.location.toLowerCase().includes(term) ||
          (t.projectName && t.projectName.toLowerCase().includes(term)) ||
          opNames.toLowerCase().includes(term)
        );
      });
    }

    return result;
  }, [terminals, searchTerm, projectFilter, operators]);

  const currentSelectedPOS = useMemo(() => {
    if (!selectedPOS) return null;
    return terminals.find(t => t.id === selectedPOS.id) || selectedPOS;
  }, [terminals, selectedPOS]);

  const stats = useMemo(() => ({
    total: terminals.length,
    online: terminals.filter(t => t.status === "Online").length,
    offline: terminals.filter(t => t.status === "Offline").length,
    maintenance: terminals.filter(t => t.status === "Maintenance").length
  }), [terminals]);

  const handleCreate = (newPos: PosTerminal) => {
    createTerminal(newPos);
    setIsCreateOpen(false);
    toast.success("Terminal " + newPos.serialNumber + " registered successfully");
  };

  const handleImport = (newTerminals: PosTerminal[]) => {
    bulkCreateTerminals(newTerminals);
    setIsImportOpen(false);
    toast.success(`${newTerminals.length} terminals imported successfully`, {
      description: "Fleet database has been updated with the new batch."
    });
  };

  const handleUpdate = (updatedPos: PosTerminal) => {
    updateTerminal(updatedPos);
    setIsEditOpen(false);
    setSelectedPOS(null);
    toast.success("Terminal " + updatedPos.serialNumber + " updated successfully");
  };

  const handleDelete = (id: string) => {
    const deleted = terminals.find(t => t.id === id);
    deleteTerminal(id);
    toast.success("Terminal " + (deleted ? deleted.serialNumber : id) + " removed from system");
  };

  const handleLink = (posId: string, operatorIds: string[]) => {
    linkOperatorsToPos(operatorIds, posId, true);
    setIsLinkOpen(false);
    if (!isIdentityOpen) {
      setSelectedPOS(null);
    }
    toast.success(operatorIds.length + " operator(s) linked to terminal");
  };

  const openEdit = (pos: PosTerminal) => {
    setSelectedPOS(pos);
    setIsEditOpen(true);
  };

  const openLink = (pos: PosTerminal) => {
    setSelectedPOS(pos);
    setIsLinkOpen(true);
  };

  const openIdentity = (pos: PosTerminal) => {
    setSelectedPOS(pos);
    setIsIdentityOpen(true);
  };

  const downloadTemplate = () => {
    const headers = 'Name,SerialNumber,CardIdentity,PhoneNumber,Location,Status,BullID';
    const example = 'Terminal Alpha,SN-99421,5105 8421 7732 9042,+251911222333,Addis Mall,Online,BULL-001';
    const blob = new Blob([headers + String.fromCharCode(10) + example], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pos_import_template.csv';
    a.click();
    toast.success('Template downloaded');
  };

  const exportToCSV = () => {
    if (filteredTerminals.length === 0) {
      toast.error("No terminals to export");
      return;
    }

    const headers = [
      "ID", "Terminal Name", "Serial Number", "Card Identity", "Phone Number", 
      "Location", "Status", "Last Activity", "Total Transactions", 
      "Associated Project", "Operators Count", "Assigned Operators", 
      "Bull Enabled", "Bull ID", "Firmware Version", "Protocol", "Environment"
    ];

    const csvData = filteredTerminals.map(pos => {
      const opNames = (pos.operatorIds || [])
        .map(id => {
          const op = operators.find(o => o.id === id);
          return op ? op.name : id;
        })
        .join("; ");

      const bull = pos.bullRegistration;

      return [
        pos.id,
        '"' + (pos.name || "").replace(/"/g, '""') + '"',
        '"' + (pos.serialNumber || "").replace(/"/g, '""') + '"',
        '"' + (pos.cardIdentity || "").replace(/"/g, '""') + '"',
        '"' + (pos.phoneNumber || "").replace(/"/g, '""') + '"',
        '"' + (pos.location || "").replace(/"/g, '""') + '"',
        pos.status,
        '"' + (pos.lastPing || "").replace(/"/g, '""') + '"',
        pos.totalTransactions,
        '"' + (pos.projectName || "N/A").replace(/"/g, '""') + '"',
        pos.operatorIds ? pos.operatorIds.length : 0,
        '"' + opNames.replace(/"/g, '""') + '"',
        bull && bull.enabled ? "Yes" : "No",
        '"' + (bull && bull.bullId ? bull.bullId : "N/A") + '"',
        '"' + (bull && bull.firmwareVersion ? bull.firmwareVersion : "N/A") + '"',
        '"' + (bull && bull.protocol ? bull.protocol : "N/A") + '"',
        '"' + (bull && bull.environment ? bull.environment : "N/A") + '"'
      ].join(",");
    });

    const csvContent = "\\uFEFF" + [headers.join(","), ...csvData].join(String.fromCharCode(10));
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute("href", url);
    link.setAttribute("download", "pos-network-inventory-" + date + ".csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("POS Network list exported successfully");
  };

  const selectedProjectName = useMemo(() => {
    if (projectFilter === "all") return null;
    const p = projects.find(proj => proj.id === projectFilter);
    return p ? p.name : null;
  }, [projectFilter, projects]);

  const existingSerials = useMemo(() => terminals.map(t => t.serialNumber), [terminals]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              POS Network
            </h1>
            {userRole === "Supervisor" && (
              <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 transition-colors">Supervisor View</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2 text-lg font-medium leading-relaxed text-balance">
            Monitor and manage your hardware ecosystem in real-time.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportToCSV}
                  className="flex items-center gap-2 h-11 px-5 rounded-xl font-bold bg-card border border-border/40 hover:bg-white/5 transition-all shadow-lg shadow-black/5 text-foreground"
                >
                  <Download size={18} className="text-primary" />
                  <span className="hidden xs:inline">Export List</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>Download full network inventory as CSV</TooltipContent>
            </Tooltip>

            <div className="flex items-center bg-primary/10 border border-primary/30 rounded-xl p-1 shadow-lg shadow-primary/5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={downloadTemplate} 
                    className="p-2.5 hover:bg-primary/10 rounded-lg text-primary transition-colors flex items-center gap-2"
                  >
                    <FileText size={18} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">CSV Template</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Download CSV Import Template</TooltipContent>
              </Tooltip>
              <div className="w-px h-6 bg-primary/20 mx-1" />
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsImportOpen(true)}
                className="flex items-center gap-2 h-10 px-6 rounded-lg font-black bg-primary text-primary-foreground transition-all shadow-md shadow-primary/20"
              >
                <Upload size={18} />
                <span className="hidden xs:inline uppercase text-[11px] tracking-widest">Bulk Import</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 h-11 px-6 rounded-xl font-black bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="hidden xs:inline uppercase text-xs tracking-widest">Register Terminal</span>
              <span className="xs:hidden">Register</span>
            </motion.button>
          </TooltipProvider>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Terminals", value: stats.total, icon: Monitor, color: "primary" },
          { label: "Online Now", value: stats.online, icon: Wifi, color: "success" },
          { label: "Critical Offline", value: stats.offline, icon: WifiOff, color: "destructive" },
          { label: "Maintenance", value: stats.maintenance, icon: Monitor, color: "warning" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border/40 shadow-sm overflow-hidden bg-card/40 backdrop-blur-md hover:border-primary/40 transition-all duration-300 group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-inner", 
                  stat.color === 'primary' ? "bg-primary/10 text-primary" : 
                  stat.color === 'success' ? "bg-success/10 text-success" : 
                  stat.color === 'warning' ? "bg-warning/10 text-warning" : 
                  "bg-destructive/10 text-destructive")}>
                  <stat.icon size={26} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-foreground">{stat.value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10">
        <div className="p-4 md:p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/40 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                type="text"
                placeholder="Search by name, ID, phone, serial or card ID..." 
                className="pl-12 h-14 bg-white/5 border-border/40 rounded-2xl focus-visible:ring-primary/20 text-lg font-medium transition-all shadow-inner group-hover:border-primary/20 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full md:w-64">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="h-14 bg-white/5 border-border/40 rounded-2xl focus:ring-primary/20">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-primary" />
                      <SelectValue placeholder="Filter by Project" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                    <SelectItem value="all" className="font-bold cursor-pointer">All Projects</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-bold cursor-pointer">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden lg:block h-10 w-px bg-border/40 mx-2" />
              <Badge variant="secondary" className="h-14 px-6 rounded-2xl text-sm font-black uppercase tracking-widest bg-white/5 border border-border/40 whitespace-nowrap">
                {filteredTerminals.length} Results
              </Badge>
            </div>
          </div>
          
          {(searchTerm || projectFilter !== "all") && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-muted-foreground font-bold uppercase whitespace-nowrap">Active Filters:</span>
              {projectFilter !== "all" && (
                <Badge className="bg-success/20 text-success border-success/20 gap-1.5 px-3 py-1 rounded-full">
                  Project: {selectedProjectName}
                  <X size={12} className="cursor-pointer" onClick={() => setProjectFilter("all")} />
                </Badge>
              )}
              {searchTerm && (
                <Badge className="bg-primary/20 text-primary border-primary/20 gap-1.5 px-3 py-1 rounded-full">
                  "{searchTerm}"
                  <X size={12} className="cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="border-border/40 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-xl rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between bg-white/[0.02] border-b border-border/20 p-8">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Terminal Inventory</CardTitle>
              <CardDescription className="text-base font-medium mt-1">Manage and monitor all POS terminals in the field.</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">Active Fleet</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/20 hover:bg-transparent px-8">
                    <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest pl-8">Device Identity</TableHead>
                    <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Location</TableHead>
                    <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">ID & Phone Identification</TableHead>
                    <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Personnel / Project</TableHead>
                    <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Last Activity</TableHead>
                    <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground font-black uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredTerminals.map((pos) => {
                      const assignedCount = pos.operatorIds ? pos.operatorIds.length : 0;
                      const firstOperator = pos.operatorIds && pos.operatorIds.length > 0 
                        ? operators.find(o => o.id === pos.operatorIds![0]) 
                        : null;

                      return (
                        <motion.tr
                          layout
                          key={pos.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="group cursor-pointer hover:bg-white/[0.03] border-b border-border/10 transition-colors"
                          onClick={() => openIdentity(pos)}
                        >
                          <TableCell className="pl-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2.5 rounded-xl shadow-inner border", pos.status === 'Online' ? "bg-success/10 text-success border-success/20" : pos.status === 'Offline' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-warning/10 text-warning border-warning/20")}>
                                <Smartphone size={18} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-foreground text-sm tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{pos.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <Zap size={10} className="text-warning fill-warning" />
                                  <span className="font-mono text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{pos.serialNumber}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                              <MapPin size={14} className="text-primary/60" />
                              <span className="truncate max-w-[150px]">{pos.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                               <div className="flex items-center gap-1.5">
                                 <CreditCard size={12} className="text-primary/60" />
                                 <span className="font-mono text-[11px] font-black text-foreground tracking-widest uppercase">{pos.cardIdentity}</span>
                               </div>
                               <div className="flex items-center gap-1.5">
                                 <Phone size={12} className="text-success" />
                                 <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{pos.phoneNumber}</span>
                               </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                              {assignedCount > 0 ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 w-fit">
                                        <Users size={10} strokeWidth={2.5} />
                                        {assignedCount === 1 ? (firstOperator ? firstOperator.name : "Operator") : assignedCount + " Operators"}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-card/95 backdrop-blur-xl border-border/40 p-3 rounded-xl shadow-2xl">
                                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Assigned Personnel</p>
                                      <ul className="space-y-1.5">
                                        {pos.operatorIds?.map(id => {
                                          const op = operators.find(o => o.id === id);
                                          return op ? (
                                            <li key={id} className="flex items-center gap-2 text-xs font-bold text-foreground">
                                              <div className="w-1 h-1 rounded-full bg-primary" />
                                              {op.name}
                                            </li>
                                          ) : null;
                                        })}
                                      </ul>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground/60 bg-muted/20 px-2.5 py-1 rounded-lg w-fit">
                                  <AlertTriangle size={10} />
                                  Unassigned
                                </div>
                              )}
                              {pos.projectName && (
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 w-fit">
                                  <FolderKanban size={10} strokeWidth={2.5} />
                                  {pos.projectName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col">
                               <span className="text-xs font-bold text-foreground">{pos.lastPing}</span>
                               <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Heartbeat</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <Badge className={cn("px-3 py-1 rounded-full font-black text-[10px] tracking-widest", pos.status === 'Online' ? "bg-success/10 text-success border-success/30" : pos.status === 'Offline' ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-warning/10 text-warning border-warning/30")}>
                                <span className="mr-1.5">\\u25cf</span>
                                {pos.status.toUpperCase()}
                              </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-8" onClick={(e) => e.stopPropagation()}>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                    <MoreVertical size={18} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40 p-2 rounded-2xl shadow-2xl">
                                  <DropdownMenuItem onClick={() => openEdit(pos)} className="gap-3 cursor-pointer rounded-xl font-bold py-2.5">
                                    <Edit size={16} className="text-primary" /> Edit Terminal
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuItem onClick={() => openIdentity(pos)} className="gap-3 cursor-pointer rounded-xl font-bold py-2.5">
                                    <Eye size={16} className="text-primary" /> View Details
                                  </DropdownMenuItem>

                                  {canLink && (
                                    <DropdownMenuItem onClick={() => openLink(pos)} className="gap-3 cursor-pointer rounded-xl text-primary font-bold py-2.5">
                                      <UserCheck size={16} /> Assign Operators
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem onClick={() => { setSelectedPOS(pos); setIsTxOpen(true); }} className="gap-3 cursor-pointer rounded-xl font-bold py-2.5">
                                    <History size={16} className="text-success" /> Service Logs
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-border/40 my-1" />
                                  <DropdownMenuItem onClick={() => handleDelete(pos.id)} className="gap-3 text-destructive font-bold cursor-pointer rounded-xl py-2.5 focus:bg-destructive/10">
                                    <Trash2 size={16} /> Decommission
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
              
              {filteredTerminals.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6 border border-border/40 shadow-inner">
                    <Search className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2">No terminals found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto font-medium">
                    We couldn't find any devices matching your filters.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setProjectFilter("all");
                    }}
                    className="mt-6 rounded-xl px-8 font-bold border-border/40 hover:bg-white/5"
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-white/[0.02] border-t border-border/20 flex justify-center">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stats.online} Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stats.offline} Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stats.maintenance} Alert</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isTxOpen} onOpenChange={setIsTxOpen}>
        <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-2xl border-border/40 text-foreground p-0 overflow-hidden rounded-[2rem] shadow-2xl">
          <div className="p-8 space-y-8">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/30 shadow-inner">
                  <Monitor className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black tracking-tight text-foreground">
                    Telemetry: {selectedPOS?.name}
                  </DialogTitle>
                  <DialogDescription className="text-base font-medium text-muted-foreground">
                    Device Serial: <span className="text-primary font-bold">{selectedPOS?.serialNumber}</span> \\u2022 Tracking historical data flow.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Daily Throughput", value: "$" + ((selectedPOS ? selectedPOS.totalTransactions : 0) * 12) + ".00", icon: Activity, color: "primary" },
                { label: "Auth Success", value: "142", icon: UserCheck, color: "success" },
                { label: "Blocked / Failed", value: "3", icon: AlertTriangle, color: "destructive" },
              ].map((m, i) => (
                <Card key={i} className="p-6 border-border/40 bg-white/[0.03] shadow-inner rounded-2xl relative overflow-hidden group">
                  <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500", m.color === 'primary' ? "text-primary" : m.color === 'success' ? "text-success" : "text-destructive")}>
                    <m.icon size={64} />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{m.label}</p>
                  <p className={cn("text-3xl font-black", m.color === 'primary' ? "text-foreground" : m.color === 'success' ? "text-success" : "text-destructive")}>{m.value}</p>
                </Card>
              ))}
            </div>
             
             <div className="rounded-2xl border border-border/40 overflow-hidden bg-white/[0.01]">
               <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-black text-[10px] tracking-widest pl-6 uppercase">ID</TableHead>
                      <TableHead className="text-muted-foreground font-black text-[10px] tracking-widest uppercase">Amount</TableHead>
                      <TableHead className="text-muted-foreground font-black text-[10px] tracking-widest uppercase">Timeline</TableHead>
                      <TableHead className="text-right text-muted-foreground font-black text-[10px] tracking-widest pr-6 uppercase">Verdict</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.slice(0, 5).map((tx) => (
                      <TableRow key={tx.id} className="border-border/20 hover:bg-white/5 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-foreground pl-6">{tx.cardId}</TableCell>
                        <TableCell className="font-black text-foreground">${tx.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-medium">{tx.timestamp}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge variant="outline" className={cn("font-black text-[9px] tracking-wider", tx.status === 'Success' ? 'border-success/30 text-success bg-success/10' : 'border-destructive/30 text-destructive bg-destructive/10')}>
                            {tx.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
               </Table>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreatePOSDialog 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onCreate={handleCreate}
      />

      <EditPOSDialog 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setSelectedPOS(null);
        }} 
        onUpdate={handleUpdate}
        pos={selectedPOS}
      />

      <ImportPOSDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
        existingSerials={existingSerials}
      />

      <LinkOperatorPOSDialog
        isOpen={isLinkOpen}
        onClose={() => {
          setIsLinkOpen(false);
          setSelectedPOS(null);
        }}
        onLink={handleLink}
        sourceType="pos"
        sourceItem={selectedPOS}
        availableTargets={operators}
      />

      <POSIdentityDialog
        isOpen={isIdentityOpen}
        onClose={() => {
          setIsIdentityOpen(false);
          setSelectedPOS(null);
        }}
        pos={currentSelectedPOS}
        onLink={openLink}
      />
    </div>
  );
};