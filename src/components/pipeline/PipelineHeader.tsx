"use client";

import { useRouter, usePathname } from "next/navigation";
import { Plus, GitBranch, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  code: string;
}

interface PipelineHeaderProps {
  projects: Project[];
  total: number;
  activeStages: number;
  selectedProjectId?: string;
}

export function PipelineHeader({
  projects,
  total,
  activeStages,
  selectedProjectId,
}: PipelineHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleProjectChange = (value: string) => {
    const params = new URLSearchParams();
    if (value && value !== "all") params.set("projectId", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Production Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {total} projects · {activeStages} active stages
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={selectedProjectId ?? "all"}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="appearance-none h-8 pl-3 pr-8 text-xs rounded-md bg-hunter-elevated border border-hunter-border text-foreground cursor-pointer focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        </div>

        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Add Stage
        </Button>
      </div>
    </div>
  );
}
