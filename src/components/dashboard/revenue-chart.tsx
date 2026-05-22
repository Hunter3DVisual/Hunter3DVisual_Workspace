"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const data = [
  { month: "Jan", revenue: 18000, invoiced: 22000 },
  { month: "Feb", revenue: 14500, invoiced: 16000 },
  { month: "Mar", revenue: 23000, invoiced: 25500 },
  { month: "Apr", revenue: 19000, invoiced: 21000 },
  { month: "May", revenue: 28500, invoiced: 30000 },
  { month: "Jun", revenue: 24000, invoiced: 27000 },
  { month: "Jul", revenue: 31000, invoiced: 34000 },
  { month: "Aug", revenue: 27500, invoiced: 29000 },
  { month: "Sep", revenue: 35000, invoiced: 38000 },
  { month: "Oct", revenue: 29000, invoiced: 32000 },
  { month: "Nov", revenue: 38000, invoiced: 41000 },
  { month: "Dec", revenue: 42000, invoiced: 45000 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-hunter-border bg-hunter-elevated px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium text-foreground">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Revenue Overview</CardTitle>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500/70" />
              Collected
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-500/40" />
              Invoiced
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="invoiced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1f2e" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="invoiced"
              name="invoiced"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              fill="url(#invoiced)"
              strokeDasharray="4 2"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#revenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
