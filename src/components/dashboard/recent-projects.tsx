"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const projects = [
  {
    id: "1",
    code: "VLT-0A1B",
    name: "Villa Lumina — Interior CGI",
    client: "Meridian Properties",
    status: "RENDERING",
    progress: 78,
    deadline: new Date("2026-06-10"),
    thumbnail: null,
  },
  {
    id: "2",
    code: "SKY-2C3D",
    name: "Skyline Tower — Exterior",
    client: "UrbanCore Dev",
    status: "MODELING",
    progress: 42,
    deadline: new Date("2026-07-01"),
    thumbnail: null,
  },
  {
    id: "3",
    code: "MNR-4E5F",
    name: "Manor House — Full CGI",
    client: "Bespoke Estates",
    status: "POST",
    progress: 91,
    deadline: new Date("2026-05-30"),
    thumbnail: null,
  },
  {
    id: "4",
    code: "HRZ-6G7H",
    name: "Horizon Residences — Animation",
    client: "Pacific Living Group",
    status: "LIGHTING",
    progress: 55,
    deadline: new Date("2026-08-15"),
    thumbnail: null,
  },
];

const statusVariantMap: Record<string, any> = {
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

export function RecentProjects() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Active Projects</CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
            <Link href="/projects">View all <ArrowUpRight className="w-3 h-3 ml-1" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={`/projects/${project.id}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-hunter-elevated transition-colors group"
            >
              {/* Thumbnail placeholder */}
              <div className="w-12 h-12 rounded-lg bg-hunter-elevated border border-hunter-border flex items-center justify-center shrink-0 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-indigo-400">{project.code.slice(0, 3)}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </p>
                  <Badge variant={statusVariantMap[project.status]} className="shrink-0">
                    {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{project.client}</p>
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

              <div className="text-right shrink-0 hidden sm:block">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(project.deadline, "MMM d")}
                </div>
              </div>

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
        ))}
      </CardContent>
    </Card>
  );
}
