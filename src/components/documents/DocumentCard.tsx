"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { DocumentType, DocumentStatus } from "@/types/documents";

interface DocumentCardProps {
  document: {
    id: string;
    type: DocumentType;
    contractNumber: string | null;
    status: DocumentStatus;
    totalAmount: number;
    currency: string;
    createdAt: Date;
    client: { id: string; name: string; company: string | null } | null;
    project: { id: string; name: string; code: string } | null;
  };
  index: number;
}

const TYPE_LABELS: Record<DocumentType, string> = {
  CONTRACT: "Contract",
  LIQUIDATION: "Liquidation",
  INVOICE: "Invoice",
};

const TYPE_COLORS: Record<DocumentType, string> = {
  CONTRACT: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  LIQUIDATION: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  INVOICE: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

const STATUS_LABELS: Record<DocumentStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  SIGNED: "Signed",
  PAID: "Paid",
};

const STATUS_COLORS: Record<DocumentStatus, string> = {
  DRAFT: "bg-muted/50 text-muted-foreground border-hunter-border",
  SENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SIGNED: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function DocumentCard({ document: doc, index }: DocumentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link
        href={`/dashboard/documents/${doc.id}`}
        className="block rounded-xl border border-hunter-border bg-hunter-card p-4 hover:border-indigo-500/30 hover:bg-hunter-elevated transition-all duration-150 group"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${TYPE_COLORS[doc.type]}`}>
              {TYPE_LABELS[doc.type]}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[doc.status]}`}>
              {STATUS_LABELS[doc.status]}
            </span>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{formatRelativeTime(doc.createdAt)}</span>
        </div>

        <div className="mb-2">
          <p className="text-sm font-semibold text-foreground group-hover:text-indigo-400 transition-colors truncate">
            {doc.contractNumber ?? "—"}
          </p>
        </div>

        <div className="space-y-1 mb-3">
          {doc.client && (
            <p className="text-xs text-muted-foreground truncate">
              <span className="text-muted-foreground/60">Client:</span>{" "}
              <span className="text-foreground/80">{doc.client.company ?? doc.client.name}</span>
            </p>
          )}
          {doc.project && (
            <p className="text-xs text-muted-foreground truncate">
              <span className="text-muted-foreground/60">Project:</span>{" "}
              <span className="text-foreground/80">{doc.project.name}</span>
              <span className="text-muted-foreground/50 ml-1">({doc.project.code})</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-hunter-border">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(doc.totalAmount, doc.currency)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
