import React from "react";
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
import { Operator } from "@/types";
import { motion } from "framer-motion";
import { UserPlus, Mail, ShieldCheck, Image as ImageIcon, Sparkles, Phone } from "lucide-react";

const operatorSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["Operator", "Supervisor"]),
  status: z.enum(["Active", "Inactive"]),
  avatarUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type OperatorFormValues = z.infer<typeof operatorSchema>;

interface CreateOperatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (operator: Operator) => void;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=new-operator";

export const CreateOperatorDialog = ({ isOpen, onClose, onCreate }: CreateOperatorDialogProps) => {
  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Operator",
      status: "Active",
      avatarUrl: "",
    },
  });

  const onSubmit = (data: OperatorFormValues) => {
    const newOperator: Operator = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      cardsDistributed: 0,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    };
    onCreate(newOperator);
    form.reset();
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
              <UserPlus className="text-primary w-6 h-6" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">Add New Operator</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-sm">Create a new system operator and assign roles.</DialogDescription>
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
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                           <Input placeholder="John Doe" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="operator@cardportal.com" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="+251 911 222 333" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                          <div className="flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-primary" />
                             <SelectValue placeholder="Select role" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                        <SelectItem value="Operator" className="font-bold cursor-pointer">Operator</SelectItem>
                        <SelectItem value="Supervisor" className="font-bold text-primary cursor-pointer">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Initial Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                        <SelectItem value="Active" className="font-bold text-success cursor-pointer">Active</SelectItem>
                        <SelectItem value="Inactive" className="font-bold text-warning cursor-pointer">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Avatar URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="https://..." className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
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
                <Sparkles className="mr-2 h-4 w-4" />
                Create Operator
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};