"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stages = [
  { name: "Brief", count: 2, color: "#64748b" },
  { name: "Concept", count: 1, color: "#8b5cf6" },
  { name: "Modeling", count: 3, color: "#3b82f6" },
  { name: "Lighting", count: 2, color: "#f59e0b" },
  { name: "Rendering", count: 2, color: "#f97316" },
  { name: "Post", count: 1, color: "#ec4899" },
  { name: "Review", count: 1, color: "#a855f7" },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-hunter-border bg-hunter-elevated px-3 py-2 text-xs shadow-lg">
      <span className="font-medium text-foreground">{payload[0].name}: </span>
      <span className="text-muted-foreground">{payload[0].value} projects</span>
    </div>
  );
}

export function PipelineOverview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pipeline Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stages}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={28}
                  outerRadius={42}
                  strokeWidth={0}
                >
                  {stages.map((stage, i) => (
                    <Cell key={i} fill={stage.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-1.5">
            {stages.map((stage) => (
              <div key={stage.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: stage.color }}
                  />
                  <span className="text-muted-foreground">{stage.name}</span>
                </div>
                <span className="font-medium text-foreground tabular-nums">{stage.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
