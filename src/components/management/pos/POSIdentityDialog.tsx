import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { PosTerminal } from "@/types";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  MapPin, 
  Activity, 
  Wifi, 
  WifiOff, 
  CreditCard, 
  Cpu, 
  History, 
  Settings,
  ShieldCheck,
  Zap,
  Phone,
  Users,
  UserPlus,
  UserMinus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface POSIdentityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pos: PosTerminal | null;
  onLink?: (pos: PosTerminal) => void;
  onUnlink?: (posId: string) => void;
}

export const POSIdentityDialog = ({ isOpen, onClose, pos, onLink, onUnlink }: POSIdentityDialogProps) => {
  if (!pos) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-3xl border-border/40 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        {/* Header with Background Pattern */}
        <div className="relative h-48 bg-gradient-to-br from-primary/30 via-background to-background flex items-center justify-center overflow-hidden border-b border-border/20">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <div className="bg-primary/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto border border-primary/30 backdrop-blur-xl mb-3 shadow-inner">
              <Smartphone className="text-primary w-8 h-8" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight text-foreground">{pos.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground font-bold flex items-center justify-center gap-2 mt-1">
              <Badge variant="outline" className="bg-white/5 border-primary/20 text-primary">{pos.serialNumber}</Badge>
              <span className="opacity-40">●</span>
              <span className="flex items-center gap-1.5">
                {pos.status === 'Online' ? <Wifi size={14} className="text-success" /> : <WifiOff size={14} className="text-destructive" />}
                {pos.status}
              </span>
            </DialogDescription>
          </motion.div>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Visual Terminal Card */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-success/50 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
            <div className="relative aspect-[1.586/1] w-full max-w-md mx-auto bg-neutral-900 rounded-[2rem] p-8 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/10">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/10 rounded-full blur-3xl -ml-24 -mb-24" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Terminal Identity</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-primary w-5 h-5" />
                    <span className="text-lg font-black text-white tracking-tight">SECURE POS NODE</span>
                  </div>
                </div>
                <div className="w-12 h-10 bg-gradient-to-br from-yellow-400/80 to-yellow-600/80 rounded-lg shadow-inner flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-3 gap-0.5 opacity-40">
                    {[...Array(9)].map((_, i) => <div key={i} className="w-2 h-2 border border-black/20" />)}
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Full Card Identity</p>
                  <p className="text-xl md:text-2xl font-mono font-black text-white tracking-[0.15em] drop-shadow-lg break-all">
                    {pos.cardIdentity}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-success mb-1">Phone Identification</p>
                  <div className="flex items-center gap-2">
                    <Phone className="text-success w-4 h-4" />
                    <p className="text-lg font-black text-white tracking-[0.1em]">
                      {pos.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Hardware Serial</p>
                  <p className="text-sm font-bold text-white uppercase">{pos.serialNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Last Active</p>
                  <p className="text-sm font-bold text-white">{pos.lastPing}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Volume", value: pos.totalTransactions, icon: Activity, color: "text-primary" },
              { label: "Latency", value: "42ms", icon: Zap, color: "text-warning" },
              { label: "Status", value: pos.status, icon: Cpu, color: "text-success" },
              { label: "Network", value: "Encrypted", icon: ShieldCheck, color: "text-primary" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-border/40 shadow-inner">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg font-black text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Location, Details & Operators */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-border/40 shadow-inner group transition-colors hover:border-primary/20">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Physical Deployment</p>
                <p className="text-lg font-bold text-foreground">{pos.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-border/40 shadow-inner group transition-colors hover:border-success/20">
              <div className="p-3 rounded-2xl bg-success/10 text-success">
                <Settings className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Project Link</p>
                <p className="text-lg font-bold text-foreground">{pos.projectName || "Unassigned"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-border/40 shadow-inner group transition-colors hover:border-blue-500/20">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned Personnel</p>
                <p className="text-lg font-bold text-foreground">{pos.operatorName || "Unassigned"}</p>
              </div>
              <div className="flex items-center gap-2">
                {pos.operatorId ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => onUnlink?.(pos.id)}
                    title="Unlink Operator"
                  >
                    <UserMinus className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl text-primary hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => onLink?.(pos)}
                    title="Assign Operator"
                  >
                    <UserPlus className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 h-12 rounded-2xl font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <History className="mr-2 w-4 h-4" />
              Audit Logs
            </Button>
            <Button variant="outline" className="flex-1 h-12 rounded-2xl font-black border-border/40 hover:bg-white/5" onClick={onClose}>
              Close Identity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};