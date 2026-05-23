"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Plus, Filter, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { cn } from "@/lib/utils";
import type { ProjectViewMode } from "@/types/projects";

interface ProjectsHeaderProps {
  total: number;
  activeCount: number;
  viewMode: ProjectViewMode;
  search?: string;
  status?: string;
}

export function ProjectsHeader({ total, activeCount, viewMode, search, status }: ProjectsHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [createOpen, setCreateOpen] = useState(false);

  const updateParams = (updates: Partial<{ search: string; status: string; view: string }>) => {
    const params = new URLSearchParams();
    const merged = { search, status, view: viewMode, ...updates };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => updateParams({ search: value }), 350);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} total · {activeCount} active
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Project
        </Button>
        <ProjectFormModal open={createOpen} onOpenChange={setCreateOpen} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search projects..."
            className="pl-9 h-8"
            defaultValue={search ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" className="gap-2 h-8">
          <Filter className="w-3.5 h-3.5" /> Filter
        </Button>

        <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-hunter-border bg-hunter-surface p-0.5">
          <button
            onClick={() => updateParams({ view: "grid" })}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-hunter-elevated text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateParams({ view: "list" })}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "list"
                ? "bg-hunter-elevated text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
