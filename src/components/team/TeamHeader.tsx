"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ROLES = ["owner", "admin", "lead", "artist", "member"];

interface TeamHeaderProps {
  total: number;
  search?: string;
  role?: string;
}

export function TeamHeader({ total, search, role }: TeamHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateParams = (updates: Partial<{ search: string; role: string }>) => {
    const params = new URLSearchParams();
    const merged = { search, role, ...updates };
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
          <h1 className="text-2xl font-semibold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} members</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4" /> Invite
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search members..."
            className="pl-9 h-8"
            defaultValue={search ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => updateParams({ role: "" })}
            className={cn(
              "text-xs px-3 py-1.5 rounded-md border transition-colors",
              !role
                ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                : "border-hunter-border text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => updateParams({ role: r })}
              className={cn(
                "text-xs px-3 py-1.5 rounded-md border capitalize transition-colors",
                role === r
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                  : "border-hunter-border text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
