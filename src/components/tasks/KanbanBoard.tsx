"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { updateTaskStatus } from "@/actions/tasks";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/types/tasks";
import type { TaskStatus } from "@prisma/client";
import type { PanInfo } from "framer-motion";

const COLUMNS: { status: TaskStatus; label: string; accent: string; dot: string }[] = [
  { status: "BACKLOG", label: "Backlog", accent: "text-slate-400 border-slate-500/30 bg-slate-500/10", dot: "bg-slate-500" },
  { status: "TODO", label: "To Do", accent: "text-blue-400 border-blue-500/30 bg-blue-500/10", dot: "bg-blue-500" },
  { status: "IN_PROGRESS", label: "In Progress", accent: "text-amber-400 border-amber-500/30 bg-amber-500/10", dot: "bg-amber-400" },
  { status: "REVIEW", label: "Review", accent: "text-purple-400 border-purple-500/30 bg-purple-500/10", dot: "bg-purple-400" },
  { status: "DONE", label: "Done", accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", dot: "bg-emerald-400" },
];

interface KanbanBoardProps {
  initialTasks: TaskWithRelations[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<TaskStatus | null>(null);
  const columnRefs = useRef<Map<TaskStatus, HTMLDivElement>>(new Map());

  const getColumnAtPoint = useCallback((x: number, y: number): TaskStatus | null => {
    for (const [status, el] of columnRefs.current.entries()) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return status;
      }
    }
    return null;
  }, []);

  const handleDragEnd = useCallback(
    async (taskId: string, currentStatus: TaskStatus, info: PanInfo, snapBack: () => void) => {
      setDraggingId(null);
      setActiveColumn(null);

      const target = getColumnAtPoint(info.point.x, info.point.y);

      if (!target || target === currentStatus) {
        snapBack();
        return;
      }

      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: target } : t)));

      try {
        await updateTaskStatus(taskId, target);
      } catch {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: currentStatus } : t)));
      }
    },
    [getColumnAtPoint]
  );

  const handleDrag = useCallback(
    (info: PanInfo) => {
      const col = getColumnAtPoint(info.point.x, info.point.y);
      setActiveColumn(col);
    },
    [getColumnAtPoint]
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
      {COLUMNS.map(({ status, label, accent, dot }) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        const isActive = activeColumn === status && draggingId !== null;

        return (
          <div
            key={status}
            ref={(el) => { if (el) columnRefs.current.set(status, el); }}
            className={cn(
              "flex-shrink-0 w-64 xl:w-72 rounded-xl border transition-all duration-150",
              "bg-hunter-elevated/40 border-hunter-border flex flex-col",
              isActive && "border-indigo-500/40 bg-hunter-elevated/70"
            )}
          >
            <div className="p-3 flex items-center gap-2 border-b border-hunter-border shrink-0">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dot)} />
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", accent)}>
                {label}
              </span>
              <span className="ml-auto text-xs font-mono text-muted-foreground/40">
                {columnTasks.length}
              </span>
            </div>

            <div className="p-2 space-y-2 flex-1">
              <AnimatePresence initial={false}>
                {columnTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    onDragStart={() => setDraggingId(task.id)}
                    onDrag={handleDrag}
                    onDragEnd={(info, snapBack) =>
                      handleDragEnd(task.id, task.status, info, snapBack)
                    }
                  />
                ))}
              </AnimatePresence>

              {columnTasks.length === 0 && (
                <div className="h-16 rounded-lg border border-dashed border-hunter-border/50 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground/30">Drop here</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
