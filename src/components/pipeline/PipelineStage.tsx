"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import type { PipelineStage } from "@/types/pipeline";
import { StageStatus } from "@/types/pipeline";

const STATUS_CONFIG: Record<
  string,
  { icon: typeof Circle; color: string; dot: string; bg: string; label: string }
> = {
  [StageStatus.PENDING]: {
    icon: Circle,
    color: "text-muted-foreground",
    dot: "bg-muted-foreground/50",
    bg: "bg-muted-foreground/10",
    label: "Pending",
  },
  [StageStatus.IN_PROGRESS]: {
    icon: Clock,
    color: "text-indigo-400",
    dot: "bg-indigo-400",
    bg: "bg-indigo-500/10",
    label: "In Progress",
  },
  [StageStatus.COMPLETED]: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Completed",
  },
  [StageStatus.BLOCKED]: {
    icon: AlertCircle,
    color: "text-red-400",
    dot: "bg-red-400",
    bg: "bg-red-500/10",
    label: "Blocked",
  },
};

const PROGRESS_BAR_COLOR: Record<string, string> = {
  [StageStatus.PENDING]: "bg-muted-foreground/30",
  [StageStatus.IN_PROGRESS]: "bg-gradient-to-r from-indigo-500 to-violet-500",
  [StageStatus.COMPLETED]: "bg-gradient-to-r from-emerald-500 to-teal-500",
  [StageStatus.BLOCKED]: "bg-gradient-to-r from-red-500 to-rose-500",
};

interface PipelineStageProps {
  stage: PipelineStage;
  index?: number;
  isLast?: boolean;
  taskCount?: number;
}

export function PipelineStageCard({
  stage,
  index = 0,
  isLast = false,
  taskCount,
}: PipelineStageProps) {
  const config = STATUS_CONFIG[stage.status] ?? STATUS_CONFIG[StageStatus.PENDING];
  const StatusIcon = config.icon;
  const barColor = PROGRESS_BAR_COLOR[stage.status] ?? PROGRESS_BAR_COLOR[StageStatus.PENDING];

  return (
    <div className="flex items-stretch gap-0">
      <motion.div
        className="w-52 shrink-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.07 }}
      >
        <Card
          className={cn(
            "h-full border border-hunter-border transition-colors hover:border-hunter-border-bright",
            stage.status === StageStatus.IN_PROGRESS && "border-indigo-500/30",
            stage.status === StageStatus.COMPLETED && "border-emerald-500/20",
            stage.status === StageStatus.BLOCKED && "border-red-500/30"
          )}
        >
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
                <p className="text-xs font-semibold text-foreground truncate">{stage.name}</p>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                  config.bg
                )}
              >
                <StatusIcon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground">{config.label}</span>
                <span className="text-[10px] font-mono text-foreground/60">{stage.progress}%</span>
              </div>
              <div className="h-1 rounded-full bg-hunter-elevated overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", barColor)}
                  initial={{ width: 0 }}
                  animate={{ width: `${stage.progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.07 + 0.2, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5 border-t border-hunter-border">
              {typeof taskCount === "number" ? (
                <span className="text-[10px] text-muted-foreground">
                  {taskCount} tasks
                </span>
              ) : (
                <span />
              )}
              {stage.completedAt ? (
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formatDate(stage.completedAt, "MMM d")}
                </span>
              ) : stage.startedAt ? (
                <span className="text-[10px] text-muted-foreground font-mono">
                  Started {formatDate(stage.startedAt, "MMM d")}
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {!isLast && (
        <div className="flex items-center px-1 shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
        </div>
      )}
    </div>
  );
}
