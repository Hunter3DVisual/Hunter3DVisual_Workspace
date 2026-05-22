"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { DashboardStats } from "@/types";

interface DashboardHeroProps {
  stats: DashboardStats;
}

export function DashboardHero({ stats }: DashboardHeroProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dueThisWeek = Math.max(0, Math.floor(stats.pendingTasks * 0.2));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden border border-hunter-border bg-hunter-card p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-64 bg-glow-indigo pointer-events-none" />
      <div className="absolute inset-0 bg-hunter-grid bg-grid opacity-40 pointer-events-none" />

      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{greeting}, Hunter</p>
          <h2 className="text-2xl font-bold text-foreground">
            Studio <span className="text-gradient-indigo">Overview</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            You have{" "}
            <span className="text-indigo-400 font-medium">
              {stats.activeProjects} active project{stats.activeProjects !== 1 ? "s" : ""}
            </span>{" "}
            and{" "}
            <span className="text-amber-400 font-medium">
              {dueThisWeek} task{dueThisWeek !== 1 ? "s" : ""}
            </span>{" "}
            due this week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {stats.revenueChange !== 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              {stats.revenueChange > 0 ? "+" : ""}
              {stats.revenueChange}% revenue vs last quarter
            </div>
          )}
          <Button size="sm" className="gap-2" asChild>
            <Link href="/dashboard/ai">
              <Sparkles className="w-3.5 h-3.5" />
              AI Briefing
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
