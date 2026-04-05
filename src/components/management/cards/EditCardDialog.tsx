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
import { Card as CardType } from "@/types";
import { Settings2, ShieldCheck, UserPlus } from "lucide-react";

const editSchema = z.object({
  status: z.enum(["Active", "Inactive", "Pending", "Blocked"]),
  projectName: z.string().min(1, "Please select a project"),
  userName: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardType | null;
  onUpdate: (card: CardType) => void;
}

const mockProjects = [
  { id: "p1", name: "Global Rewards" },
  { id: "p2", name: "Eco-Friendly Transit" },
  { id: "p3", name: "Student Grant" },
  { id: "p4", name: "Corporate Travel" },
];

export const EditCardDialog = ({ isOpen, onClose, card, onUpdate }: EditCardDialogProps) => {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      status: "Active",
      projectName: "",
      userName: "",
    },
  });

  useEffect(() => {
    if (card) {
      form.reset({
        status: card.status,
        projectName: card.projectName,
        userName: card.userName || "",
      });
    }
  }, [card, form]);

  const onSubmit = (data: EditFormValues) => {
    if (!card) return;
    const updatedCard: CardType = {
      ...card,
      status: data.status,
      projectName: data.projectName,
      projectId: mockProjects.find(p => p.name === data.projectName)?.id || card.projectId,
      userName: data.userName || "",
    };
    onUpdate(updatedCard);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-2xl border-border/40 rounded-3xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-primary/20">
              {card?.userName ? <Settings2 className="text-primary w-6 h-6" /> : <UserPlus className="text-primary w-6 h-6" />}
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                {card?.userName ? "Modify Card" : "Link User to Card"}
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">ID: #{card?.id}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 pt-6 space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Card Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/5 border-border/40 rounded-xl font-bold">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                        <SelectItem value="Active" className="font-bold text-success cursor-pointer">Active</SelectItem>
                        <SelectItem value="Inactive" className="font-bold text-neutral-grey cursor-pointer">Inactive</SelectItem>
                        <SelectItem value="Pending" className="font-bold text-warning cursor-pointer">Pending</SelectItem>
                        <SelectItem value="Blocked" className="font-bold text-destructive cursor-pointer">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Associated User</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter user's full name" 
                        className="h-12 bg-white/5 border-border/40 rounded-xl font-bold" 
                        {...field} 
                      />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/5 border-border/40 rounded-xl font-bold">
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

            <div className="bg-success/5 border border-success/10 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="text-success w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs text-success/80 leading-relaxed font-medium">
                {card?.userName 
                  ? "Modifying these parameters will update the live permissions for the physical card immediately."
                  : "Linking a user is required before the card can be activated for transactions."}
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl font-bold hover:bg-white/5 transition-all">Cancel</Button>
              <Button type="submit" className="h-12 px-8 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                {card?.userName ? "Save Changes" : "Link & Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};