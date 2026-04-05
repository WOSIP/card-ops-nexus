import React from "react";
import { 
  Download, 
  Calendar,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const performanceData = [
  { name: "Mon", cards: 240, activations: 180, revenue: 1200 },
  { name: "Tue", cards: 320, activations: 250, revenue: 1500 },
  { name: "Wed", cards: 450, activations: 390, revenue: 2200 },
  { name: "Thu", cards: 380, activations: 310, revenue: 1800 },
  { name: "Fri", cards: 520, activations: 480, revenue: 2800 },
  { name: "Sat", cards: 280, activations: 210, revenue: 1300 },
  { name: "Sun", cards: 190, activations: 140, revenue: 900 },
];

const projectDistribution = [
  { name: "Retail", value: 45, fill: "var(--primary)" },
  { name: "Transit", value: 30, fill: "#10b981" },
  { name: "Gov Grant", value: 15, fill: "#8b5cf6" },
  { name: "Corporate", value: 10, fill: "#f59e0b" },
];

export const Reporting = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Reporting & Analytics</h1>
          <p className="text-muted-foreground mt-2 text-lg">Detailed operational performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-border/40 hover:bg-white/5 h-11 px-5 rounded-xl font-bold">
            <Calendar size={18} />
            This Month
          </Button>
          <Button variant="outline" className="gap-2 border-border/40 hover:bg-white/5 h-11 px-5 rounded-xl font-bold">
            <Download size={18} />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-3 border border-border/40 shadow-2xl bg-card/40 backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-white/[0.02] p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Issuance vs Activations</CardTitle>
                <CardDescription className="text-muted-foreground/70">Daily performance tracking</CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">Real-time Data</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[450px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={performanceData}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600}} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600}} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderRadius: '16px', 
                      border: '1px solid var(--border)', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '30px', fontWeight: 600, fontSize: '12px' }} 
                  />
                  <Bar dataKey="cards" name="Cards Issued" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={45} opacity={0.8} />
                  <Line type="monotone" dataKey="activations" name="Activations" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#000'}} />
                  <Area type="monotone" dataKey="revenue" hide />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border border-border/40 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-md">
            <CardHeader className="border-b border-border/20 bg-white/[0.02] p-6">
              <CardTitle className="text-xl font-bold">Project Share</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[220px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: 600}} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-5">
                {projectDistribution.map(item => (
                  <div key={item.name} className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-foreground">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ width: `${item.value}%`, backgroundColor: item.fill }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-gradient-to-br from-primary to-indigo-800 text-white relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Activity size={180} />
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                  <Activity size={24} />
                </div>
                <p className="font-black tracking-tight text-lg">System Health</p>
              </div>
              <h3 className="text-5xl font-black tracking-tighter">99.99%</h3>
              <p className="text-white/70 font-medium mt-2">Active Uptime across all terminals</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                 Operational
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};