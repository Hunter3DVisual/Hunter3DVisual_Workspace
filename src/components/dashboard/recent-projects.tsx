"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ProjectWithClient } from "@/types/projects";

const statusVariantMap: Record<string, string> = {
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

interface RecentProjectsProps {
  projects: ProjectWithClient[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Active Projects</CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
            <Link href="/dashboard/projects">
              View all <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No active projects yet.</p>
        ) : (
          projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-hunter-elevated transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-hunter-elevated border border-hunter-border flex items-center justify-center shrink-0 overflow-hidden">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-indigo-400">
                        {project.code.slice(0, 3)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-indigo-300 transition-colors">
                      {project.name}
                    </p>
                    <Badge variant={statusVariantMap[project.status] as any} className="shrink-0">
                      {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {project.client?.company ?? project.client?.name ?? "No client"}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress
                      value={project.progress}
                      className="h-1 flex-1"
                      indicatorClassName={
                        project.progress >= 90
                          ? "bg-emerald-500"
                          : project.progress >= 60
                          ? "bg-indigo-500"
                          : "bg-amber-500"
                      }
                    />
                    <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                      {project.progress}%
                    </span>
                  </div>
                </div>

                {project.deadline && (
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(project.deadline, "MMM d")}
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
