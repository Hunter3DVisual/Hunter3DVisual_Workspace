"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DocumentStatus } from "@/types/documents";

interface DocumentsHeaderProps {
  total: number;
  filters: {
    type?: string;
    status?: string;
  };
}

const TYPE_TABS = [
  { label: "All", value: "" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Liquidation", value: "LIQUIDATION" },
  { label: "Invoice", value: "INVOICE" },
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Status", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Signed", value: "SIGNED" },
  { label: "Paid", value: "PAID" },
];

export function DocumentsHeader({ total, filters }: DocumentsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function buildHref(type?: string, status?: string) {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    const qs = params.toString();
    return qs ? `/dashboard/documents?${qs}` : "/dashboard/documents";
  }

  function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("status", val);
    else params.delete("status");
    const qs = params.toString();
    router.push(qs ? `/dashboard/documents?${qs}` : "/dashboard/documents");
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Tài liệu / Documents</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {total} document{total !== 1 ? "s" : ""}
          {filters.type ? ` · ${filters.type.charAt(0) + filters.type.slice(1).toLowerCase()}` : ""}
          {filters.status ? ` · ${filters.status.charAt(0) + filters.status.slice(1).toLowerCase()}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-hunter-elevated border border-hunter-border overflow-x-auto">
          {TYPE_TABS.map((tab) => {
            const isActive = (filters.type ?? "") === tab.value;
            return (
              <Link
                key={tab.value}
                href={buildHref(tab.value || undefined, filters.status)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-hunter-card text-foreground border border-hunter-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <select
          value={filters.status ?? ""}
          onChange={onStatusChange}
          className="h-8 rounded-md border border-hunter-border bg-hunter-elevated text-xs text-foreground px-2 pr-6 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <Button asChild size="sm" className="gap-1.5">
          <Link href="/dashboard/documents/new">
            <Plus className="w-4 h-4" />
            New Document
          </Link>
        </Button>
      </div>
    </div>
  );
}
