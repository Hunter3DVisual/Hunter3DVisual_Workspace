"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHero() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden border border-hunter-border bg-hunter-card p-6"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-64 bg-glow-indigo pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-hunter-grid bg-grid opacity-40 pointer-events-none" />

      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{greeting}, Hunter</p>
          <h2 className="text-2xl font-bold text-foreground">
            Studio <span className="text-gradient-indigo">Overview</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            You have <span className="text-indigo-400 font-medium">3 active projects</span> and{" "}
            <span className="text-amber-400 font-medium">7 tasks</span> due this week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            +24% revenue vs last month
          </div>
          <Button size="sm" className="gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Briefing
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
