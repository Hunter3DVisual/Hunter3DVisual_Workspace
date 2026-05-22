"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TasksHeaderProps {
  total: number;
  inProgressCount: number;
  search?: string;
}

export function TasksHeader({ total, inProgressCount, search }: TasksHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateParams = (updates: Partial<{ search: string }>) => {
    const params = new URLSearchParams();
    const merged = { search, ...updates };
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
          <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} total · {inProgressCount} in progress
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 h-8"
            defaultValue={search ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
        </Button>
      </div>
    </div>
  );
}
