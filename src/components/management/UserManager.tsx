import React, { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  CreditCard,
  History,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Filter
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import { toast } from "sonner";
import { CreateUserDialog } from "./users/CreateUserDialog";
import { EditUserDialog } from "./users/EditUserDialog";
import { motion, AnimatePresence } from "framer-motion";
import { useManagement } from "@/context/ManagementContext";

export const UserManager = () => {
  const { users, createUser, updateUser, deleteUser } = useManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === "Active").length,
    pending: users.filter(u => u.status === "Pending").length,
    linked: users.filter(u => u.cardId).length
  }), [users]);

  const handleCreateUser = (newUser: User) => {
    createUser(newUser);
    setIsCreateDialogOpen(false);
    toast.success(`User ${newUser.name} registered successfully`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    updateUser(updatedUser);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    toast.success(`User ${updatedUser.name} updated successfully`);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    deleteUser(userId);
    toast.success(`User ${userToDelete?.name} removed from system`, {
      description: "This action can be undone from the activity logs.",
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">View and manage card beneficiaries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-border/50 hover:bg-muted/50 hidden sm:flex">
            <Download size={18} />
            Export Data
          </Button>
          <Button 
            className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <UserPlus size={18} />
            Register User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Beneficiaries", value: stats.total, icon: Users, color: "primary" },
          { label: "Active Users", value: stats.active, icon: CheckCircle2, color: "success" },
          { label: "Pending Verification", value: stats.pending, icon: Clock, color: "warning" },
          { label: "Linked Cards", value: stats.linked, icon: CreditCard, color: "blue-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl bg-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : stat.color === 'warning' ? 'warning' : 'blue-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : stat.color === 'warning' ? 'warning' : 'blue-500'} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border border-border/50 shadow-md overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="bg-muted/5 pb-4 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search users by name, email or phone..." 
                className="pl-10 bg-muted/20 border-border/50 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
                <Filter size={14} />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">User</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Contact</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Linked Card</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Joined</TableHead>
                  <TableHead className="text-right text-muted-foreground font-bold text-xs uppercase tracking-wider px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={user.id} 
                        className="border-border/50 hover:bg-muted/20 group transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border-2 border-border/20 group-hover:border-primary/30 transition-colors shadow-sm">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                              <AvatarFallback className="bg-muted font-bold">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{user.name}</span>
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: {user.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                              <Mail size={12} className="text-primary/70" /> {user.email}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                              <Phone size={12} className="text-primary/70" /> {user.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.cardId ? (
                            <Badge variant="outline" className="font-mono text-[10px] bg-primary/5 border-primary/20 text-primary py-0.5 px-2">
                              {user.cardId}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground/60 italic">No card linked</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "Active" ? "default" : "secondary"} 
                            className={`font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md ${
                              user.status === "Active" 
                                ? "bg-success/15 text-success border border-success/20 shadow-sm shadow-success/5" 
                                : "bg-warning/15 text-warning border border-warning/20"
                            }`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[11px] font-medium text-muted-foreground">{user.joinedAt}</TableCell>
                        <TableCell className="text-right px-6">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all">
                              <History size={15} />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                                  <MoreHorizontal size={15} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/40 p-1.5 rounded-xl shadow-2xl">
                                <DropdownMenuItem 
                                  onClick={() => openEditDialog(user)}
                                  className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg py-2 font-bold text-xs"
                                >
                                  <Edit size={14} /> Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg py-2 font-bold text-xs">
                                  <CreditCard size={14} /> Link New Card
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border/40 my-1" />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="gap-2 focus:bg-destructive/10 focus:text-destructive text-destructive/80 cursor-pointer rounded-lg py-2 font-bold text-xs"
                                >
                                  <Trash2 size={14} /> Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="p-4 bg-muted/10 rounded-full">
                            <Users className="w-10 h-10 text-muted-foreground/40" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-bold text-muted-foreground">No users found</p>
                            <p className="text-sm text-muted-foreground/60">Try adjusting your search terms</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateUserDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onCreate={handleCreateUser}
      />
      
      <EditUserDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        onUpdate={handleUpdateUser}
        user={selectedUser}
      />
    </div>
  );
};