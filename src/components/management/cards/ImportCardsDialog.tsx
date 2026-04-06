import React, { useState, useRef } from "react";
import { 
  Upload, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Loader2,
  Table as TableIcon
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Card as CardType, CardStatus } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ImportCardsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (cards: CardType[]) => void;
}

interface ParsedCard extends Partial<CardType> {
  error?: string;
  isValid: boolean;
}

export const ImportCardsDialog = ({ isOpen, onClose, onImport }: ImportCardsDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCard[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Invalid file format", {
          description: "Please upload a CSV file."
        });
        return;
      }
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      // Using String.fromCharCode(10) to avoid newline escaping issues in the environment
      const rows = text.split(String.fromCharCode(10)).filter(row => row.trim() !== "");
      if (rows.length < 2) {
        toast.error("Empty CSV file", {
          description: "The CSV file must contain at least a header and one data row."
        });
        setIsParsing(false);
        return;
      }

      const headers = rows[0].split(",").map(h => h.trim().toLowerCase());
      const data: ParsedCard[] = rows.slice(1).map((row, index) => {
        const values = row.split(",").map(v => v.trim());
        const card: any = {};
        
        headers.forEach((header, i) => {
          card[header] = values[i];
        });

        // Basic validation
        const errors = [];
        if (!card.cardnumber) errors.push("Missing Card Number");
        if (!card.projectid) errors.push("Missing Project ID");
        if (!card.projectname) errors.push("Missing Project Name");

        return {
          id: card.id || `imp-${Date.now()}-${index}`,
          cardNumber: card.cardnumber || "",
          projectId: card.projectid || "",
          projectName: card.projectname || "",
          status: (card.status as CardStatus) || "Pending",
          userName: card.username || "",
          issuedAt: card.issuedat || new Date().toISOString().split("T")[0],
          isValid: errors.length === 0,
          error: errors.join(", ")
        };
      });

      setParsedData(data);
      setIsParsing(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const validCards = parsedData.filter(c => c.isValid).map(c => {
      const { isValid, error, ...cardData } = c;
      return cardData as CardType;
    });

    if (validCards.length === 0) {
      toast.error("No valid cards found", {
        description: "Please correct the errors in your CSV file and try again."
      });
      return;
    }

    onImport(validCards);
    toast.success(`Successfully imported ${validCards.length} cards`);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const headers = "id,cardNumber,projectId,projectName,status,userName,issuedAt";
    const example = "imp-1,4532 0000 1111 2222,p1,Global Rewards,Active,John Doe,2024-03-20";
    const nl = String.fromCharCode(10);
    const content = headers + nl + example;
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "card_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card border-border/40 shadow-2xl rounded-2xl">
        <DialogHeader className="p-8 pb-4 border-b border-border/10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-3xl font-black tracking-tight text-foreground">Import Cards</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 font-medium">
                Upload a CSV file to bulk import cards into your inventory.
              </DialogDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadTemplate}
              className="gap-2 border-border/40 hover:bg-white/5 h-10 px-4 rounded-xl font-bold"
            >
              <Download size={16} />
              Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 pt-6">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group"
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border/40 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/40 hover:bg-primary/5 group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Click to upload or drag and drop</h3>
                  <p className="text-muted-foreground font-medium">CSV files only (max. 10MB)</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-border/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{file.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{(file.size / 1024).toFixed(1)} KB • {parsedData.length} records found</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleReset}
                    className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="rounded-2xl border border-border/20 overflow-hidden bg-white/[0.02]">
                  <div className="p-4 border-b border-border/10 bg-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Preview Data</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-xs font-bold">{parsedData.filter(d => d.isValid).length} Valid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span className="text-xs font-bold">{parsedData.filter(d => !d.isValid).length} Errors</span>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-border">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow className="border-border/10 hover:bg-transparent bg-white/[0.03]">
                          <TableHead className="text-xs font-black uppercase text-muted-foreground py-4">Card Number</TableHead>
                          <TableHead className="text-xs font-black uppercase text-muted-foreground py-4">Project</TableHead>
                          <TableHead className="text-xs font-black uppercase text-muted-foreground py-4">User</TableHead>
                          <TableHead className="text-xs font-black uppercase text-muted-foreground py-4">Status</TableHead>
                          <TableHead className="text-xs font-black uppercase text-muted-foreground py-4 text-right">Validation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isParsing ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                              <p className="text-muted-foreground font-medium">Parsing data...</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          parsedData.map((row, i) => (
                            <TableRow key={i} className="border-border/10 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-sm font-bold">{row.cardNumber || <span className="text-destructive/50 italic">Missing</span>}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm">{row.projectName || <span className="text-destructive/50 italic">Missing</span>}</span>
                                  <span className="text-[10px] text-muted-foreground font-medium uppercase">{row.projectId}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm font-medium">{row.userName || <span className="text-muted-foreground/30 italic">None</span>}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-wider">{row.status}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {row.isValid ? (
                                  <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
                                ) : (
                                  <div className="flex items-center justify-end gap-2 text-destructive">
                                    <span className="text-[10px] font-bold uppercase">{row.error}</span>
                                    <AlertCircle className="w-5 h-5" />
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="p-8 pt-4 border-t border-border/10 bg-white/[0.01]">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-12 px-8 rounded-xl font-bold hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!file || parsedData.filter(d => d.isValid).length === 0 || isParsing}
            className="h-12 px-10 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            Import {parsedData.filter(d => d.isValid).length} Records
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};