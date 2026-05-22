"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClientStatus } from "@/types/clients";

const STATUS_FILTERS: { label: string; value: ClientStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Lead", value: "LEAD" },
  { label: "Active", value: "ACTIVE" },
  { label: "VIP", value: "VIP" },
  { label: "Inactive", value: "INACTIVE" },
];

interface ClientsHeaderProps {
  total: number;
  search?: string;
  status?: string;
}

export function ClientsHeader({ total, search, status }: ClientsHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateParams = (updates: Partial<{ search: string; status: string }>) => {
    const params = new URLSearchParams();
    const merged = { search, status, ...updates };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "ALL") params.set(k, v);
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
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} clients</p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="w-4 h-4" /> New Client
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search clients..."
            className="pl-9 h-8"
            defaultValue={search ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateParams({ status: f.value })}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                status === f.value || (!status && f.value === "ALL")
                  ? "bg-hunter-elevated text-foreground border border-hunter-border-bright"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
