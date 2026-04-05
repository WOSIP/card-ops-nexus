import React, { useState } from "react";
import { 
  Monitor, 
  Plus, 
  MapPin, 
  Zap, 
  Wifi, 
  WifiOff, 
  Eye, 
  History,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { POSDevice, Transaction } from "@/types";

const mockPOS: POSDevice[] = [
  { 
    id: "pos1", 
    terminalId: "TID-90421", 
    location: "Central Mall - South Wing", 
    status: "Online", 
    lastPing: "Just now", 
    totalTransactions: 1242,
    imageUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/pos-device-1-02f4e19e-1775420727559.webp"
  },
  { 
    id: "pos2", 
    terminalId: "TID-88210", 
    location: "Metro Station - Line 1", 
    status: "Online", 
    lastPing: "2m ago", 
    totalTransactions: 8432,
    imageUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/pos-device-1-02f4e19e-1775420727559.webp"
  },
  { 
    id: "pos3", 
    terminalId: "TID-44122", 
    location: "Airport Arrival - T2", 
    status: "Offline", 
    lastPing: "4h ago", 
    totalTransactions: 2105,
    imageUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/pos-device-1-02f4e19e-1775420727559.webp"
  },
  { 
    id: "pos4", 
    terminalId: "TID-77231", 
    location: "University Cafeteria", 
    status: "Maintenance", 
    lastPing: "1d ago", 
    totalTransactions: 450,
    imageUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/pos-device-1-02f4e19e-1775420727559.webp"
  },
];

const mockTransactions: Transaction[] = [
  { id: "tx1", cardId: "4532-****-9012", amount: 45.00, timestamp: "2024-03-20 14:22", location: "Central Mall", status: "Success" },
  { id: "tx2", cardId: "5105-****-4422", amount: 12.50, timestamp: "2024-03-20 14:35", location: "Metro Station", status: "Success" },
  { id: "tx3", cardId: "4000-****-1111", amount: 120.00, timestamp: "2024-03-20 15:10", location: "Airport Arrival", status: "Failed" },
  { id: "tx4", cardId: "4532-****-5566", amount: 8.20, timestamp: "2024-03-20 15:45", location: "University Cafeteria", status: "Success" },
  { id: "tx5", cardId: "5105-****-8899", amount: 32.40, timestamp: "2024-03-20 16:02", location: "Central Mall", status: "Success" },
];

export const POSManager = () => {
  const [selectedPOS, setSelectedPOS] = useState<POSDevice | null>(null);
  const [isTxOpen, setIsTxOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">POS Management</h1>
          <p className="text-muted-foreground mt-1">Monitor terminal status and visualize card transaction history.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} />
          Register POS Terminal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockPOS.map((pos) => (
          <Card key={pos.id} className="overflow-hidden border border-border/50 shadow-md bg-card group">
            <div className="relative h-32 overflow-hidden bg-muted">
              <img 
                src={pos.imageUrl} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" 
                alt="POS"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              <Badge 
                className={`absolute top-3 right-3 border-none shadow-lg ${
                  pos.status === 'Online' ? 'bg-emerald-500' : pos.status === 'Offline' ? 'bg-rose-500' : 'bg-amber-500'
                }`}
              >
                {pos.status === 'Online' ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {pos.status}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-foreground">{pos.terminalId}</CardTitle>
                <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Zap size={10} className="text-amber-500" />
                  Live
                </div>
              </div>
              <CardDescription className="flex items-center gap-1.5 truncate text-muted-foreground">
                <MapPin size={12} /> {pos.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-border/50">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Trx</p>
                  <p className="text-lg font-bold text-foreground">{pos.totalTransactions.toLocaleString()}</p>
                </div>
                <div className="h-8 w-px bg-border/50 mx-2" />
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Ping</p>
                  <p className="text-sm font-medium text-foreground">{pos.lastPing}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 border-border/50 hover:bg-muted/50" onClick={() => {
                  setSelectedPOS(pos);
                  setIsTxOpen(true);
                }}>
                  <History size={14} /> History
                </Button>
                <Button variant="secondary" size="sm" className="w-10 bg-muted/50 hover:bg-muted">
                  <Eye size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border/50 shadow-md overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/10 border-b border-border/50">
          <div>
            <CardTitle>Global Transaction Stream</CardTitle>
            <CardDescription>Live feed of card activity across all POS terminals.</CardDescription>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">Live Feed</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground">Card</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Time</TableHead>
                <TableHead className="text-right text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id} className="cursor-pointer hover:bg-muted/20 border-border/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-primary" />
                      <span className="font-mono text-xs text-foreground">{tx.cardId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{tx.location}</TableCell>
                  <TableCell className="font-bold text-foreground">${tx.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{tx.timestamp}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={tx.status === 'Success' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 bg-muted/10 border-t border-border/50 flex justify-center">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50 text-muted-foreground hover:text-foreground">
              View Full Transaction Logs <ArrowRight size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isTxOpen} onOpenChange={setIsTxOpen}>
        <DialogContent className="max-w-3xl bg-card border-border/50 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Monitor className="text-primary w-5 h-5" />
              Transactions: {selectedPOS?.terminalId}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Visualization of recent transactions handled by this terminal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
             <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border border-border/50 bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Today's Volume</p>
                  <p className="text-xl font-bold text-foreground">$1,240.00</p>
                </Card>
                <Card className="p-4 border border-border/50 bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Successful</p>
                  <p className="text-xl font-bold text-emerald-400">142</p>
                </Card>
                <Card className="p-4 border border-border/50 bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Failed</p>
                  <p className="text-xl font-bold text-rose-400">3</p>
                </Card>
             </div>
             
             <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-muted-foreground">Card ID</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Time</TableHead>
                    <TableHead className="text-right text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.slice(0, 5).map((tx) => (
                    <TableRow key={tx.id} className="border-border/50">
                      <TableCell className="font-mono text-xs text-foreground">{tx.cardId}</TableCell>
                      <TableCell className="font-bold text-foreground">${tx.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{tx.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={tx.status === 'Success' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};