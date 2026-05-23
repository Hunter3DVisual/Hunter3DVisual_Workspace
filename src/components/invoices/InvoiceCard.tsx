"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceWithClient } from "@/types/finance";
import type { InvoiceStatus } from "@prisma/client";

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "text-muted-foreground border-hunter-border bg-hunter-elevated" },
  SENT: { label: "Sent", className: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  VIEWED: { label: "Viewed", className: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  PARTIAL: { label: "Partial", className: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  PAID: { label: "Paid", className: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  OVERDUE: { label: "Overdue", className: "text-red-400 border-red-500/30 bg-red-500/10" },
  CANCELLED: { label: "Cancelled", className: "text-muted-foreground/50 border-hunter-border bg-hunter-elevated" },
};

interface InvoiceCardProps {
  invoice: InvoiceWithClient;
  index?: number;
}

export function InvoiceCard({ invoice, index = 0 }: InvoiceCardProps) {
  const cfg = STATUS_CONFIG[invoice.status];
  const isPastDue =
    invoice.status !== "PAID" &&
    invoice.status !== "CANCELLED" &&
    new Date(invoice.dueDate) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link href={`/dashboard/invoices/${invoice.id}`} className="block">
        <Card glow className="group cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-foreground/40 tracking-wider">
                    {invoice.number}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] h-5 px-1.5 font-medium border", cfg.className)}
                  >
                    {cfg.label}
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-foreground group-hover:text-indigo-300 transition-colors mt-1.5 truncate">
                  {invoice.client.name}
                </p>

                {invoice.client.company && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                    <Building2 className="w-3 h-3 shrink-0" />
                    {invoice.client.company}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <p className="text-base font-mono font-bold text-foreground">
                  {formatCurrency(invoice.total, invoice.currency)}
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs mt-1 justify-end",
                    isPastDue ? "text-red-400" : "text-muted-foreground"
                  )}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
              </div>
            </div>

            {invoice.project && (
              <div className="mt-3 pt-3 border-t border-hunter-border flex items-center gap-2">
                <span className="text-[10px] font-mono text-foreground/30 tracking-widest uppercase">
                  {invoice.project.code}
                </span>
                <span className="text-xs text-muted-foreground truncate">{invoice.project.name}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
