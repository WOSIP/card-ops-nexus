import React, { useState } from "react";
import { 
  LayoutDashboard, 
  CreditCard, 
  Briefcase, 
  Truck, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Monitor,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ViewType, UserRole } from "@/types";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed,
  hasSubItems,
  isExpanded,
  onToggle
}: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]" 
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:scale-[1.01]"
    }`}
  >
    <Icon size={20} className={active ? "scale-110 transition-transform" : "opacity-70"} />
    {!collapsed && (
      <>
        <span className="font-semibold whitespace-nowrap text-sm flex-1 text-left">{label}</span>
        {hasSubItems && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <ChevronDown size={14} />
          </motion.div>
        )}
      </>
    )}
  </button>
);

const SubItem = ({ 
  label, 
  active, 
  onClick, 
  collapsed 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void; 
  collapsed?: boolean;
}) => {
  if (collapsed) return null;
  return (
    <button
      onClick={onClick}
      className={`w-[calc(100%-1.5rem)] ml-6 flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
        active 
          ? "bg-primary/15 text-primary font-bold shadow-sm" 
          : "text-muted-foreground/70 hover:bg-white/5 hover:text-foreground"
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`} />
      <span className="font-semibold whitespace-nowrap text-xs">{label}</span>
    </button>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  userName?: string;
  userRole?: UserRole;
}

export const DashboardLayout = ({ 
  children, 
  activeView, 
  setActiveView,
  userName = "Alex Johnson",
  userRole = "Super Admin"
}: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["dashboard", "pos"]);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const menuItems: { id: ViewType; label: string; icon: any; subItems?: { id: ViewType; label: string }[] }[] = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      subItems: [
        { id: "projects", label: "Project Management" }
      ]
    },
    { id: "cards", label: "Card Management", icon: CreditCard },
    { id: "users", label: "User Management", icon: Users },
    { id: "deployment", label: "Card Deployment", icon: Truck },
    { 
      id: "pos", 
      label: "POS Management", 
      icon: Monitor,
      subItems: [
        { id: "operators", label: "Operator Management" }
      ]
    },
    { id: "roles", label: "Role Management", icon: ShieldCheck },
    { id: "reporting", label: "Reporting", icon: BarChart3 },
  ];

  const renderMenuItems = (items: typeof menuItems, isMobile = false) => (
    items.map((item) => {
      const isExpanded = expandedMenus.includes(item.id);
      const isParentActive = activeView === item.id;
      const isSubItemActive = item.subItems?.some(sub => activeView === sub.id);
      const isActive = isParentActive || isSubItemActive;

      return (
        <div key={item.id} className="space-y-1">
          <SidebarItem
            icon={item.icon}
            label={item.label}
            active={isActive}
            onClick={() => {
              if (item.subItems && !collapsed) {
                if (!isExpanded) toggleMenu(item.id);
              }
              setActiveView(item.id);
              if (isMobile && !item.subItems) setMobileMenuOpen(false);
            }}
            collapsed={collapsed}
            hasSubItems={!!item.subItems}
            isExpanded={isExpanded}
            onToggle={() => toggleMenu(item.id)}
          />
          
          <AnimatePresence initial={false}>
            {!collapsed && item.subItems && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden space-y-1"
              >
                {item.subItems.map(subItem => (
                  <SubItem
                    key={subItem.id}
                    label={subItem.label}
                    active={activeView === subItem.id}
                    onClick={() => {
                      setActiveView(subItem.id);
                      if (isMobile) setMobileMenuOpen(false);
                    }}
                    collapsed={collapsed}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    })
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        className="hidden md:flex flex-col bg-card/40 backdrop-blur-md border-r border-border/40 shadow-xl z-30"
      >
        <div className="p-8 flex items-center justify-between">
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-3 font-bold text-2xl tracking-tighter text-foreground"
            >
              <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/30">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">CardPortal</span>
            </motion.div>
          )}
          {collapsed && (
            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/30 mx-auto">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto scrollbar-none">
          {renderMenuItems(menuItems)}
        </nav>

        <div className="p-6 border-t border-border/40 space-y-4">
          <Button variant="ghost" className={`w-full justify-start gap-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ${collapsed ? 'px-2' : ''}`}>
            <LogOut size={20} />
            {!collapsed && <span className="font-semibold">Logout</span>}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-white/5 border-border/40 hover:bg-white/10 text-muted-foreground hover:text-foreground h-11 rounded-xl"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-80 bg-card border-r border-border/40 z-50 md:hidden"
          >
            <div className="p-8 flex items-center justify-between border-b border-border/40">
              <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter text-foreground">
                <div className="bg-primary p-1.5 rounded-lg">
                  <CreditCard className="w-6 h-6 text-primary-foreground" />
                </div>
                <span>CardPortal</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="hover:bg-white/5">
                <X size={24} />
              </Button>
            </div>
            <nav className="p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
              {renderMenuItems(menuItems, true)}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Header */}
        <header className="h-20 bg-card/30 backdrop-blur-xl border-b border-border/40 flex items-center justify-between px-6 md:px-10 z-20">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:bg-white/5"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </Button>
            <div className="relative hidden sm:block w-72 md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
              <Input 
                placeholder="Search resources, transactions..." 
                className="pl-12 bg-white/5 border-border/40 focus:bg-white/10 focus:ring-primary/20 transition-all rounded-xl h-11" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Button variant="ghost" size="icon" className="relative hover:bg-white/5 h-11 w-11 rounded-xl">
              <Bell size={22} className="text-muted-foreground" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card shadow-[0_0_12px_rgba(var(--primary),0.6)]" />
            </Button>
            <div className="flex items-center gap-4 pl-4 md:pl-6 border-l border-border/40">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">{userName}</p>
                <p className="text-xs font-medium text-muted-foreground/80">{userRole}</p>
              </div>
              <Avatar className="w-11 h-11 border-2 border-primary/20 ring-4 ring-primary/5">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} />
                <AvatarFallback className="bg-muted text-foreground font-bold">{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar scroll-smooth">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-[1600px] mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};