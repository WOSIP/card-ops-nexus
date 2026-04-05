import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PosTerminal, POSStatus } from "@/types";
import { motion } from "framer-motion";
import { Monitor, MapPin, Hash, Save, FolderKanban, CreditCard, Phone } from "lucide-react";
import { useManagement } from "@/context/ManagementContext";

const posSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  serialNumber: z.string().min(5, "Serial number must be at least 5 characters"),
  cardIdentity: z.string().min(10, "Card identity must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  status: z.enum(["Online", "Offline", "Maintenance"]),
  projectId: z.string().optional(),
});

type POSFormValues = z.infer<typeof posSchema>;

interface EditPOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (pos: PosTerminal) => void;
  pos: PosTerminal | null;
}

export const EditPOSDialog = ({ isOpen, onClose, onUpdate, pos }: EditPOSDialogProps) => {
  const { projects } = useManagement();
  
  const form = useForm<POSFormValues>({
    resolver: zodResolver(posSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      cardIdentity: "",
      phoneNumber: "",
      location: "",
      status: "Online",
      projectId: "none",
    },
  });

  useEffect(() => {
    if (pos) {
      form.reset({
        name: pos.name,
        serialNumber: pos.serialNumber,
        cardIdentity: pos.cardIdentity,
        phoneNumber: pos.phoneNumber || "",
        location: pos.location,
        status: pos.status,
        projectId: pos.projectId || "none",
      });
    }
  }, [pos, form]);

  const onSubmit = (data: POSFormValues) => {
    if (!pos) return;
    
    const selectedProject = projects.find(p => p.id === data.projectId);
    
    const updatedPos: PosTerminal = {
      ...pos,
      name: data.name,
      serialNumber: data.serialNumber,
      cardIdentity: data.cardIdentity,
      phoneNumber: data.phoneNumber,
      location: data.location,
      status: data.status as POSStatus,
      projectId: data.projectId === "none" ? undefined : data.projectId,
      projectName: selectedProject?.name,
    };
    onUpdate(updatedPos);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-2xl border-border/40 p-0 overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative h-40 bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center overflow-hidden border-b border-border/20">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50"
          />
          <div className="relative z-10 text-center space-y-2 px-6">
            <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border border-primary/30 backdrop-blur-md">
              <Monitor className="text-primary w-6 h-6" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">Edit Terminal: {pos?.serialNumber}</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-sm">Update the terminal configuration and location details.</DialogDescription>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Terminal Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Monitor className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                           <Input placeholder="Main Entrance Terminal" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="cardIdentity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Terminal Card Identity</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                           <Input placeholder="5105 **** **** 0000" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Identification</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                           <Input placeholder="+251 911 000 000" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Associated Project</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                            <div className="flex items-center gap-2">
                              <FolderKanban className="w-4 h-4 text-primary" />
                              <SelectValue placeholder="Select a project" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                          <SelectItem value="none" className="font-bold cursor-pointer">No Project Link</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id} className="font-bold cursor-pointer">
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Serial Number / TID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="TID-12345678" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Physical Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="Central Mall - South Wing" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Current Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                        <SelectItem value="Online" className="font-bold text-success cursor-pointer">Online</SelectItem>
                        <SelectItem value="Offline" className="font-bold text-destructive cursor-pointer">Offline</SelectItem>
                        <SelectItem value="Maintenance" className="font-bold text-warning cursor-pointer">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl font-bold hover:bg-white/5">Cancel</Button>
              <Button type="submit" className="h-12 px-8 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20">
                <Save className="mr-2 h-4 w-4" />
                Update Terminal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};