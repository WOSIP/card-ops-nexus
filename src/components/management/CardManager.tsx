import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Download, 
  Filter, 
  MoreVertical, 
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  CreditCard,
  Trash2,
  Edit,
  RefreshCw,
  Eye,
  UserPlus,
  Zap,
  Layers,
  Upload
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Card as UICard, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Card as CardType, CardStatus } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { IssueCardDialog } from "./cards/IssueCardDialog";
import { EditCardDialog } from "./cards/EditCardDialog";
import { BulkIssueCardDialog } from "./cards/BulkIssueCardDialog";
import { ImportCardsDialog } from "./cards/ImportCardsDialog";
import { useManagement } from "@/context/ManagementContext";

const initialCards: CardType[] = [
  { id: "1", cardNumber: "4532 **** **** 9012", projectId: "p1", projectName: "Global Rewards", status: "Active", userName: "Sarah Connor", issuedAt: "2024-01-15" },
  { id: "2", cardNumber: "5105 **** **** 4422", projectId: "p2", projectName: "Eco-Friendly Transit", status: "Inactive", userName: "John Doe", issuedAt: "2024-02-10" },
  { id: "3", cardNumber: "4000 **** **** 1111", projectId: "p1", projectName: "Global Rewards", status: "Pending", userName: "", issuedAt: "2024-03-05" },
  { id: "4", cardNumber: "4532 **** **** 5566", projectId: "p3", projectName: "Student Grant", status: "Blocked", userName: "Miles Dyson", issuedAt: "2023-11-20" },
  { id: "5", cardNumber: "5105 **** **** 8899", projectId: "p2", projectName: "Eco-Friendly Transit", status: "Active", userName: "T-800", issuedAt: "2024-03-12" },
  { id: "6", cardNumber: "4400 **** **** 3321", projectId: "p4", projectName: "Corporate Travel", status: "Pending", userName: "", issuedAt: "2024-03-15" },
];

export const StatusBadge = ({ status }: { status: CardStatus }) => {
  switch (status) {
    case "Active": return <Badge className="bg-success/10 text-success border-success/20 px-3 py-1 rounded-lg font-bold shadow-[0_0_15px_-5px_rgba(var(--success),0.3)]"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Active</Badge>;
    case "Inactive": return <Badge variant="secondary" className="bg-neutral-grey/10 text-neutral-grey border-neutral-grey/20 px-3 py-1 rounded-lg font-bold"><Clock className="w-3.5 h-3.5 mr-1.5" /> Inactive</Badge>;
    case "Pending": return <Badge className="bg-warning/10 text-warning border-warning/20 px-3 py-1 rounded-lg font-bold shadow-[0_0_15px_-5px_rgba(var(--warning),0.3)]"><Clock className="w-3.5 h-3.5 mr-1.5" /> Pending</Badge>;
    case "Blocked": return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 px-3 py-1 rounded-lg font-bold shadow-[0_0_15px_-5px_rgba(var(--destructive),0.3)]"><ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Blocked</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export const CardManager = () => {
  const { bulkUpdateUsersWithCards } = useManagement();
  const [cards, setCards] = useState<CardType[]>(initialCards);
  const [searchTerm, setSearchTerm] = useState("");
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isBulkIssueOpen, setIsBulkIssueOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const filteredCards = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return cards.filter(card => 
      card.cardNumber.toLowerCase().includes(term) || 
      (card.userName && card.userName.toLowerCase().includes(term)) ||
      card.projectName.toLowerCase().includes(term) ||
      card.id.toLowerCase().includes(term)
    );
  }, [cards, searchTerm]);

  const handleIssueCard = (newCard: CardType) => {
    setCards([newCard, ...cards]);
    setIsIssueOpen(false);
    toast.success(`Card ${newCard.cardNumber} issued to inventory`, {
      description: "The card is now ready to be linked to a user."
    });
  };

  const handleBulkIssue = (newCards: CardType[]) => {
    setCards([...newCards, ...cards]);
    
    const linkedUsers = newCards
      .filter(c => c.userId && c.userId !== "")
      .map(c => ({ userId: c.userId!, cardId: c.cardNumber }));
    
    if (linkedUsers.length > 0) {
      bulkUpdateUsersWithCards(linkedUsers);
    }

    setIsBulkIssueOpen(false);
    toast.success(`Batch issuance successful`, {
      description: `${newCards.length} cards have been processed and added to inventory.`
    });
  };

  const handleImportCards = (newCards: CardType[]) => {
    setCards([...newCards, ...cards]);
    setIsImportOpen(false);
  };

  const handleUpdateCard = (updatedCard: CardType) => {
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
    setIsEditOpen(false);
    toast.success(`Card updated successfully`);
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    toast.error("Card removed from inventory", {
      description: "The card record has been deleted.",
    });
  };

  const handleChangeStatus = (id: string, newStatus: CardStatus) => {
    const card = cards.find(c => c.id === id);
    if (newStatus === "Active" && (!card?.userName || card.userName.trim() === "")) {
      toast.error("Cannot activate card", {
        description: "A user must be linked to the card before activation."
      });
      return;
    }
    setCards(cards.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast.info(`Status updated to ${newStatus}`);
  };

  const handleEditClick = (card: CardType) => {
    setSelectedCard(card);
    setIsEditOpen(true);
  };

  const handleBatchAction = (action: string) => {
    if (action === "Activate") {
      let count = 0;
      setCards(cards.map(c => {
        if (c.userName && c.userName.trim() !== "") {
          count++;
          return { ...c, status: "Active" };
        }
        return c;
      }));
      toast.success(`Activated ${count} cards with linked users.`);
    } else if (action === "Block") {
      setCards(cards.map(c => ({ ...c, status: "Blocked" })));
      toast.success(`All cards have been blocked.`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Card Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Centralized inventory and issuance system.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="outline" 
            className="gap-2 border-border/40 hover:bg-white/5 h-11 px-5 rounded-xl font-bold transition-all backdrop-blur-sm hidden md:flex"
            onClick={() => toast.info("Exporting CSV...")}
          >
            <Download size={18} />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 border-border/40 hover:bg-white/5 h-11 px-5 rounded-xl font-bold transition-all backdrop-blur-sm hidden md:flex"
            onClick={() => setIsImportOpen(true)}
          >
            <Upload size={18} />
            Import
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsBulkIssueOpen(true)}
            className="gap-2 border-primary/40 text-primary hover:bg-primary/5 h-11 px-6 rounded-xl font-bold transition-all"
          >
            <Layers size={18} />
            Bulk Issue
          </Button>
          <Button 
            onClick={() => setIsIssueOpen(true)}
            className="gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            Issue Card
          </Button>
        </motion.div>
      </div>

      <UICard className="border border-border/40 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-xl rounded-2xl">
        <CardHeader className="bg-white/[0.02] pb-6 border-b border-border/10 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full md:w-[450px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4.5 h-4.5" />
              <Input 
                placeholder="Search by card, user, or project..." 
                className="pl-12 bg-white/5 border-border/40 focus:ring-2 focus:ring-primary/20 h-11 rounded-xl transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 border-border/40 hover:bg-white/5 h-10 px-4 rounded-lg font-bold">
                <Filter size={16} />
                Filters
              </Button>
              <div className="h-6 w-px bg-border/20 mx-2 shrink-0" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBatchAction("Activate")} 
                className="shrink-0 border-border/40 hover:bg-success/10 hover:text-success h-10 px-4 rounded-lg font-bold"
              >
                Activate Linked
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBatchAction("Block")} 
                className="text-warning border-border/40 hover:bg-warning/10 h-10 px-4 rounded-lg font-bold"
              >
                Block All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/10 h-16 bg-white/[0.01]">
                  <TableHead className="w-[100px] text-muted-foreground font-black px-8">ID</TableHead>
                  <TableHead className="text-muted-foreground font-black">CARD IDENTIFIER</TableHead>
                  <TableHead className="text-muted-foreground font-black">PROJECT</TableHead>
                  <TableHead className="text-muted-foreground font-black">ASSOCIATED USER</TableHead>
                  <TableHead className="text-muted-foreground font-black">CURRENT STATUS</TableHead>
                  <TableHead className="text-muted-foreground font-black">ISSUANCE DATE</TableHead>
                  <TableHead className="text-right text-muted-foreground font-black px-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredCards.map((card, index) => (
                    <motion.tr
                      key={card.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-border/10 hover:bg-white/[0.04] group transition-colors h-20"
                    >
                      <TableCell className="font-mono text-xs font-black text-muted-foreground/60 px-8">#{card.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground tracking-wider">{card.cardNumber}</span>
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Physical Card</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 border-primary/30 text-primary font-black px-2.5 py-0.5 rounded-md text-[10px] uppercase">
                          {card.projectName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {card.userName ? (
                            <>
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <span className="text-[10px] font-black text-primary">{card.userName.charAt(0)}</span>
                              </div>
                              <span className="text-foreground font-bold">{card.userName}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground/40 italic font-medium">Not Linked</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={card.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground/80 text-sm font-semibold">{card.issuedAt}</TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEditClick(card)}
                            title="Edit Card"
                          >
                            <Edit size={16} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/10">
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40 p-2 rounded-xl shadow-2xl">
                              <DropdownMenuLabel className="text-xs font-black text-muted-foreground px-2 py-1.5 uppercase tracking-widest">Manage Card</DropdownMenuLabel>
                              {!card.userName && (
                                <DropdownMenuItem 
                                  className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary flex items-center gap-2"
                                  onClick={() => handleEditClick(card)}
                                >
                                  <UserPlus className="w-4 h-4" /> Link User
                                </DropdownMenuItem>
                              )}
                              {card.userName && card.status !== "Active" && (
                                <DropdownMenuItem 
                                  className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-success/10 focus:text-success flex items-center gap-2"
                                  onClick={() => handleChangeStatus(card.id, "Active")}
                                >
                                  <Zap className="w-4 h-4" /> Activate Card
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-white/5 flex items-center gap-2"
                                onClick={() => handleEditClick(card)}
                              >
                                <Edit className="w-4 h-4" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-white/5 flex items-center gap-2"
                                onClick={() => handleChangeStatus(card.id, card.status === "Active" ? "Inactive" : "Active")}
                              >
                                <RefreshCw className="w-4 h-4" /> Toggle Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border/20 mx-1 my-1.5" />
                              <DropdownMenuItem 
                                className="cursor-pointer font-bold py-2.5 rounded-lg focus:bg-white/5 flex items-center gap-2"
                                onClick={() => toast.info(`Viewing details for ${card.id}`)}
                              >
                                <Eye className="w-4 h-4" /> Full History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border/20 mx-1 my-1.5" />
                              <DropdownMenuItem 
                                className="text-warning cursor-pointer font-bold py-2.5 rounded-lg focus:bg-warning/10 flex items-center gap-2"
                                onClick={() => handleDeleteCard(card.id)}
                              >
                                <Trash2 className="w-4 h-4" /> Delete Card
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          {filteredCards.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                <CreditCard className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-lg font-bold">No records found matching your query.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your filters or search terms.</p>
              <Button 
                variant="link" 
                className="text-primary mt-4 font-bold h-auto p-0" 
                onClick={() => setSearchTerm("")}
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </CardContent>
      </UICard>

      <IssueCardDialog 
        isOpen={isIssueOpen} 
        onClose={() => setIsIssueOpen(false)} 
        onIssue={handleIssueCard}
      />

      <BulkIssueCardDialog
        isOpen={isBulkIssueOpen}
        onClose={() => setIsBulkIssueOpen(false)}
        onBulkIssue={handleBulkIssue}
      />

      <ImportCardsDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportCards}
      />

      <EditCardDialog 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        card={selectedCard}
        onUpdate={handleUpdateCard}
      />
    </div>
  );
};