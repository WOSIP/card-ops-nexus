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
import { Input } from "@/components/ui/input";
import { Operator, PosTerminal } from "@/types";
import { Link, Monitor, Users, ShieldCheck, Search, XCircle } from "lucide-react";

const linkSchema = z.object({
  targetId: z.string().min(1, "Please select a target"),
});

type LinkFormValues = z.infer<typeof linkSchema>;

interface LinkOperatorPOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: (sourceId: string, targetId: string) => void;
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
      targetId: "",
    },
  });

  const targetId = form.watch("targetId");

  // Reset form and search when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({ targetId: "" });
      setSearchQuery("");
    }
  }, [isOpen, form]);

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
    onLink(sourceItem.id, data.targetId);
    onClose();
  };

  const targetLabel = sourceType === "operator" ? "POS Terminal" : "Operator";
  const sourceLabel = sourceType === "operator" ? "Operator" : "POS Terminal";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-2xl border-border/40 p-0 overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center overflow-hidden border-b border-border/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 text-center space-y-1 px-6">
            <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center mx-auto border border-primary/30 backdrop-blur-md mb-2">
              <Link className="text-primary w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              Link {sourceLabel} to {targetLabel}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-xs">
              Establish a direct relationship between personnel and hardware.
            </DialogDescription>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-border/40 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {sourceType === "operator" ? <Users size={24} /> : <Monitor size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Source {sourceLabel}</p>
                  <p className="font-bold text-foreground">{(sourceItem as any).name}</p>
                  <p className="text-xs text-muted-foreground">ID: {(sourceItem as any).serialNumber || sourceItem.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Search and Select {targetLabel}
                </FormLabel>
                
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder="Search by ID, name, or phone..."
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

                <FormField
                  control={form.control}
                  name="targetId"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        key={searchQuery}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-white/5 border-border/40 rounded-xl">
                            <SelectValue placeholder={filteredTargets.length > 0 ? `Choose ${targetLabel.toLowerCase()}...` : `No matches found`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40 max-h-[200px]">
                          {filteredTargets.length > 0 ? (
                            filteredTargets.map((target) => (
                              <SelectItem key={target.id} value={target.id} className="font-medium cursor-pointer">
                                <div className="flex flex-col">
                                  <span>{(target as any).name}</span>
                                  <span className="text-[10px] opacity-50">
                                    {(target as any).serialNumber || (target as any).phone || (target as any).phoneNumber || (target as any).email || `ID: ${target.id}`}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="py-6 px-4 text-center space-y-2">
                              <Search className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                              <p className="text-xs text-muted-foreground font-medium">No matches found for "{searchQuery}"</p>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="pt-2 text-[10px] font-bold uppercase tracking-tight" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 transition-colors hover:bg-blue-500/10">
              <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5" />
              <p className="text-xs text-blue-200/80 leading-relaxed font-medium">
                This linkage will associate this operator with the selected {targetLabel.toLowerCase()} for all future transaction logging and deployment reporting.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="rounded-xl font-bold h-11 px-6 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-8 min-w-[140px]"
                disabled={!targetId}
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