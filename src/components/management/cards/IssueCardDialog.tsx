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
import { Card as CardType } from "@/types";
import { motion } from "framer-motion";
import { CreditCard, Sparkles } from "lucide-react";

const issueSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(19),
  projectName: z.string().min(1, "Please select a project"),
});

type IssueFormValues = z.infer<typeof issueSchema>;

interface IssueCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onIssue: (card: CardType) => void;
}

const mockProjects = [
  { id: "p1", name: "Global Rewards" },
  { id: "p2", name: "Eco-Friendly Transit" },
  { id: "p3", name: "Student Grant" },
  { id: "p4", name: "Corporate Travel" },
];

export const IssueCardDialog = ({ isOpen, onClose, onIssue }: IssueCardDialogProps) => {
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      cardNumber: "",
      projectName: "Global Rewards",
    },
  });

  const onSubmit = (data: IssueFormValues) => {
    const newCard: CardType = {
      id: Math.random().toString(36).substr(2, 9),
      cardNumber: data.cardNumber.replace(/(\d{4})/g, "$1 ").trim(),
      projectId: mockProjects.find(p => p.name === data.projectName)?.id || "p1",
      projectName: data.projectName,
      status: "Pending",
      userName: "", // Issued but not linked
      issuedAt: new Date().toISOString().split('T')[0],
    };
    onIssue(newCard);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-2xl border-border/40 p-0 overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center overflow-hidden border-b border-border/20">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/modern-obsidian-card-preview-da1b578d-1775420728362.webp" 
            alt="Card Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="relative z-10 text-center space-y-2">
            <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border border-primary/30 backdrop-blur-md">
              <Sparkles className="text-primary w-6 h-6" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight text-foreground">Issue Card</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">Create a new card record for the inventory.</DialogDescription>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Card Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input placeholder="4532000011112222" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                        {mockProjects.map(p => (
                          <SelectItem key={p.id} value={p.name} className="font-bold cursor-pointer">{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl font-bold hover:bg-white/5">Cancel</Button>
              <Button type="submit" className="h-12 px-8 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20">Confirm Issuance</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};