"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { cn, formatDate } from "@/lib/utils";
import type { ProjectWithClient, ProjectViewMode } from "@/types/projects";

const STATUS_VARIANT: Record<string, string> = {
  BRIEF: "brief",
  CONCEPT: "concept",
  MODELING: "modeling",
  LIGHTING: "lighting",
  RENDERING: "rendering",
  POST: "post",
  REVIEW: "review",
  DELIVERED: "delivered",
  ARCHIVED: "archived",
};

const STATUS_GRADIENT: Record<string, string> = {
  BRIEF: "from-slate-500/10",
  CONCEPT: "from-violet-500/10",
  MODELING: "from-blue-500/10",
  LIGHTING: "from-amber-500/10",
  RENDERING: "from-orange-500/10",
  POST: "from-pink-500/10",
  REVIEW: "from-purple-500/10",
  DELIVERED: "from-emerald-500/10",
  ARCHIVED: "from-gray-500/10",
};

interface ProjectCardProps {
  project: ProjectWithClient;
  index?: number;
  viewMode?: ProjectViewMode;
}

export function ProjectCard({ project, index = 0, viewMode = "grid" }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const statusLabel = project.status.charAt(0) + project.status.slice(1).toLowerCase();
  const gradient = STATUS_GRADIENT[project.status] ?? "from-indigo-500/10";

  if (viewMode === "list") {
    return (
      <>
        <motion.div
          className="relative group/card"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
        >
          <Link href={`/dashboard/projects/${project.id}`}>
            <Card glow className="cursor-pointer pr-12">
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br via-transparent to-transparent flex items-center justify-center shrink-0",
                    gradient
                  )}
                >
                  <span className="text-xs font-bold font-mono text-foreground/30 group-hover/card:text-foreground/50 transition-colors">
                    {project.code.slice(0, 3)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover/card:text-indigo-300 transition-colors truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {project.client?.name ?? "No client"}
                  </p>
                </div>

                <div className="w-28 hidden sm:block shrink-0">
                  <div className="flex justify-end text-xs text-muted-foreground mb-1">
                    <span className="font-mono">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1" />
                </div>

                <Badge variant={STATUS_VARIANT[project.status] as any} className="text-[10px] shrink-0">
                  {statusLabel}
                </Badge>

                {project.deadline && (
                  <div className="text-xs text-muted-foreground items-center gap-1 shrink-0 hidden md:flex">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.deadline)}
                  </div>
                )}

                <span className="text-xs font-mono text-muted-foreground/40 shrink-0 hidden lg:block">
                  {project.code}
                </span>
              </CardContent>
            </Card>
          </Link>

          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-md bg-hunter-elevated border border-hunter-border flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:border-hunter-border-bright"
            onClick={() => setEditOpen(true)}
            title="Edit project"
          >
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </motion.div>

        <ProjectFormModal open={editOpen} onOpenChange={setEditOpen} project={project} />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="relative group/card h-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
      >
        <Link href={`/dashboard/projects/${project.id}`} className="block h-full">
          <Card glow className="cursor-pointer h-full flex flex-col">
            <div
              className={cn(
                "h-36 rounded-t-xl bg-gradient-to-br via-transparent to-transparent border-b border-hunter-border flex items-center justify-center overflow-hidden shrink-0",
                gradient
              )}
            >
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold font-mono text-foreground/10 group-hover/card:text-foreground/20 transition-colors">
                  {project.code.slice(0, 3)}
                </span>
              )}
            </div>

            <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover/card:text-indigo-300 transition-colors leading-snug">
                    {project.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                    <User2 className="w-3 h-3 shrink-0" />
                    {project.client?.name ?? "No client"}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[project.status] as any} className="shrink-0 text-[10px]">
                  {statusLabel}
                </Badge>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span className="font-mono">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1" />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-hunter-border mt-auto">
                <span className="font-mono text-foreground/40">{project.code}</span>
                {project.deadline ? (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.deadline, "MMM d, yyyy")}
                  </span>
                ) : (
                  <span>No deadline</span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <button
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-md bg-hunter-elevated/90 border border-hunter-border flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:border-hunter-border-bright backdrop-blur-sm"
          onClick={() => setEditOpen(true)}
          title="Edit project"
        >
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </motion.div>

      <ProjectFormModal open={editOpen} onOpenChange={setEditOpen} project={project} />
    </>
  );
}
