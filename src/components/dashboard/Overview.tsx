import React from "react";
import { 
  Users, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
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
  { name: "Active", value: 450, color: "var(--primary)" },
  { name: "Inactive", value: 120, color: "var(--muted-foreground)" },
  { name: "Blocked", value: 30, color: "#f43f5e" },
  { name: "Pending", value: 200, color: "#f59e0b" },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <Card className="overflow-hidden border border-border/40 shadow-xl bg-card/50 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300">
    <CardContent className="p-7">
      <div className="flex justify-between items-start">
        <div className={`p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-inner`}>
          <Icon size={26} />
        </div>
        <Badge variant="outline" className={`flex items-center gap-1.5 border-none px-2.5 py-1 ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} font-bold text-xs`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </Badge>
      </div>
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{title}</p>
        <h3 className="text-4xl font-extrabold mt-1.5 tracking-tighter text-foreground">{value}</h3>
      </div>
    </CardContent>
    <div className={`h-1.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-30 group-hover:opacity-100 transition-opacity`} />
  </Card>
);

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Cards" 
          value="12,482" 
          icon={CreditCard} 
          trend="up" 
          trendValue="+12.4%" 
        />
        <StatCard 
          title="Active Users" 
          value="8,943" 
          icon={Users} 
          trend="up" 
          trendValue="+5.2%" 
        />
        <StatCard 
          title="Deployments" 
          value="1,205" 
          icon={CheckCircle2} 
          trend="down" 
          trendValue="-2.4%" 
        />
        <StatCard 
          title="Alerts" 
          value="432" 
          icon={AlertCircle} 
          trend="up" 
          trendValue="+1.8%" 
        />
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