import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card as CardType, BulkIssueType, User } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Sparkles, Hash, Users, CreditCard, ChevronRight, Check } from "lucide-react";
import { useManagement } from "@/context/ManagementContext";

const bulkIssueSchema = z.object({
  type: z.enum(["Inventory", "Users"]),
  quantity: z.number().min(1, "Minimum 1 card").max(100, "Maximum 100 cards at once"),
  projectId: z.string().min(1, "Please select a project"),
  baseNumber: z.string().min(8, "Base number must be at least 8 digits").max(12, "Base number too long"),
  selectedUserIds: z.array(z.string()).optional(),
});

type BulkIssueFormValues = z.infer<typeof bulkIssueSchema>;

interface BulkIssueCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkIssue: (cards: CardType[]) => void;
}

export const BulkIssueCardDialog = ({ isOpen, onClose, onBulkIssue }: BulkIssueCardDialogProps) => {
  const { projects, users } = useManagement();
  const [step, setStep] = useState<"configure" | "preview">("configure");

  // Filter users who don't have a card yet
  const availableUsers = users.filter(u => !u.cardId);
  
  const form = useForm<BulkIssueFormValues>({
    resolver: zodResolver(bulkIssueSchema),
    defaultValues: {
      type: "Inventory",
      quantity: 10,
      projectId: projects[0]?.id || "",
      baseNumber: "45320000",
      selectedUserIds: [],
    },
  });

  const watchType = form.watch("type");
  const watchQuantity = form.watch("quantity");
  const watchBaseNumber = form.watch("baseNumber");

  const generatePreviewCards = (data: BulkIssueFormValues): CardType[] => {
    const selectedProject = projects.find(p => p.id === data.projectId);
    const newCards: CardType[] = [];
    const count = data.type === "Users" ? (data.selectedUserIds?.length || 0) : data.quantity;
    
    for (let i = 0; i < count; i++) {
      const suffix = (1000 + i).toString();
      const randomMiddle = Math.floor(Math.random() * 9000 + 1000).toString();
      const rawNumber = `${data.baseNumber}${randomMiddle}${suffix}`;
      const formattedNumber = rawNumber.replace(/(\\d{4})/g, "$1 ").trim();
      
      let linkedUserName = "";
      let linkedUserId = "";

      if (data.type === "Users" && data.selectedUserIds) {
        const user = users.find(u => u.id === data.selectedUserIds![i]);
        if (user) {
          linkedUserName = user.name;
          linkedUserId = user.id;
        }
      }
      
      newCards.push({
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        cardNumber: formattedNumber,
        projectId: data.projectId,
        projectName: selectedProject?.name || "Unknown Project",
        status: data.type === "Users" ? "Active" : "Pending",
        userName: linkedUserName,
        userId: linkedUserId,
        issuedAt: new Date().toISOString().split('T')[0],
      });
    }
    return newCards;
  };

  const onSubmit = (data: BulkIssueFormValues) => {
    if (step === "configure") {
      setStep("preview");
      return;
    }

    const newCards = generatePreviewCards(data);
    onBulkIssue(newCards);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("configure");
      form.reset();
    }, 300);
  };

  const previewCards = generatePreviewCards(form.getValues());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-2xl border-border/40 p-0 overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative h-40 bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center overflow-hidden border-b border-border/20">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/bulk-cards-preview-a5cfff7e-1775440661027.webp" 
            alt="Bulk Cards Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="relative z-10 text-center space-y-1 px-8">
            <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center mx-auto border border-primary/30 backdrop-blur-md mb-2">
              {step === "configure" ? <Layers className="text-primary w-5 h-5" /> : <Sparkles className="text-primary w-5 h-5" />}
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
              {step === "configure" ? "Bulk Card Issuance" : "Confirm Issuance"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              {step === "configure" 
                ? "Set up batch parameters or select beneficiaries."
                : `Reviewing ${previewCards.length} cards before final generation.`}
            </DialogDescription>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="p-6 overflow-y-auto max-h-[450px]">
              <AnimatePresence mode="wait">
                {step === "configure" ? (
                  <motion.div
                    key="configure"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-3 p-1 bg-muted/30 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => form.setValue("type", "Inventory")}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          watchType === "Inventory" 
                            ? "bg-background text-primary shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <Hash className="w-4 h-4" /> Inventory
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("type", "Users")}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          watchType === "Users" 
                            ? "bg-background text-primary shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <Users className="w-4 h-4" /> Direct to Users
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Target Project</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                                  <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
                                {projects.map(p => (
                                  <SelectItem key={p.id} value={p.id} className="font-bold cursor-pointer">{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="baseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Base Prefix</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input placeholder="45320000" className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {watchType === "Inventory" ? (
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Number of Cards to Generate</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input 
                                  type="number" 
                                  placeholder="10" 
                                  className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Users ({form.watch("selectedUserIds")?.length || 0})</label>
                          <Button 
                            type="button" 
                            variant="link" 
                            size="sm" 
                            className="text-xs h-auto p-0"
                            onClick={() => form.setValue("selectedUserIds", availableUsers.map(u => u.id))}
                          >
                            Select All Available
                          </Button>
                        </div>
                        <ScrollArea className="h-[200px] w-full rounded-xl border border-border/20 bg-muted/10 p-4">
                          <div className="space-y-2">
                            {availableUsers.map(user => (
                              <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <Checkbox 
                                  id={`user-${user.id}`}
                                  checked={form.watch("selectedUserIds")?.includes(user.id)}
                                  onCheckedChange={(checked) => {
                                    const current = form.getValues("selectedUserIds") || [];
                                    if (checked) {
                                      form.setValue("selectedUserIds", [...current, user.id]);
                                    } else {
                                      form.setValue("selectedUserIds", current.filter(id => id !== user.id));
                                    }
                                  }}
                                />
                                <label htmlFor={`user-${user.id}`} className="flex-1 flex items-center justify-between cursor-pointer">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold">{user.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{user.email}</span>
                                  </div>
                                  <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">Pending Card</Badge>
                                </label>
                              </div>
                            ))}
                            {availableUsers.length === 0 && (
                              <div className="text-center py-8 text-muted-foreground text-xs">
                                No users without cards found.
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                        {form.formState.errors.selectedUserIds && (
                          <p className="text-xs font-medium text-destructive">Please select at least one user.</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 mb-4">
                      <div className="bg-primary/20 p-3 rounded-xl">
                        <CreditCard className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-primary/70">Generation Range</p>
                        <p className="font-mono font-bold text-foreground">{previewCards[0]?.cardNumber} <span className="text-muted-foreground px-2">→</span> {previewCards[previewCards.length - 1]?.cardNumber}</p>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[280px] w-full rounded-2xl border border-border/20">
                      <div className="p-4 space-y-2">
                        {previewCards.map((card, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] border border-border/10 rounded-xl hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black">
                                {idx + 1}
                              </div>
                              <div>
                                <p className="text-sm font-bold font-mono tracking-tight">{card.cardNumber}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black">{card.userName || "Inventory Stock"}</p>
                              </div>
                            </div>
                            <Check className="text-success w-4 h-4" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DialogFooter className="p-6 pt-0">
              <div className="flex w-full gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={step === "preview" ? () => setStep("configure") : handleClose} 
                  className="flex-1 h-12 rounded-xl font-bold hover:bg-white/5"
                >
                  {step === "preview" ? "Back to Config" : "Cancel"}
                </Button>
                <Button 
                  type="submit" 
                  className="flex-[2] h-12 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                  disabled={watchType === "Users" && (!form.getValues("selectedUserIds")?.length)}
                >
                  {step === "configure" ? "Preview Batch" : "Finalize & Issue"}
                  {step === "configure" && <ChevronRight className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};