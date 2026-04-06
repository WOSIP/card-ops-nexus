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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Project } from "@/types";
import { Settings, Save, Globe, Check, ChevronsUpDown } from "lucide-react";
import { COUNTRIES } from "@/constants/countries";
import { cn } from "@/lib/utils";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  country: z.string().min(1, "Please select a country"),
  status: z.enum(["Active", "Completed", "Draft"]),
  totalCards: z.number().min(1, "Total cards must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdate: (project: Project) => void;
}

export const EditProjectDialog = ({ isOpen, onClose, project, onUpdate }: EditProjectDialogProps) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      country: "",
      status: "Draft",
      totalCards: 0,
      startDate: "",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description,
        country: project.country || "",
        status: project.status,
        totalCards: project.totalCards,
        startDate: project.startDate,
      });
    }
  }, [project, form]);

  const onSubmit = (data: ProjectFormValues) => {
    if (project) {
      const updatedProject: Project = {
        ...project,
        name: data.name,
        description: data.description,
        country: data.country,
        status: data.status,
        totalCards: data.totalCards,
        startDate: data.startDate,
      };
      onUpdate(updatedProject);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-2xl border-border/40 p-0 overflow-hidden rounded-3xl shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-white/[0.02] border-b border-border/10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center border border-primary/30 backdrop-blur-md">
              <Settings className="text-primary w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">Project Configuration</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-sm">Update project parameters and distribution goals.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project Name</FormLabel>
                      <FormControl>
                        <Input className="h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[100px] bg-white/5 border-border/40 rounded-xl resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Globe size={12} className="text-primary" />
                        Target Country
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "h-11 bg-white/5 border-border/40 rounded-xl justify-between px-4 font-medium",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? COUNTRIES.find((country) => country === field.value)
                                : "Select country..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-primary" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[calc(600px-64px)] p-0 bg-card/95 backdrop-blur-2xl border-border/40 shadow-2xl rounded-xl z-50">
                          <Command className="bg-transparent">
                            <CommandInput placeholder="Search country..." className="h-12 border-none focus:ring-0 font-medium" />
                            <CommandList className="max-h-[300px] scrollbar-thin scrollbar-thumb-white/10">
                              <CommandEmpty className="py-6 text-center text-sm font-medium text-muted-foreground">No country found.</CommandEmpty>
                              <CommandGroup>
                                {COUNTRIES.map((country) => (
                                  <CommandItem
                                    value={country}
                                    key={country}
                                    onSelect={() => {
                                      form.setValue("country", country);
                                    }}
                                    className="cursor-pointer py-3 px-4 font-bold flex items-center justify-between hover:bg-primary/10 data-[selected=true]:bg-primary/20 transition-colors"
                                  >
                                    {country}
                                    <Check
                                      className={cn(
                                        "h-4 w-4 text-primary transition-opacity",
                                        country === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="totalCards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Card Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="h-11 bg-white/5 border-border/40 rounded-xl" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                        <SelectItem value="Draft" className="font-bold cursor-pointer">Draft</SelectItem>
                        <SelectItem value="Active" className="font-bold text-success cursor-pointer">Active</SelectItem>
                        <SelectItem value="Completed" className="font-bold text-primary cursor-pointer">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl font-bold hover:bg-white/5">Cancel</Button>
              <Button type="submit" className="h-12 px-8 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};