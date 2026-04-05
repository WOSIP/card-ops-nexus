import React from "react";
import { Key, Edit3, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const roles = [
  { 
    name: "Super Admin", 
    description: "Full system access, role management, and financial oversight.",
    users: 2,
    permissions: ["All Access", "User Management", "Finance", "System Config"],
    color: "rose"
  },
  { 
    name: "Supervisor", 
    description: "Oversee operations, link operators to terminals, and manage deployments.",
    users: 3,
    permissions: ["Project Access", "Operator-POS Linking", "Operator Management", "Reporting"],
    color: "amber"
  },
  { 
    name: "Project Manager", 
    description: "Manage specific projects, operators, and distribution workflows.",
    users: 5,
    permissions: ["Project Access", "Operator Management", "Reporting"],
    color: "blue"
  },
  { 
    name: "Support Agent", 
    description: "View user details, block/unblock cards, and resolve issues.",
    users: 12,
    permissions: ["View Users", "Card Status Controls", "Helpdesk"],
    color: "emerald"
  }
];

export const RoleManager = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Role Management</h1>
          <p className="text-muted-foreground mt-1">Configure portal permissions and administrative roles.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Key size={18} />
          Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <Card key={role.name} className="border border-border/50 shadow-md overflow-hidden relative bg-card">
            <div className={`h-1 w-full bg-${role.color}-500`} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-foreground">{role.name}</CardTitle>
                <Badge variant="outline" className="border-border/50 bg-muted/50">{role.users} Users</Badge>
              </div>
              <CardDescription className="text-muted-foreground line-clamp-2 h-10">{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Key Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map(p => (
                    <Badge key={p} variant="secondary" className="text-[10px] font-medium bg-muted/50 border-border/30">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs border-border/50 hover:bg-muted/50">
                  <Edit3 size={14} /> Edit Role
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border/50 shadow-md overflow-hidden bg-card">
        <CardHeader className="bg-muted/10 border-b border-border/50">
          <CardTitle className="text-lg text-foreground">Permission Matrix</CardTitle>
          <CardDescription className="text-muted-foreground">Detailed breakdown of what each role can perform.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[200px] text-muted-foreground">Action</TableHead>
                <TableHead className="text-center text-muted-foreground">Super Admin</TableHead>
                <TableHead className="text-center text-muted-foreground">Supervisor</TableHead>
                <TableHead className="text-center text-muted-foreground">Project Manager</TableHead>
                <TableHead className="text-center text-muted-foreground">Support Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { action: "Issue New Cards", roles: [true, true, true, false] },
                { action: "Delete Projects", roles: [true, false, false, false] },
                { action: "Manage Roles", roles: [true, false, false, false] },
                { action: "Link Operator to POS", roles: [true, true, false, false] },
                { action: "View Financial Reports", roles: [true, true, true, false] },
                { action: "Block/Unblock Cards", roles: [true, true, true, true] },
                { action: "Edit User Profiles", roles: [true, true, true, false] },
                { action: "Configure POS Terminals", roles: [true, true, false, false] },
              ].map((row, i) => (
                <TableRow key={i} className="border-border/50 hover:bg-muted/20">
                  <TableCell className="font-medium text-sm text-foreground">{row.action}</TableCell>
                  {row.roles.map((enabled, j) => (
                    <TableCell key={j} className="text-center">
                      <div className="flex justify-center">
                        {enabled ? (
                          <ShieldCheck className="text-emerald-500 w-5 h-5" />
                        ) : (
                          <ShieldAlert className="text-muted-foreground/20 w-5 h-5" />
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};