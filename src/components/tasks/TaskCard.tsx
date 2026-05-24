"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Calendar, AlertCircle, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { TaskFormModal } from "./TaskFormModal";
import type { TaskWithRelations } from "@/types/tasks";
import type { PanInfo } from "framer-motion";

const PRIORITY_CONFIG = {
  LOW: { label: "Low", className: "bg-slate-500/20 text-slate-400" },
  MEDIUM: { label: "Med", className: "bg-blue-500/20 text-blue-400" },
  HIGH: { label: "High", className: "bg-amber-500/20 text-amber-400" },
  URGENT: { label: "Urgent", className: "bg-red-500/20 text-red-400" },
};

interface TaskCardProps {
  task: TaskWithRelations;
  index?: number;
  onDragStart: () => void;
  onDrag: (info: PanInfo) => void;
  onDragEnd: (info: PanInfo, snapBack: () => void) => void;
  onUpdated?: () => void;
}

export function TaskCard({
  task,
  index = 0,
  onDragStart,
  onDrag,
  onDragEnd,
  onUpdated,
}: TaskCardProps) {
  const controls = useAnimation();
  const [editOpen, setEditOpen] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority];
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  const snapBack = () =>
    controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } });

  return (
    <>
      <motion.div
        animate={controls}
        initial={{ opacity: 0, y: 8 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, delay: index * 0.04 }}
        drag
        dragMomentum={false}
        dragElastic={0.08}
        whileDrag={{
          scale: 1.04,
          boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
          zIndex: 50,
          cursor: "grabbing",
        }}
        onDragStart={onDragStart}
        onDrag={(_, info) => onDrag(info)}
        onDragEnd={(_, info) => onDragEnd(info, snapBack)}
        className={cn(
          "group rounded-lg border border-hunter-border bg-hunter-surface p-3 space-y-2.5",
          "cursor-grab select-none hover:border-indigo-500/30 transition-colors active:cursor-grabbing"
        )}
      >
        <div className="flex items-start justify-between gap-1">
          {task.project ? (
            <span className="inline-block text-[10px] font-mono text-muted-foreground/50 bg-hunter-elevated px-1.5 py-0.5 rounded border border-hunter-border">
              {task.project.code}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-muted-foreground hover:text-foreground shrink-0"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>

        <p className="text-sm font-medium text-foreground leading-snug">{task.title}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", priority.className)}
            >
              {priority.label}
            </span>

            {task.dueDate && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-[10px]",
                  isOverdue ? "text-red-400" : "text-muted-foreground/50"
                )}
              >
                {isOverdue ? (
                  <AlertCircle className="w-2.5 h-2.5" />
                ) : (
                  <Calendar className="w-2.5 h-2.5" />
                )}
                {formatDate(task.dueDate, "MMM d")}
              </span>
            )}
          </div>

          {task.assignee && (
            <Avatar className="w-5 h-5 shrink-0">
              <AvatarImage src={task.assignee.avatar ?? undefined} />
              <AvatarFallback className="text-[8px] bg-indigo-500/20 text-indigo-300">
                {getInitials(task.assignee.name)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </motion.div>

      <TaskFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        task={task}
        onSuccess={onUpdated}
      />
    </>
  );
}
