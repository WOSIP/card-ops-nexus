import React, { useState } from "react";
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
  MoreHorizontal
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "@/types";

const mockUsers: User[] = [
  { id: "u1", name: "Alice Thompson", email: "alice.t@example.com", phone: "+1 555-0101", cardId: "4532-****-9012", status: "Active", joinedAt: "2024-01-20" },
  { id: "u2", name: "Bob Richards", email: "bob.r@example.com", phone: "+1 555-0102", cardId: "5105-****-4422", status: "Active", joinedAt: "2024-02-15" },
  { id: "u3", name: "Charlie Davis", email: "c.davis@example.com", phone: "+1 555-0103", cardId: undefined, status: "Pending", joinedAt: "2024-03-10" },
  { id: "u4", name: "Diana Prince", email: "d.prince@example.com", phone: "+1 555-0104", cardId: "4000-****-1111", status: "Active", joinedAt: "2023-12-05" },
];

export const UserManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">View and manage card beneficiaries.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <UserPlus size={18} />
          Register User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Beneficiaries", value: "8,240", icon: Users, color: "blue" },
          { label: "Active Cards", value: "6,120", icon: CreditCard, color: "emerald" },
          { label: "New This Week", value: "+142", icon: CheckCircle2, color: "purple" },
          { label: "Pending Linking", value: "324", icon: Clock, color: "amber" },
        ].map((stat, i) => (
          <Card key={i} className="border border-border/50 shadow-sm overflow-hidden bg-card hover:border-primary/30 transition-colors group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border/50 shadow-md overflow-hidden bg-card">
        <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-sm:mb-2 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search users..." 
                className="pl-10 bg-muted/20 border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Contact</TableHead>
                <TableHead className="text-muted-foreground">Linked Card</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Joined</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.filter(u => 
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((user) => (
                <TableRow key={user.id} className="border-border/50 hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border-border/50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback className="bg-muted">user.name.charAt(0)</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-sm text-foreground">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail size={12} /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone size={12} /> {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.cardId ? (
                      <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 border-primary/20 text-primary">
                        {user.cardId}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No card linked</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === "Active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-muted/50"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{user.joinedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                        <History size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};