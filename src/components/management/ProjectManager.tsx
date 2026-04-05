import React, { useState } from "react";
import { 
  Plus, 
  Settings, 
  Calendar, 
  CreditCard, 
  Users,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types";

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Global Rewards Program",
    description: "Multi-national reward point card system for frequent travelers.",
    status: "Active",
    totalCards: 5000,
    deployedCards: 3420,
    startDate: "2024-01-01",
    bannerUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/project-banner-1-c9c31c3f-1775420728007.webp"
  },
  {
    id: "p2",
    name: "Eco-Transit System",
    description: "Sustainable public transport payment solution using RFID cards.",
    status: "Active",
    totalCards: 10000,
    deployedCards: 8200,
    startDate: "2023-10-15",
    bannerUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "p3",
    name: "National Student Grant",
    description: "Financial aid distribution for university students across the country.",
    status: "Draft",
    totalCards: 2000,
    deployedCards: 0,
    startDate: "2024-06-01",
    bannerUrl: "https://images.unsplash.com/photo-1523050338692-7b835a07973f?w=800&auto=format&fit=crop&q=60"
  }
];

export const ProjectManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Project Management</h1>
          <p className="text-muted-foreground mt-1">Configure and monitor card distribution projects.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} />
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden group border border-border/50 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 bg-card">
            <div className="h-40 overflow-hidden relative">
              <img 
                src={project.bannerUrl} 
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <Badge className={`absolute top-4 right-4 shadow-lg ${
                project.status === "Active" ? "bg-emerald-500 text-white border-none" : "bg-amber-500 text-white border-none"
              }`}>
                {project.status}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[2.5rem] text-muted-foreground">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Deployment Progress</span>
                  <span className="font-bold text-foreground">{Math.round((project.deployedCards / project.totalCards) * 100)}%</span>
                </div>
                <Progress value={(project.deployedCards / project.totalCards) * 100} className="h-2 bg-muted/50" />
              </div>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Cards</p>
                    <p className="font-bold text-foreground">{project.totalCards.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Beneficiaries</p>
                    <p className="font-bold text-foreground">{project.deployedCards.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-4">
                <Calendar size={14} />
                <span>Started: {project.startDate}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button variant="outline" className="flex-1 gap-2 border-border/50 hover:bg-muted/50">
                <Settings size={16} />
                Settings
              </Button>
              <Button variant="secondary" className="flex-1 gap-2 bg-muted/50 hover:bg-muted">
                View All
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};