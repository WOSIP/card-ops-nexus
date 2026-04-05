import React, { useState } from "react";
import { 
  Truck, 
  MapPin, 
  Package, 
  ArrowRight, 
  UserPlus, 
  CheckCircle2,
  AlertCircle,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

const steps = [
  { id: 1, title: "Select Inventory", icon: Package },
  { id: 2, title: "Assign Operator", icon: MapPin },
  { id: 3, title: "Target Users", icon: UserPlus },
  { id: 4, title: "Confirm", icon: CheckCircle2 },
];

export const DeploymentManager = () => {
  const [activeStep, setActiveStep] = useState(1);

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
    else {
      toast.success("Deployment sequence started successfully!");
      setActiveStep(1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Card Deployment</h1>
          <p className="text-muted-foreground mt-1">Track and manage the distribution of cards to end-users.</p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 gap-2 border-primary/20 text-primary bg-primary/10">
          <Truck size={16} />
          <span>Active Shipments: 12</span>
        </Badge>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="flex items-center w-full max-w-4xl">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                  activeStep >= step.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted/50 text-muted-foreground"
                }`}>
                  <step.icon size={20} />
                </div>
                <span className={`absolute -bottom-7 text-xs font-bold whitespace-nowrap transition-colors ${
                  activeStep >= step.id ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-muted/30 overflow-hidden">
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeStep > step.id ? 1 : 0 }}
                    className="h-full bg-primary origin-left"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <Card className="lg:col-span-2 border border-border/50 shadow-md bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">{steps[activeStep - 1].title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {activeStep === 1 && "Select the batch of cards you want to deploy from the available inventory."}
              {activeStep === 2 && "Choose an operator or collection point for distribution."}
              {activeStep === 3 && "Specify the user group or individual beneficiaries."}
              {activeStep === 4 && "Review the deployment details before finalizing."}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col justify-center">
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 border border-border/50 rounded-xl hover:border-primary/50 cursor-pointer transition-colors group bg-muted/10">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="border-border/50 bg-muted/20">Batch #{1024 + i}</Badge>
                        <div className="w-4 h-4 rounded-full border border-primary/50 group-hover:bg-primary/20" />
                      </div>
                      <p className="font-bold text-foreground">500 Cards</p>
                      <p className="text-xs text-muted-foreground">Location: Warehouse A</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search operators by name or region..." className="pl-10 bg-muted/20 border-border/50" />
                </div>
                <div className="space-y-2">
                  <div className="p-3 border border-border/50 rounded-lg flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold">JD</div>
                      <div>
                        <p className="font-medium text-sm text-foreground">John Doe Distribution</p>
                        <p className="text-xs text-muted-foreground">Region: North East</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-muted/50">Select</Button>
                  </div>
                </div>
              </div>
            )}

            {activeStep > 2 && (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted/20 mb-4" />
                <p className="text-muted-foreground">Form details would appear here based on selected inventory/operator.</p>
              </div>
            )}
          </CardContent>
          <div className="p-6 border-t border-border/50 flex justify-between">
            <Button variant="ghost" onClick={() => activeStep > 1 && setActiveStep(activeStep - 1)} disabled={activeStep === 1} className="hover:bg-muted/50">
              Back
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/20" onClick={nextStep}>
              {activeStep === 4 ? "Finalize Deployment" : "Continue"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border border-border/50 shadow-md bg-primary text-primary-foreground overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Truck size={80} />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Deployment Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white/70 text-sm">Total Dispatched</span>
                <span className="font-bold">14,200</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white/70 text-sm">In Transit</span>
                <span className="font-bold text-amber-300">2,400</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Delivered Today</span>
                <span className="font-bold text-emerald-300">842</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};