import { notFound } from "next/navigation";
import Link from "next/link";
import { getInvoiceById } from "@/actions/finance";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FolderKanban,
  Hash,
  Receipt,
} from "lucide-react";
import type { InvoiceStatus } from "@prisma/client";

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  DRAFT:     { label: "Draft",     className: "text-muted-foreground border-hunter-border bg-hunter-elevated" },
  SENT:      { label: "Sent",      className: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  VIEWED:    { label: "Viewed",    className: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  PARTIAL:   { label: "Partial",   className: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  PAID:      { label: "Paid",      className: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  OVERDUE:   { label: "Overdue",   className: "text-red-400 border-red-500/30 bg-red-500/10" },
  CANCELLED: { label: "Cancelled", className: "text-muted-foreground/50 border-hunter-border bg-hunter-elevated" },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const cfg = STATUS_CONFIG[invoice.status];
  const isPastDue =
    invoice.status !== "PAID" &&
    invoice.status !== "CANCELLED" &&
    new Date(invoice.dueDate) < new Date();

  const items = (invoice.items as { description: string; quantity: number; unitPrice: number; total: number }[]) ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/invoices"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Invoices
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-sm text-muted-foreground">{invoice.number}</span>
            <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 font-medium border", cfg.className)}>
              {cfg.label}
            </Badge>
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            {invoice.client.name}
          </h1>
          {invoice.client.company && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {invoice.client.company}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-foreground">
            {formatCurrency(invoice.total, invoice.currency)}
          </p>
          <p className={cn("text-xs mt-1", isPastDue ? "text-red-400" : "text-muted-foreground")}>
            Due {formatDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Calendar, label: "Issued", value: formatDate(invoice.issueDate) },
          { icon: Calendar, label: "Due", value: formatDate(invoice.dueDate) },
          { icon: Hash,      label: "Subtotal", value: formatCurrency(invoice.subtotal, invoice.currency) },
          { icon: Hash,      label: "Tax", value: formatCurrency(invoice.tax, invoice.currency) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg bg-hunter-elevated border border-hunter-border p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">{label}</p>
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Project link */}
      {invoice.project && (
        <div className="rounded-lg bg-hunter-elevated border border-hunter-border p-4 flex items-center gap-3">
          <FolderKanban className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Linked project</p>
            <Link
              href={`/dashboard/projects/${invoice.project.id}`}
              className="text-sm font-medium text-foreground hover:text-indigo-300 transition-colors truncate block"
            >
              <span className="font-mono text-foreground/40 mr-2">{invoice.project.code}</span>
              {invoice.project.name}
            </Link>
          </div>
        </div>
      )}

      {/* Line items */}
      {items.length > 0 && (
        <div className="rounded-lg border border-hunter-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hunter-border bg-hunter-elevated">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Description</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Qty</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Unit price</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-hunter-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{item.description}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground font-mono">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                    {formatCurrency(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-hunter-elevated border-t border-hunter-border">
                <td colSpan={3} className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                  {formatCurrency(invoice.total, invoice.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="rounded-lg bg-hunter-elevated border border-hunter-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">Notes</p>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
