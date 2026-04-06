import React, { useState, useRef, useMemo } from 'react';
import { 
  Upload, 
  X, 
  CheckCircle2, 
  Download, 
  Table as TableIcon, 
  Smartphone, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Search,
  ShieldCheck,
  Zap,
  Phone,
  CreditCard,
  MapPin,
  Tag,
  Info,
  AlertCircle,
  ChevronRight,
  FolderKanban,
  Database,
  Wand2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PosTerminal, POSStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useManagement } from '@/context/ManagementContext';

interface ImportPOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (terminals: PosTerminal[]) => void;
  existingSerials: string[];
}

interface ParsedPOS extends Partial<PosTerminal> {
  error?: string;
  isValid: boolean;
  warnings?: string[];
}

type ImportStep = 'upload' | 'parsing' | 'review' | 'success';

export const ImportPOSDialog = ({ isOpen, onClose, onImport, existingSerials }: ImportPOSDialogProps) => {
  const { projects } = useManagement();
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedPOS[]>([]);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'valid' | 'invalid'>('all');
  const [deploymentTag, setDeploymentTag] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Invalid file format', { description: 'Please upload a CSV file.' });
      return;
    }
    setFile(selectedFile);
    setStep('parsing');
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    setProgress(0);
    const reader = new FileReader();
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split(String.fromCharCode(10)).map(r => r.trim()).filter(row => row.length > 0);
      
      if (rows.length < 2) {
        toast.error('Empty CSV file', { description: 'The CSV file must contain headers and data.' });
        setStep('upload');
        return;
      }

      const rawHeaders = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      const headerMap: Record<string, number> = {};
      
      rawHeaders.forEach((h, i) => {
        if (h.includes('name') || h.includes('label')) headerMap['name'] = i;
        if (h.includes('serial') || h.includes('sn') || h.includes('hwid')) headerMap['serialNumber'] = i;
        if (h.includes('card') || h.includes('identity') || h.includes('token')) headerMap['cardIdentity'] = i;
        if (h.includes('phone') || h.includes('mobile') || h.includes('contact')) headerMap['phoneNumber'] = i;
        if (h.includes('location') || h.includes('addr') || h.includes('site')) headerMap['location'] = i;
        if (h.includes('status') || h.includes('state')) headerMap['status'] = i;
        if (h.includes('bull') || h.includes('id') || h.includes('iot')) headerMap['bullId'] = i;
      });

      const serialsInBatch = new Set<string>();

      const data: ParsedPOS[] = rows.slice(1).map((row, index) => {
        const values: string[] = [];
        let cur = '';
        let q = false;
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') q = !q;
          else if (char === ',' && !q) {
            values.push(cur.trim().replace(/^"|"$/g, ''));
            cur = '';
          } else {
            cur += char;
          }
        }
        values.push(cur.trim().replace(/^"|"$/g, ''));

        const errors: string[] = [];
        const warnings: string[] = [];

        const name = values[headerMap['name']] || '';
        const serial = (values[headerMap['serialNumber']] || '').toUpperCase().replace(/\r/g, '');
        const cardIdentity = values[headerMap['cardIdentity']] || '';
        const phone = (values[headerMap['phoneNumber']] || '').replace(/\s/g, '').replace(/\r/g, '');
        const location = values[headerMap['location']] || 'Central Distribution';
        const statusInput = (values[headerMap['status']] || 'Online').toLowerCase();
        const status: POSStatus = statusInput.includes('off') ? 'Offline' : statusInput.includes('main') ? 'Maintenance' : 'Online';
        const bullId = (values[headerMap['bullId']] || '').replace(/\r/g, '');

        if (!name) errors.push('Name is required');
        
        if (!serial) {
          errors.push('Serial Number is required');
        } else {
          if (existingSerials.includes(serial)) errors.push('Already registered');
          else if (serialsInBatch.has(serial)) errors.push('Duplicate in batch');
          else serialsInBatch.add(serial);
        }

        if (!cardIdentity) errors.push('Security ID missing');
        
        if (!phone) {
          warnings.push('No phone number');
        } else if (phone.length < 8) {
          warnings.push('Format warning');
        }

        return {
          id: 'imp-' + Date.now() + '-' + index,
          name: name,
          serialNumber: serial,
          cardIdentity: cardIdentity,
          phoneNumber: phone,
          location: location,
          status: status,
          lastPing: 'Just now',
          totalTransactions: 0,
          operatorIds: [],
          isValid: errors.length === 0,
          error: errors.join(', '),
          warnings: warnings,
          bullRegistration: bullId ? {
            enabled: true,
            bullId: bullId,
            firmwareVersion: 'v1.0.0',
            protocol: 'MQTT',
            environment: 'Production',
            heartbeatInterval: 60
          } : undefined
        };
      });

      setTimeout(() => {
        setParsedData(data);
        setStep('review');
      }, 1200);
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    const project = selectedProjectId !== 'none' ? projects.find(p => p.id === selectedProjectId) : null;

    const validTerminals = parsedData.filter(c => c.isValid).map(c => {
      const { isValid, error, warnings, ...posData } = c;
      return {
        ...posData,
        location: deploymentTag ? posData.location + ' [' + deploymentTag + ']' : posData.location,
        projectId: project?.id,
        projectName: project?.name
      } as PosTerminal;
    });
    
    if (validTerminals.length === 0) {
      toast.error('No valid terminals to import');
      return;
    }

    onImport(validTerminals);
    setStep('success');
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setStep('upload');
    setProgress(0);
    setReviewSearch('');
    setFilterMode('all');
    setDeploymentTag('');
    setSelectedProjectId('none');
  };

  const downloadTemplate = () => {
    const headers = 'Name,SerialNumber,CardIdentity,PhoneNumber,Location,Status,BullID';
    const example = 'Terminal Alpha,SN-99421,5105 8421 7732 9042,+251911222333,Addis Mall,Online,BULL-001';
    const blob = new Blob([headers + String.fromCharCode(10) + example], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pos_import_template.csv';
    a.click();
    toast.success('Template downloaded successfully');
  };

  const removeRow = (id: string) => {
    setParsedData(prev => prev.filter(d => d.id !== id));
  };

  const stats = useMemo(() => ({
    total: parsedData.length,
    valid: parsedData.filter(d => d.isValid).length,
    invalid: parsedData.filter(d => !d.isValid).length,
    warnings: parsedData.filter(d => d.warnings && d.warnings.length > 0).length
  }), [parsedData]);

  const filteredReviewData = useMemo(() => {
    let data = parsedData;
    if (filterMode === 'valid') data = data.filter(d => d.isValid);
    if (filterMode === 'invalid') data = data.filter(d => !d.isValid);
    
    const term = reviewSearch.toLowerCase().trim();
    if (term) {
      data = data.filter(d => 
        (d.name && d.name.toLowerCase().includes(term)) || 
        (d.serialNumber && d.serialNumber.toLowerCase().includes(term)) ||
        (d.cardIdentity && d.cardIdentity.toLowerCase().includes(term))
      );
    }
    return data;
  }, [parsedData, filterMode, reviewSearch]);

  const variants: any = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col p-0 overflow-hidden bg-card/60 backdrop-blur-3xl border-border/40 rounded-[2.5rem] shadow-2xl shadow-black/50">
        <DialogHeader className="relative p-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent z-0" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner group">
                <Smartphone size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <DialogTitle className="text-4xl font-black text-foreground tracking-tight">Bulk Terminal Sync</DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1 text-lg font-medium flex items-center gap-2">
                  Network Infrastructure Management 
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">v2.5 Engine</Badge>
                </DialogDescription>
              </div>
            </div>

            {step === 'upload' && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadTemplate}
                className="flex items-center gap-3 h-12 px-6 rounded-xl font-bold bg-white/5 border border-border/40 hover:bg-white/10 hover:border-primary/30 transition-all text-foreground shadow-lg"
              >
                <Download size={18} className="text-primary" />
                Download Template
              </motion.button>
            )}
          </div>
          <div className="h-1.5 w-full bg-border/20">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ 
                width: step === 'upload' ? "25%" : step === 'parsing' ? "50%" : step === 'review' ? "75%" : "100%" 
              }}
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div 
                key="upload" 
                variants={variants} 
                initial="hidden" 
                animate="visible" 
                exit="exit" 
                className="p-10 flex flex-col items-center justify-center h-full space-y-8"
              >
                <div className="w-full max-w-4xl relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                   <div 
                    onClick={() => fileInputRef.current?.click()} 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} 
                    onDragLeave={() => setIsDragging(false)} 
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
                    className={cn(
                      'relative w-full border-4 border-dashed rounded-[3rem] p-20 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden',
                      isDragging 
                        ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/10' 
                        : 'border-border/40 hover:border-primary/40 hover:bg-primary/5'
                    )}
                  >
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleFileChange} 
                      ref={fileInputRef} 
                      className="hidden" 
                    />
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 shadow-inner">
                        <Upload className="w-12 h-12 text-primary" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-4xl font-black text-foreground mb-4 tracking-tight">Ready to Process Manifest</h3>
                      <p className="text-muted-foreground text-xl max-w-md font-medium leading-relaxed">
                        Drag and drop your terminal CSV manifest here to begin the validation sequence.
                      </p>
                      
                      <div className="mt-12 flex flex-wrap justify-center gap-4">
                        {[ 
                          { icon: TableIcon, label: 'CSV' },
                          { icon: ShieldCheck, label: 'Encrypted' },
                          { icon: Database, label: 'Bulk Load' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 px-5 py-2.5 bg-card/50 border border-border/40 rounded-2xl text-xs font-black uppercase tracking-widest text-foreground shadow-sm">
                            <item.icon size={14} className="text-primary" /> {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-4xl p-8 rounded-3xl bg-card/30 border border-border/40 shadow-inner">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Validation Blueprint</h4>
                   </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { label: 'Asset Name', desc: 'Hardware Label', req: true },
                      { label: 'Serial Key', desc: 'Hardware UID', req: true },
                      { label: 'Card ID', desc: 'Security Token', req: true },
                      { label: 'IoT Bull ID', desc: 'Platform Integration', req: false }
                    ].map((field, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-foreground tracking-tight">{field.label}</span>
                          {field.req && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{field.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'parsing' && (
              <motion.div key="parsing" variants={variants} initial="hidden" animate="visible" exit="exit" className="p-20 flex flex-col items-center justify-center h-full space-y-12 text-center">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-40 h-40 border-[10px] border-primary/10 border-t-primary rounded-full shadow-[0_0_50px_rgba(var(--primary),0.15)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-primary">{progress}%</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Validating</span>
                     </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-5xl font-black text-foreground tracking-tight">Sequencing Data Points</h3>
                  <p className="text-muted-foreground text-xl font-medium max-w-md mx-auto">
                    Running integrity checks on security tokens and identifying hardware duplicates.
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-md">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                      <span>Initialization</span>
                      <span>Finalizing</span>
                   </div>
                   <Progress value={progress} className="h-4 bg-primary/10 border border-primary/5 shadow-inner" />
                </div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div key="review" variants={variants} initial="hidden" animate="visible" className="flex flex-col h-full">
                <div className="p-8 border-b border-border/20 space-y-8 bg-card/30 backdrop-blur-xl">
                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Manifest', value: stats.total, icon: TableIcon, color: 'primary', desc: 'Items loaded' },
                        { label: 'System Ready', value: stats.valid, icon: ShieldCheck, color: 'success', desc: 'No errors' },
                        { label: 'Validation Fail', value: stats.invalid, icon: AlertTriangle, color: 'destructive', desc: 'Requires fix' },
                        { label: 'Minor Issues', value: stats.warnings, icon: Zap, color: 'warning', desc: 'Check data' }
                      ].map((s, i) => (
                        <div key={i} className="p-6 bg-card/50 rounded-[2rem] border border-border/40 shadow-inner relative overflow-hidden group">
                          <div className={cn("absolute -right-4 -top-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-125", 
                            s.color === 'primary' ? 'text-primary' : s.color === 'success' ? 'text-success' : s.color === 'warning' ? 'text-warning' : 'text-destructive'
                          )}>
                            <s.icon size={100} />
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={cn("p-2 rounded-xl border shadow-inner", 
                              s.color === 'primary' ? 'bg-primary/10 text-primary border-primary/20' : 
                              s.color === 'success' ? 'bg-success/10 text-success border-success/20' : 
                              s.color === 'warning' ? 'bg-warning/10 text-warning border-warning/20' : 
                              'bg-destructive/10 text-destructive border-destructive/20'
                            )}>
                              <s.icon size={16} />
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-black text-foreground tracking-tighter">{s.value}</p>
                            <span className="text-[10px] font-bold text-muted-foreground">{s.desc}</span>
                          </div>
                        </div>
                      ))}
                   </div>

                   <div className="flex flex-col lg:flex-row items-center gap-6 p-6 rounded-[2rem] bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-4 flex-1">
                         <div className="p-3 rounded-2xl bg-primary/20 text-primary shadow-inner">
                           <Wand2 size={24} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-sm font-black text-foreground tracking-tight">Auto-Configuration & Project Mapping</p>
                            <p className="text-xs text-muted-foreground font-medium">Define common metadata and organizational ownership for this batch.</p>
                         </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="flex flex-col gap-1.5 w-full md:w-64">
                           <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Project Owner</Label>
                           <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                             <SelectTrigger className="h-12 rounded-xl bg-card border-border/40 font-bold focus:ring-primary/20">
                               <div className="flex items-center gap-2">
                                  <FolderKanban size={14} className="text-primary" />
                                  <SelectValue placeholder="Assign to Project" />
                               </div>
                             </SelectTrigger>
                             <SelectContent className="bg-card/95 backdrop-blur-2xl border-border/40">
                               <SelectItem value="none" className="font-bold">No Project Assignment</SelectItem>
                               {projects.map(p => (
                                 <SelectItem key={p.id} value={p.id} className="font-bold">
                                   {p.name}
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 w-full md:w-64">
                           <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Environment Tag</Label>
                           <div className="relative">
                             <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                             <Input 
                               placeholder="e.g. BATCH-A-2024" 
                               value={deploymentTag}
                               onChange={(e) => setDeploymentTag(e.target.value)}
                               className="pl-10 h-12 rounded-xl bg-card border-border/40 font-bold focus-visible:ring-primary/20 shadow-sm"
                             />
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col md:flex-row items-center gap-4">
                     <div className="relative flex-1 group w-full">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <Input 
                         placeholder="Search review data..." 
                         value={reviewSearch} 
                         onChange={(e) => setReviewSearch(e.target.value)} 
                         className="pl-12 h-14 bg-card border-border/40 rounded-2xl focus-visible:ring-primary/20 text-lg font-medium shadow-inner" 
                       />
                     </div>
                     <div className="flex items-center gap-1.5 p-1.5 bg-card border border-border/40 rounded-2xl shadow-sm">
                        {['all', 'valid', 'invalid'].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setFilterMode(mode as any)}
                            className={cn(
                              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              filterMode === mode 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                          >
                            {mode}
                          </button>
                        ))}
                     </div>
                   </div>
                </div>

                <div className="flex-1 overflow-hidden bg-card/10 backdrop-blur-md">
                  <ScrollArea className="h-full">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card/90 backdrop-blur-xl z-20 shadow-xl shadow-black/5">
                        <TableRow className="border-border/20">
                          <TableHead className="pl-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground h-14">Infrastructure Device</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity & IoT</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Context</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Connectivity</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Validation</TableHead>
                          <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Remove</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReviewData.map((row) => (
                          <TableRow key={row.id} className={cn("border-border/10 transition-colors", !row.isValid && "bg-destructive/[0.03] hover:bg-destructive/[0.05]")}>
                            <TableCell className="pl-10 py-5">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "p-3 rounded-xl border shadow-inner transition-transform group-hover:scale-105",
                                  row.isValid ? "bg-card border-border/40 text-foreground" : "bg-destructive/10 border-destructive/20 text-destructive"
                                )}>
                                  <Smartphone size={18} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-black text-foreground text-sm tracking-tight leading-none mb-1">{row.name}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[9px] text-muted-foreground font-black tracking-widest">{row.serialNumber}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <CreditCard size={12} className="text-primary" />
                                  <span className="font-mono text-xs font-bold tracking-tight text-foreground">{row.cardIdentity}</span>
                                </div>
                                {row.bullRegistration && (
                                  <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    IOT: {row.bullRegistration.bullId}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                <MapPin size={14} className="text-primary" />
                                {row.location}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                <Phone size={14} className="text-success" />
                                {row.phoneNumber}
                              </div>
                            </TableCell>
                            <TableCell>
                               {row.isValid ? (
                                 <div className="flex flex-col gap-1">
                                   <Badge className="bg-success/10 text-success border-success/30 font-black text-[9px] tracking-widest px-2.5 py-1 rounded-lg w-fit">SYSTEM READY</Badge>
                                   {row.warnings && row.warnings.length > 0 && (
                                     <div className="text-[9px] font-bold text-warning flex items-center gap-1 mt-0.5">
                                       <AlertCircle size={10} /> {row.warnings.length} warning(s)
                                     </div>
                                   )}
                                 </div>
                               ) : (
                                 <TooltipProvider>
                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Badge className="bg-destructive/10 text-destructive border-destructive/30 font-black text-[9px] tracking-widest px-2.5 py-1 rounded-lg w-fit cursor-help animate-pulse shadow-lg shadow-destructive/10">
                                         VALIDATION ERROR
                                       </Badge>
                                     </TooltipTrigger>
                                     <TooltipContent className="bg-card/95 border-border/40 p-4 rounded-2xl shadow-2xl max-w-xs">
                                       <div className="space-y-2">
                                          <p className="text-xs font-black text-destructive flex items-center gap-2 uppercase tracking-widest">
                                            <AlertCircle size={14} /> Critical Blocking Error
                                          </p>
                                          <p className="text-sm font-medium text-foreground">{row.error}</p>
                                          <p className="text-[10px] text-muted-foreground leading-relaxed italic">These fields must be corrected in the CSV or removed before the batch can be synchronized.</p>
                                       </div>
                                     </TooltipContent>
                                   </Tooltip>
                                 </TooltipProvider>
                               )}
                            </TableCell>
                            <TableCell className="text-right pr-10">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 onClick={() => removeRow(row.id!)}
                                 className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground/60 transition-all"
                               >
                                 <Trash2 size={16} />
                               </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success" 
                variants={variants} 
                initial="hidden" 
                animate="visible" 
                exit="exit" 
                className="p-20 flex flex-col items-center justify-center h-full text-center"
              >
                <div className="relative mb-12">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                    className="w-36 h-36 rounded-[3rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_80px_rgba(var(--primary),0.2)]"
                  >
                    <CheckCircle2 size={80} className="text-primary" strokeWidth={2.5} />
                  </motion.div>
                  
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1], 
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] -z-10"
                  />
                </div>
                
                <h3 className="text-6xl font-black text-foreground mb-4 tracking-tighter">Network Synchronized</h3>
                <p className="text-muted-foreground text-2xl mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                   Infrastructure integration complete. <span className="text-primary font-bold">{stats.valid}</span> hardware nodes are now visible in the fleet console.
                </p>

                <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mb-16">
                   {[
                     { label: 'Asset Count', value: stats.valid, icon: Smartphone, color: 'primary' },
                     { label: 'Assignment', value: selectedProjectId !== 'none' ? projects.find(p => p.id === selectedProjectId)?.name : 'Individual', icon: FolderKanban, color: 'success' },
                     { label: 'Security', value: 'Active', icon: ShieldCheck, color: 'warning' }
                   ].map((s, i) => (
                     <div key={i} className="p-8 bg-card/40 rounded-[2.5rem] border border-border/40 shadow-inner relative overflow-hidden group">
                        <div className={cn("p-3 rounded-2xl w-fit mb-4 border shadow-sm", 
                          s.color === 'primary' ? "bg-primary/10 text-primary border-primary/20" : 
                          s.color === 'success' ? "bg-success/10 text-success border-success/20" : 
                          "bg-warning/10 text-warning border-warning/20")}>
                          <s.icon size={20} />
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1.5">{s.label}</p>
                        <p className="text-xl font-black text-foreground truncate">{s.value}</p>
                     </div>
                   ))}
                </div>

                <div className="flex gap-6">
                  <Button 
                    variant="outline" 
                    onClick={handleReset} 
                    className="h-16 px-12 rounded-[2rem] font-black text-lg border-border/40 hover:bg-muted/50 transition-all group"
                  >
                    <Upload size={20} className="mr-2 group-hover:-translate-y-1 transition-transform" />
                    Upload New Batch
                  </Button>
                  <Button 
                    onClick={onClose} 
                    className="h-16 px-14 rounded-[2rem] font-black text-lg bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
                  >
                    View Infrastructure
                    <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="p-8 border-t border-border/20 bg-card/30 backdrop-blur-xl">
          {step === 'review' && (
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                onClick={handleReset}
                className="h-14 px-8 rounded-2xl font-black text-muted-foreground hover:text-foreground uppercase tracking-widest text-xs"
              >
                Abort Integration
              </Button>
              <div className="flex items-center gap-4">
                {stats.invalid > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setParsedData(prev => prev.filter(d => d.isValid))}
                    className="h-14 px-8 rounded-2xl font-black border-destructive/30 text-destructive hover:bg-destructive/5 uppercase tracking-widest text-xs group"
                  >
                    <Trash2 size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                    Discard Errors ({stats.invalid})
                  </Button>
                )}
                <Button 
                  onClick={handleImport} 
                  disabled={stats.valid === 0} 
                  className="h-14 px-12 rounded-2xl font-black text-lg bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  Deploy {stats.valid} Terminals <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          )}
          {step === 'upload' && (
            <div className="flex justify-between items-center w-full">
               <div className="flex items-center gap-3 text-muted-foreground font-bold text-sm bg-muted/30 px-6 py-3 rounded-full border border-border/40">
                 <ShieldCheck size={16} className="text-success animate-pulse" /> 
                 Network Infrastructure Gateway Security Active
               </div>
               <Button 
                variant="ghost" 
                onClick={onClose} 
                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-muted"
               >
                Terminate Portal
               </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};