"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { DollarSign, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { FinanceStats } from "@/types/finance";

function AnimatedCounter({
  value,
  format = String,
}: {
  value: number;
  format?: (v: number) => string;
}) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => format(Math.round(v)));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
}

const colorMap = {
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
    glow: "hover:border-emerald-500/30",
    value: "text-emerald-400",
  },
  red: {
    icon: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
    glow: "hover:border-red-500/30",
    value: "text-red-400",
  },
  indigo: {
    icon: "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/20",
    glow: "hover:shadow-glow-sm hover:border-indigo-500/30",
    value: "text-indigo-400",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",
    glow: "hover:border-amber-500/30",
    value: "text-amber-300",
  },
};

interface FinanceStatsProps {
  stats: FinanceStats;
}

export function FinanceStats({ stats }: FinanceStatsProps) {
  const cards = [
    {
      label: "Total Revenue",
      value: stats.revenue,
      icon: DollarSign,
      color: "emerald" as const,
      format: (v: number) => formatCurrency(v),
      sub: "Paid invoices",
    },
    {
      label: "Expenses",
      value: stats.expenses,
      icon: TrendingDown,
      color: "red" as const,
      format: (v: number) => formatCurrency(v),
      sub: "This period",
    },
    {
      label: "Net Profit",
      value: stats.profit,
      icon: TrendingUp,
      color: "indigo" as const,
      format: (v: number) => formatCurrency(v),
      sub: "Revenue − expenses",
    },
    {
      label: "Pending",
      value: stats.pendingAmount,
      icon: Clock,
      color: "amber" as const,
      format: (v: number) => formatCurrency(v),
      sub: `${stats.pendingCount} invoice${stats.pendingCount !== 1 ? "s" : ""} outstanding`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const colors = colorMap[card.color];

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className={cn(
              "relative rounded-xl border border-hunter-border bg-hunter-card p-5 transition-all duration-300 cursor-default",
              colors.glow
            )}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.icon)}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="mt-4">
              <p className={cn("text-2xl font-bold tracking-tight font-mono", colors.value)}>
                <AnimatedCounter value={card.value} format={card.format} />
              </p>
              <p className="text-sm text-foreground/80 font-medium mt-0.5">{card.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
