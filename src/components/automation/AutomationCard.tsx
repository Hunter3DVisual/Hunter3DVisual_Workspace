"use client";

import { useState, useTransition, type ElementType } from "react";
import { motion } from "framer-motion";
import {
  FolderPlus,
  RefreshCw,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  FileCheck,
  UserPlus,
  Clock,
  Mail,
  ListPlus,
  Bell,
  Globe,
  ArrowRight,
  Play,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Automation } from "@/types/automation";
import { TriggerType, ActionType } from "@/types/automation";
import { toggleAutomation, runAutomation } from "@/actions/automation";

const TRIGGER_CONFIG: Record<TriggerType, { label: string; icon: ElementType }> = {
  [TriggerType.PROJECT_CREATED]: { label: "Project Created", icon: FolderPlus },
  [TriggerType.PROJECT_STATUS_CHANGED]: { label: "Status Changed", icon: RefreshCw },
  [TriggerType.TASK_COMPLETED]: { label: "Task Completed", icon: CheckCircle2 },
  [TriggerType.INVOICE_PAID]: { label: "Invoice Paid", icon: CreditCard },
  [TriggerType.INVOICE_OVERDUE]: { label: "Invoice Overdue", icon: AlertCircle },
  [TriggerType.QUOTE_ACCEPTED]: { label: "Quote Accepted", icon: FileCheck },
  [TriggerType.CLIENT_CREATED]: { label: "Client Created", icon: UserPlus },
  [TriggerType.DEADLINE_APPROACHING]: { label: "Deadline Near", icon: Clock },
};

const ACTION_CONFIG: Record<ActionType, { label: string; icon: ElementType }> = {
  [ActionType.SEND_EMAIL]: { label: "Send Email", icon: Mail },
  [ActionType.CREATE_TASK]: { label: "Create Task", icon: ListPlus },
  [ActionType.UPDATE_STATUS]: { label: "Update Status", icon: RefreshCw },
  [ActionType.SEND_NOTIFICATION]: { label: "Notify", icon: Bell },
  [ActionType.WEBHOOK]: { label: "Webhook", icon: Globe },
};

interface AutomationCardProps {
  automation: Automation;
  index?: number;
}

export function AutomationCard({ automation, index = 0 }: AutomationCardProps) {
  const [isActive, setIsActive] = useState(automation.isActive);
  const [lastRunAt, setLastRunAt] = useState(automation.lastRunAt);
  const [runCount, setRunCount] = useState(automation.runCount);
  const [isToggling, startToggle] = useTransition();
  const [isRunning, startRun] = useTransition();

  const trigger = TRIGGER_CONFIG[automation.trigger];
  const action = ACTION_CONFIG[automation.action];
  const TriggerIcon = trigger.icon;
  const ActionIcon = action.icon;

  const handleToggle = () => {
    startToggle(async () => {
      setIsActive((prev) => !prev);
      await toggleAutomation(automation.id);
    });
  };

  const handleRun = () => {
    startRun(async () => {
      await runAutomation(automation.id);
      setLastRunAt(new Date());
      setRunCount((prev) => prev + 1);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card
        className={cn(
          "border transition-colors hover:border-hunter-border-bright",
          isActive ? "border-hunter-border" : "border-hunter-border opacity-60"
        )}
      >
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                    isActive ? "bg-emerald-400" : "bg-muted-foreground/30"
                  )}
                />
                <p className="text-sm font-semibold text-foreground truncate">{automation.name}</p>
              </div>
              {automation.description && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-1 pl-3.5">
                  {automation.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRun}
                disabled={isRunning || !isActive}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </Button>

              <button
                onClick={handleToggle}
                disabled={isToggling}
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none shrink-0",
                  isActive ? "bg-indigo-500" : "bg-hunter-elevated border border-hunter-border"
                )}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                  animate={{ x: isActive ? 16 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/15">
              <TriggerIcon className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="text-[11px] font-medium text-indigo-300">{trigger.label}</span>
            </div>

            <ArrowRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/15">
              <ActionIcon className="w-3 h-3 text-violet-400 shrink-0" />
              <span className="text-[11px] font-medium text-violet-300">{action.label}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-hunter-border">
            <span className="text-[10px] text-muted-foreground font-mono">{runCount} runs</span>
            {lastRunAt ? (
              <span className="text-[10px] text-muted-foreground">
                {formatRelativeTime(lastRunAt)}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/40">Never run</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
