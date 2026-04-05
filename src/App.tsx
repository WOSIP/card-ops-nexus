import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Overview } from "./components/dashboard/Overview";
import { CardManager } from "./components/management/CardManager";
import { ProjectManager } from "./components/management/ProjectManager";
import { DeploymentManager } from "./components/management/DeploymentManager";
import { OperatorManager } from "./components/management/OperatorManager";
import { UserManager } from "./components/management/UserManager";
import { RoleManager } from "./components/management/RoleManager";
import { Reporting } from "./components/management/Reporting";
import { POSManager } from "./components/management/POSManager";
import { Toaster } from "@/components/ui/sonner";
import { ViewType } from "./types";

function App() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");

  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const renderView = () => {
    switch (activeView) {
      case "dashboard": return <Overview />;
      case "cards": return <CardManager />;
      case "projects": return <ProjectManager />;
      case "deployment": return <DeploymentManager />;
      case "operators": return <OperatorManager />;
      case "users": return <UserManager />;
      case "roles": return <RoleManager />;
      case "reporting": return <Reporting />;
      case "pos": return <POSManager />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
        {renderView()}
      </DashboardLayout>
      <Toaster position="top-right" closeButton richColors />
    </div>
  );
}

export default App;