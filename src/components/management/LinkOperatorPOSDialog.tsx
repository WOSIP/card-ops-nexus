import React, { useState, useMemo, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Operator, PosTerminal } from "@/types";
import { Link, Monitor, Users, ShieldCheck, Search, XCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const linkSchema = z.object({
  targetIds: z.array(z.string()).min(1, "Please select at least one target"),
});

type LinkFormValues = z.infer<typeof linkSchema>;

interface LinkOperatorPOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: (sourceId: string, targetIds: string[]) => void;
  sourceType: "operator" | "pos";
  sourceItem: Operator | PosTerminal | null;
  availableTargets: (Operator | PosTerminal)[];
}

export const LinkOperatorPOSDialog = ({ 
  isOpen, 
  onClose, 
  onLink, 
  sourceType, 
  sourceItem, 
  availableTargets 
}: LinkOperatorPOSDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      targetIds: [],
    },
  });

  const selectedIds = form.watch("targetIds");

  // Reset form and search when dialog opens/closes
  useEffect(() => {
    if (isOpen && sourceItem) {
      let initialIds: string[] = [];
      if (sourceType === "pos") {
        initialIds = (sourceItem as PosTerminal).operatorIds || [];
      } else {
        const op = sourceItem as Operator;
        initialIds = op.posId ? [op.posId] : [];
      }
      form.reset({ targetIds: initialIds });
      setSearchQuery("");
    }
  }, [isOpen, form, sourceItem, sourceType]);

  const filteredTargets = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return availableTargets;

    return availableTargets.filter((target) => {
      const name = (target as any).name?.toLowerCase() || "";
      const id = target.id.toLowerCase();
      const serial = (target as any).serialNumber?.toLowerCase() || "";
      const email = (target as any).email?.toLowerCase() || "";
      const phone = (target as any).phone?.toLowerCase() || (target as any).phoneNumber?.toLowerCase() || "";
      
      return (
        name.includes(query) || 
        id.includes(query) || 
        serial.includes(query) || 
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [availableTargets, searchQuery]);

  if (!sourceItem) return null;

  const onSubmit = (data: LinkFormValues) => {
    onLink(sourceItem.id, data.targetIds);
    onClose();
  };

  const targetLabel = sourceType === "operator" ? "POS Terminal" : "Operator";
  const sourceLabel = sourceType === "operator" ? "Operator" : "POS Terminal";

  const toggleTarget = (id: string) => {
    const current = form.getValues("targetIds");
    if (sourceType === "operator") {
      // Single selection for operator -> POS
      form.setValue("targetIds", [id]);
    } else {
      // Multi selection for POS -> Operators
      if (current.includes(id)) {
        form.setValue("targetIds", current.filter(item => item !== id));
      } else {
        form.setValue("targetIds", [...current, id]);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-2xl border-border/40 p-0 overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center overflow-hidden border-b border-border/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 text-center space-y-1 px-6">
            <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center mx-auto border border-primary/30 backdrop-blur-md mb-2">
              <Link className="text-primary w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              Link {sourceLabel} to {targetLabel}s
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-xs">
              Establish multiple associations between personnel and hardware.
            </DialogDescription>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-border/40 flex items-center gap-4 shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  {sourceType === "operator" ? <Users size={24} /> : <Monitor size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Source {sourceLabel}</p>
                  <p className="font-bold text-foreground">{(sourceItem as any).name}</p>
                  <p className="text-xs text-muted-foreground">ID: {(sourceItem as any).serialNumber || sourceItem.id}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Select {targetLabel}s
                  </FormLabel>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black">
                    {selectedIds.length} Selected
                  </Badge>
                </div>
                
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder={`Search ${targetLabel.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-white/5 border-border/40 rounded-xl focus-visible:ring-primary/30"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="rounded-2xl border border-border/40 bg-white/5 overflow-hidden">
                  <ScrollArea className="h-[220px]">
                    <div className="p-2 space-y-1">
                      {filteredTargets.length > 0 ? (
                        filteredTargets.map((target) => (
                          <div
                            key={target.id}
                            onClick={() => toggleTarget(target.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                              selectedIds.includes(target.id) 
                                ? "bg-primary/10 border border-primary/30" 
                                : "hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              selectedIds.includes(target.id)
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border/60"
                            }`}>
                              {selectedIds.includes(target.id) && <Check size={12} strokeWidth={4} />}
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-bold text-foreground">{(target as any).name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                                {(target as any).serialNumber || (target as any).phone || (target as any).phoneNumber || (target as any).email || `ID: ${target.id}`}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center space-y-2 opacity-50">
                          <Search className="w-8 h-8 mx-auto" />
                          <p className="text-xs font-medium">No results found</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <FormMessage />
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 transition-colors hover:bg-blue-500/10">
              <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5" />
              <p className="text-xs text-blue-200/80 leading-relaxed font-medium">
                Linkage will associate these entities for transaction logging, auditing, and real-time field reporting.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="rounded-xl font-bold h-11 px-6 hover:bg-white/5 text-muted-foreground"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-8 min-w-[140px]"
                disabled={selectedIds.length === 0}
              >
                Confirm Linkage
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};