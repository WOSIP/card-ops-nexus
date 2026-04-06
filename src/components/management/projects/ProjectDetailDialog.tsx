import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { 
  Calendar, 
  Info, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Monitor,
  MapPin,
  ExternalLink,
  Settings,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useManagement } from "@/context/ManagementContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ProjectDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onEdit: (project: Project) => void;
}

export const ProjectDetailDialog = ({ isOpen, onClose, project, onEdit }: ProjectDetailDialogProps) => {
  const { terminals } = useManagement();
  
  if (!project) return null;

  const projectTerminals = terminals.filter(t => t.projectId === project.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "Completed": return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "Draft": return <Clock className="w-5 h-5 text-warning" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Completed": return "bg-primary/10 text-primary border-primary/20";
      case "Draft": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden bg-card/95 backdrop-blur-2xl border-border/40 rounded-3xl shadow-2xl flex flex-col">
        <DialogHeader className="p-8 pb-6 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-border/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
                <Info className="text-primary w-7 h-7" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black tracking-tight text-foreground mb-1">{project.name}</DialogTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`font-bold border px-3 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                    <span className="mr-1.5">{getStatusIcon(project.status)}</span>
                    {project.status}
                  </Badge>
                  <span className="text-muted-foreground text-sm font-medium flex items-center gap-1.5 ml-2">
                    <Globe size={14} className="text-primary" />
                    {project.country}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium flex items-center gap-1.5 ml-2">
                    <Calendar size={14} />
                    Launched: {project.startDate}
                  </span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                onEdit(project);
                onClose();
              }}
              className="rounded-xl border-border/40 hover:bg-white/5 h-11 w-11 shrink-0"
            >
              <Settings size={20} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-8">
          <div className="space-y-8">
            {/* Description Section */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">Project Mission</h3>
              <p className="text-foreground/80 text-lg leading-relaxed font-medium bg-white/[0.02] p-6 rounded-2xl border border-border/10">
                {project.description}
              </p>
            </section>

            <Separator className="bg-border/10" />

            {/* Stats Summary - Avoiding Card Presentation as requested */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="px-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Country</p>
                <p className="text-xl font-black text-foreground flex items-center gap-2">
                  <Globe size={16} className="text-primary shrink-0" />
                  {project.country}
                </p>
              </div>
              <div className="px-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Capacity</p>
                <p className="text-2xl font-black text-foreground">{project.totalCards.toLocaleString()}</p>
              </div>
              <div className="px-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Distributed</p>
                <p className="text-2xl font-black text-foreground">{project.deployedCards.toLocaleString()}</p>
              </div>
              <div className="px-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Terminals</p>
                <p className="text-2xl font-black text-foreground">{projectTerminals.length}</p>
              </div>
            </section>

            <Separator className="bg-border/10" />

            {/* Terminals Section */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assigned Terminals</h3>
                <Badge variant="secondary" className="bg-white/5 font-bold">{projectTerminals.length} Terminals</Badge>
              </div>
              
              {projectTerminals.length > 0 ? (
                <div className="space-y-3">
                  {projectTerminals.map((terminal) => (
                    <div 
                      key={terminal.id} 
                      className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-border/10 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center border border-white/10">
                          <Monitor size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{terminal.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {terminal.location}</span>
                            <span className="flex items-center gap-1">SN: {terminal.serialNumber}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={terminal.status === "Online" ? "bg-success/20 text-success border-success/30" : "bg-muted text-muted-foreground border-border/20"}>
                        {terminal.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/[0.02] rounded-2xl border border-dashed border-border/20">
                  <Monitor className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm font-bold">No terminals assigned to this project yet.</p>
                </div>
              )}
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="p-8 pt-4 bg-white/[0.02] border-t border-border/10">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="h-12 px-6 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/5"
          >
            Close Details
          </Button>
          <Button 
            className="h-12 px-8 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Project Portal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};