"use client";

import { useRouter, usePathname } from "next/navigation";
import { Plus, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutomationStatus } from "@/types/automation";

interface AutomationHeaderProps {
  total: number;
  activeCount: number;
  status?: AutomationStatus;
}

const STATUS_OPTIONS = [
  { label: "All Rules", value: "" },
  { label: "Active", value: AutomationStatus.ACTIVE },
  { label: "Inactive", value: AutomationStatus.INACTIVE },
];

export function AutomationHeader({ total, activeCount, status }: AutomationHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Automation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} rules · {activeCount} active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={status ?? ""}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none h-8 pl-3 pr-8 text-xs rounded-md bg-hunter-elevated border border-hunter-border text-foreground cursor-pointer focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        </div>

        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          New Automation
        </Button>
      </div>
    </div>
  );
}
