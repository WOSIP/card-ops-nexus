import React from "react";
import { 
  TrendingUp
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Jan", cards: 400, transactions: 240 },
  { name: "Feb", cards: 300, transactions: 139 },
  { name: "Mar", cards: 550, transactions: 980 },
  { name: "Apr", cards: 450, transactions: 390 },
  { name: "May", cards: 780, transactions: 480 },
  { name: "Jun", cards: 690, transactions: 380 },
  { name: "Jul", cards: 949, transactions: 430 },
];

const pieData = [
  { name: "Active", value: 450, color: "var(--success)" },
  { name: "Inactive", value: 120, color: "var(--neutral-grey)" },
  { name: "Blocked", value: 30, color: "var(--destructive)" },
  { name: "Pending", value: 200, color: "var(--warning)" },
];

export const Overview = () => {
  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground bg-gradient-to-br from-white to-white/60 bg-clip-text">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">Analytics and real-time operations overview.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/5">
           <Badge className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg cursor-pointer">Live</Badge>
           <Badge variant="outline" className="border-none text-muted-foreground px-4 py-1.5 rounded-lg cursor-pointer hover:bg-white/5">History</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border border-border/40 shadow-2xl bg-card/40 backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-white/[0.02] p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Performance Analytics</CardTitle>
                <CardDescription className="text-muted-foreground/70">Card issuance and transaction growth trends</CardDescription>
              </div>
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                <TrendingUp size={24} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cards" 
                    stroke="var(--primary)" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorCards)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border border-border/40 shadow-2xl bg-card/40 backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-white/[0.02] p-8">
            <CardTitle className="text-2xl font-bold">Distribution</CardTitle>
            <CardDescription className="text-muted-foreground/70">Device status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full mt-10">
              {pieData.map((item) => (
                <div key={item.name} className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-xl font-black text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};