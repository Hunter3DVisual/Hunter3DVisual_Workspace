"use client";

import { motion } from "framer-motion";
import {
  FolderKanban,
  CheckSquare,
  FileText,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/lib/utils";

const activities = [
  {
    id: "1",
    type: "project",
    icon: FolderKanban,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    title: "Villa Lumina moved to Rendering",
    time: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "2",
    type: "task",
    icon: CheckSquare,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Camera setup task completed",
    time: new Date(Date.now() - 1000 * 60 * 55),
  },
  {
    id: "3",
    type: "invoice",
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Invoice #INV-0042 paid — $8,500",
    time: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "4",
    type: "team",
    icon: UserPlus,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    title: "New team member: Tran Minh added",
    time: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: "5",
    type: "ai",
    icon: Sparkles,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "AI generated quote for Skyline Tower",
    time: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[260px]">
          <div className="px-6 pb-4 space-y-1">
            {activities.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 py-2.5 border-b border-hunter-border/50 last:border-0"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground/90 leading-snug">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatRelativeTime(item.time)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
