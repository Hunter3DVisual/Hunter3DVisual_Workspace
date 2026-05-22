"use client";

import Link from "next/link";
import { FolderPlus, UserPlus, FileText, Sparkles, Zap, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/projects/new",
    label: "New Project",
    icon: FolderPlus,
    color: "text-indigo-400",
    bg: "hover:bg-indigo-500/10 hover:border-indigo-500/20",
  },
  {
    href: "/clients/new",
    label: "Add Client",
    icon: UserPlus,
    color: "text-violet-400",
    bg: "hover:bg-violet-500/10 hover:border-violet-500/20",
  },
  {
    href: "/quotes/new",
    label: "New Quote",
    icon: FileText,
    color: "text-amber-400",
    bg: "hover:bg-amber-500/10 hover:border-amber-500/20",
  },
  {
    href: "/assets/upload",
    label: "Upload Asset",
    icon: Upload,
    color: "text-emerald-400",
    bg: "hover:bg-emerald-500/10 hover:border-emerald-500/20",
  },
  {
    href: "/ai",
    label: "AI Assistant",
    icon: Sparkles,
    color: "text-blue-400",
    bg: "hover:bg-blue-500/10 hover:border-blue-500/20",
  },
  {
    href: "/automation",
    label: "Automation",
    icon: Zap,
    color: "text-pink-400",
    bg: "hover:bg-pink-500/10 hover:border-pink-500/20",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border border-hunter-border transition-all duration-150 text-center group",
                  action.bg
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", action.color)} />
                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
