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
import { User } from "@/types";
import { motion } from "framer-motion";
import { UserPen, Mail, Phone, CreditCard, Save } from "lucide-react";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  cardId: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Pending"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: User) => void;
  user: User | null;
}

export const EditUserDialog = ({ isOpen, onClose, onUpdate, user }: EditUserDialogProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cardId: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        cardId: user.cardId || "",
        status: user.status,
      });
    }
  }, [user, form]);

  const onSubmit = (data: UserFormValues) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cardId: data.cardId || undefined,
      status: data.status,
    };
    onUpdate(updatedUser);
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
              <UserPen className="text-primary w-6 h-6" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">Edit User Profile</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-sm">Modify beneficiary details and card assignment.</DialogDescription>
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
                           <UserPen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                          <Input placeholder="john@example.com" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input placeholder="+1 555-0000" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                      </div>
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
                        <SelectItem value="Active" className="font-bold text-success cursor-pointer">Active</SelectItem>
                        <SelectItem value="Pending" className="font-bold text-warning cursor-pointer">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="cardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Card ID (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input placeholder="XXXX-XXXX-XXXX-XXXX" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
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