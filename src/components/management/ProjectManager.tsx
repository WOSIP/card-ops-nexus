import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Settings, 
  Calendar, 
  ChevronRight,
  Search,
  Filter,
  Trash2,
  MoreVertical,
  LayoutGrid,
  List,
  Monitor,
  Eye,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Project } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CreateProjectDialog } from "./projects/CreateProjectDialog";
import { EditProjectDialog } from "./projects/EditProjectDialog";
import { ProjectDetailDialog } from "./projects/ProjectDetailDialog";
import { useManagement } from "@/context/ManagementContext";

export const ProjectManager = () => {
  const { projects, terminals, createProject, updateProject, deleteProject } = useManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  const handleCreateProject = (newProject: Project) => {
    createProject(newProject);
    setIsCreateOpen(false);
    toast.success("Project created successfully", {
      description: `${newProject.name} is now available in your management dashboard.`,
    });
  };

  const handleUpdateProject = (updatedProject: Project) => {
    updateProject(updatedProject);
    setIsEditOpen(false);
    toast.success("Project updated", {
      description: `Settings for ${updatedProject.name} have been saved.`,
    });
  };

  const handleDeleteProject = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const projectToDelete = projects.find(p => p.id === id);
    deleteProject(id);
    toast.error("Project deleted", {
      description: `${projectToDelete?.name} has been removed from the system.`,
    });
  };

  const handleEditClick = (project: Project, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProject(project);
    setIsEditOpen(true);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]";
      case "Draft": return "bg-warning text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]";
      case "Completed": return "bg-primary text-white shadow-[0_0_10px_rgba(var(--primary),0.3)]";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPosCount = (projectId: string) => {
    return terminals.filter(t => t.projectId === projectId).length;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Project Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Configure and monitor card distribution initiatives.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="border-border/40 hover:bg-white/5 h-11 w-11 rounded-xl transition-all"
          >
            {viewMode === "grid" ? <List size={20} /> : <LayoutGrid size={20} />}
          </Button>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            Create Project
          </Button>
        </motion.div>
      </div>

      <Card className="border border-border/40 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-xl rounded-2xl">
        <CardHeader className="bg-white/[0.02] pb-6 border-b border-border/10 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full md:w-[450px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4.5 h-4.5" />
              <Input 
                placeholder="Search projects by name or description..." 
                className="pl-12 bg-white/5 border-border/40 focus:ring-2 focus:ring-primary/20 h-11 rounded-xl transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 border-border/40 hover:bg-white/5 h-10 px-4 rounded-lg font-bold">
                <Filter size={16} />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => {
                  const posCount = getPosCount(project.id);
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      <Card className="overflow-hidden group border border-border/40 shadow-md hover:shadow-2xl hover:border-primary/40 transition-all duration-500 bg-card/60 backdrop-blur-sm group relative">
                        <CardHeader className="pb-2 px-6 pt-6 relative">
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1 pr-8">{project.name}</CardTitle>
                            <div className="absolute top-6 right-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/40 rounded-xl">
                                  <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1">Project Actions</DropdownMenuLabel>
                                  <DropdownMenuItem className="cursor-pointer font-bold gap-2" onClick={(e) => handleEditClick(project, e)}>
                                    <Settings size={14} /> Edit Project
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-border/20" />
                                  <DropdownMenuItem className="cursor-pointer font-bold text-destructive gap-2" onClick={(e) => handleDeleteProject(project.id, e)}>
                                    <Trash2 size={14} /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <Badge className={`border-none font-bold mb-4 inline-block ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                          <CardDescription className="line-clamp-2 min-h-[2.5rem] text-muted-foreground font-medium text-sm leading-relaxed">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-6 pb-6">
                          <div className="space-y-2.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Deployment Velocity</span>
                              <span className="font-black text-foreground">{Math.round((project.deployedCards / project.totalCards) * 100)}%</span>
                            </div>
                            <Progress value={(project.deployedCards / project.totalCards) * 100} className="h-1.5 bg-muted/30 shadow-inner" />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest pt-4 border-t border-border/10">
                            <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-primary" />
                              <span>Launched: {project.startDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Monitor size={12} className="text-success" />
                              <span>{posCount} Terminals</span>
                            </div>
                          </div>
                        </CardContent>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="ghost" className="bg-primary text-white hover:bg-primary/90 rounded-full h-12 w-12 p-0 shadow-lg scale-0 group-hover:scale-100 transition-transform">
                            <Eye size={24} />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="hover:bg-transparent border-border/10">
                    <TableHead className="w-[300px] py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Identity</TableHead>
                    <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Velocity</TableHead>
                    <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Terminals</TableHead>
                    <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Date</TableHead>
                    <TableHead className="py-6 text-right px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleProjectClick(project)}
                        className="group cursor-pointer hover:bg-white/[0.04] border-border/5 transition-colors"
                      >
                        <TableCell className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
                              <LayoutGrid size={18} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-black text-foreground group-hover:text-primary transition-colors">{project.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{project.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`border-none font-bold shadow-none ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
                            <span className="text-[10px] font-black text-foreground">{Math.round((project.deployedCards / project.totalCards) * 100)}%</span>
                            <Progress value={(project.deployedCards / project.totalCards) * 100} className="h-1.5 w-24 bg-muted/30" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground">
                          {getPosCount(project.id)}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          {project.startDate}
                        </TableCell>
                        <TableCell className="text-right px-8" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleProjectClick(project)}
                              className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary"
                            >
                              <ArrowUpRight size={16} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/5">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/40 rounded-xl">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1">Project Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer font-bold gap-2" onClick={(e) => handleProjectClick(project)}>
                                  <Eye size={14} /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer font-bold gap-2" onClick={(e) => handleEditClick(project, e)}>
                                  <Settings size={14} /> Edit Project
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border/20" />
                                <DropdownMenuItem className="cursor-pointer font-bold text-destructive gap-2" onClick={(e) => handleDeleteProject(project.id, e)}>
                                  <Trash2 size={14} /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                <LayoutGrid className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-lg font-bold">No projects found.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your search terms or create a new project.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <CreateProjectDialog 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onCreate={handleCreateProject}
      />

      <EditProjectDialog 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        project={selectedProject}
        onUpdate={handleUpdateProject}
      />

      <ProjectDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={selectedProject}
        onEdit={(p) => {
          setSelectedProject(p);
          setIsEditOpen(true);
        }}
      />
    </div>
  );
};