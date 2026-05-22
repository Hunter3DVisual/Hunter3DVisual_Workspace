"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  FolderKanban,
  CheckSquare,
  UsersRound,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const stats = [
  {
    label: "Total Revenue",
    value: formatCurrency(124500),
    change: +24.3,
    icon: DollarSign,
    color: "indigo",
    sub: "This quarter",
  },
  {
    label: "Active Projects",
    value: "12",
    change: +3,
    icon: FolderKanban,
    color: "violet",
    sub: "2 delivering soon",
  },
  {
    label: "Pending Tasks",
    value: "34",
    change: -8,
    icon: CheckSquare,
    color: "amber",
    sub: "7 due this week",
  },
  {
    label: "Team Members",
    value: "8",
    change: 0,
    icon: UsersRound,
    color: "emerald",
    sub: "3 on leave",
  },
];

const colorMap = {
  indigo: {
    icon: "bg-indigo-500/15 text-indigo-400",
    ring: "ring-indigo-500/20",
    glow: "hover:shadow-glow-sm hover:border-indigo-500/30",
  },
  violet: {
    icon: "bg-violet-500/15 text-violet-400",
    ring: "ring-violet-500/20",
    glow: "hover:border-violet-500/30",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-400",
    ring: "ring-amber-500/20",
    glow: "hover:border-amber-500/30",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400",
    ring: "ring-emerald-500/20",
    glow: "hover:border-emerald-500/30",
  },
};

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const colors = colorMap[stat.color as keyof typeof colorMap];
        const ChangeIcon =
          stat.change > 0 ? TrendingUp : stat.change < 0 ? TrendingDown : Minus;
        const changeColor =
          stat.change > 0
            ? "text-emerald-400"
            : stat.change < 0
            ? "text-red-400"
            : "text-muted-foreground";

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className={cn(
              "relative rounded-xl border border-hunter-border bg-hunter-card p-5 transition-all duration-300 cursor-default group",
              colors.glow
            )}
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center ring-1",
                  colors.icon,
                  colors.ring
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-medium", changeColor)}>
                <ChangeIcon className="w-3.5 h-3.5" />
                {stat.change !== 0 && (
                  <span>{Math.abs(stat.change)}{typeof stat.change === "number" && stat.label === "Total Revenue" ? "%" : ""}</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-foreground/80 font-medium mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
