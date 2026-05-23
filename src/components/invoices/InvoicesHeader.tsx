"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InvoiceFormModal } from "@/components/invoices/InvoiceFormModal";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Viewed", value: "VIEWED" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
] as const;

interface InvoicesHeaderProps {
  total: number;
  activeStatus?: string;
}

export function InvoicesHeader({ total, activeStatus }: InvoicesHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} invoice{total !== 1 ? "s" : ""}
            {activeStatus ? ` · ${activeStatus.charAt(0) + activeStatus.slice(1).toLowerCase()}` : ""}
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-lg bg-hunter-elevated border border-hunter-border w-fit overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const isActive = (activeStatus ?? "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/dashboard/invoices?status=${tab.value}` : "/dashboard/invoices"}
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

      <InvoiceFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
