"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Building2, Calendar, FolderKanban, Hash, Receipt,
  Pencil, Loader2, CheckCircle2, Send, XCircle, Printer, Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { getInvoiceById, updateInvoiceStatus, deleteInvoice } from "@/actions/finance";
import { InvoiceFormModal } from "@/components/invoices/InvoiceFormModal";
import type { InvoiceStatus } from "@prisma/client";
import type { InvoiceWithClient } from "@/types/finance";

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  DRAFT:     { label: "Draft",     className: "text-muted-foreground border-hunter-border bg-hunter-elevated" },
  SENT:      { label: "Sent",      className: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  VIEWED:    { label: "Viewed",    className: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  PARTIAL:   { label: "Partial",   className: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  PAID:      { label: "Paid",      className: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  OVERDUE:   { label: "Overdue",   className: "text-red-400 border-red-500/30 bg-red-500/10" },
  CANCELLED: { label: "Cancelled", className: "text-muted-foreground/50 border-hunter-border bg-hunter-elevated" },
};

const CAT_COLOR: Record<string, string> = {
  EXTERIOR:  "bg-sky-500/15 text-sky-400 border-sky-500/30",
  INTERIOR:  "bg-violet-500/15 text-violet-400 border-violet-500/30",
  IMAGE_360: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  TOUR_360:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  ANIMATION: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  MODEL_3D:  "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  CUSTOM:    "bg-muted/30 text-muted-foreground border-hunter-border",
};

const CAT_LABEL: Record<string, string> = {
  EXTERIOR:  "Exterior",
  INTERIOR:  "Interior",
  IMAGE_360: "360° Image",
  TOUR_360:  "360° Tour",
  ANIMATION: "Animation",
  MODEL_3D:  "3D Model",
  CUSTOM:    "Custom",
};

type FullInvoice = Awaited<ReturnType<typeof getInvoiceById>>;

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [invoice, setInvoice] = useState<FullInvoice>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  async function load() {
    const data = await getInvoiceById(params.id);
    setInvoice(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [params.id]);

  async function handleStatusChange(status: InvoiceStatus) {
    if (!invoice) return;
    setActionLoading(true);
    try {
      await updateInvoiceStatus(invoice.id, status);
      await load();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!invoice) return;
    setActionLoading(true);
    try {
      await deleteInvoice(invoice.id);
      router.push("/dashboard/invoices");
    } catch (e) {
      console.error("Delete invoice error:", e);
      setActionLoading(false);
      setDeleteConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-sm font-medium text-foreground">Invoice not found</p>
        <Button asChild variant="ghost" size="sm" className="mt-4">
          <Link href="/dashboard/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[invoice.status];
  const isPastDue =
    invoice.status !== "PAID" &&
    invoice.status !== "CANCELLED" &&
    new Date(invoice.dueDate) < new Date();

  const items = (invoice.items as {
    category?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[]) ?? [];

  const canMarkSent = invoice.status === "DRAFT";
  const canMarkPaid = ["SENT", "VIEWED", "PARTIAL", "OVERDUE"].includes(invoice.status);
  const canCancel   = !["PAID", "CANCELLED"].includes(invoice.status);

  const invoiceForModal = invoice as unknown as InvoiceWithClient;

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/dashboard/invoices"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Invoices
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-sm text-muted-foreground">{invoice.number}</span>
            <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 font-medium border", cfg.className)}>
              {cfg.label}
            </Badge>
          </div>
          <h1 className="text-xl font-semibold text-foreground">{invoice.client.name}</h1>
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

      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" className="gap-1.5 border-hunter-border"
          onClick={() => setEditOpen(true)}>
          <Pencil className="w-3.5 h-3.5" /> Edit
        </Button>

        <Button variant="outline" size="sm" className="gap-1.5 border-hunter-border"
          onClick={() => window.open("/print/invoices/" + params.id, "_blank")}>
          <Printer className="w-3.5 h-3.5" /> Export PDF
        </Button>

        {canMarkSent && (
          <Button variant="outline" size="sm" disabled={actionLoading}
            className="gap-1.5 border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-400/50"
            onClick={() => handleStatusChange("SENT")}>
            {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Mark as Sent
          </Button>
        )}

        {canMarkPaid && (
          <Button variant="outline" size="sm" disabled={actionLoading}
            className="gap-1.5 border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/50"
            onClick={() => handleStatusChange("PAID")}>
            {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            Mark as Paid
          </Button>
        )}

        {canCancel && (
          <Button variant="outline" size="sm" disabled={actionLoading}
            className="gap-1.5 border-hunter-border text-muted-foreground hover:text-red-400 hover:border-red-500/30"
            onClick={() => handleStatusChange("CANCELLED")}>
            {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
            Cancel
          </Button>
        )}

        {/* Delete — separated to the right */}
        <div className="ml-auto">
          {!deleteConfirm ? (
            <Button variant="ghost" size="sm" disabled={actionLoading}
              className="gap-1.5 text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => setDeleteConfirm(true)}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Delete permanently?</span>
              <Button variant="outline" size="sm" disabled={actionLoading}
                className="gap-1 border-red-500/40 text-red-400 hover:bg-red-500/15 h-7 text-xs"
                onClick={handleDelete}>
                {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Yes, delete
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground"
                onClick={() => setDeleteConfirm(false)}>
                No
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { icon: Calendar, label: "Issued",   value: formatDate(invoice.issueDate) },
          { icon: Calendar, label: "Due",      value: formatDate(invoice.dueDate) },
          { icon: Hash,     label: "Subtotal", value: formatCurrency(invoice.subtotal, invoice.currency) },
          { icon: Hash,     label: "Tax",      value: formatCurrency(invoice.tax, invoice.currency) },
        ] as const).map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg bg-hunter-elevated border border-hunter-border p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">{label}</p>
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              {value}
            </p>
          </div>
        ))}
      </div>

      {invoice.discount > 0 && (
        <div className="rounded-lg bg-hunter-elevated border border-hunter-border px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Discount</span>
          <span className="text-sm font-mono text-amber-400">-{formatCurrency(invoice.discount, invoice.currency)}</span>
        </div>
      )}

      {invoice.project && (
        <div className="rounded-lg bg-hunter-elevated border border-hunter-border p-4 flex items-center gap-3">
          <FolderKanban className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Linked project</p>
            <Link
              href={"/dashboard/projects/" + invoice.project.id}
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
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Service</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Description</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Qty</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Unit price</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-hunter-border last:border-0">
                  <td className="px-4 py-3">
                    {item.category && (
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border", CAT_COLOR[item.category] ?? CAT_COLOR.CUSTOM)}>
                        {CAT_LABEL[item.category] ?? item.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground font-medium">{item.description}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground font-mono">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                    {formatCurrency(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {invoice.tax > 0 && (
                <tr className="border-t border-hunter-border">
                  <td colSpan={4} className="px-4 py-2 text-right text-xs text-muted-foreground">Tax</td>
                  <td className="px-4 py-2 text-right font-mono text-sm text-muted-foreground">
                    +{formatCurrency(invoice.tax, invoice.currency)}
                  </td>
                </tr>
              )}
              {invoice.discount > 0 && (
                <tr className="border-t border-hunter-border">
                  <td colSpan={4} className="px-4 py-2 text-right text-xs text-muted-foreground">Discount</td>
                  <td className="px-4 py-2 text-right font-mono text-sm text-amber-400">
                    -{formatCurrency(invoice.discount, invoice.currency)}
                  </td>
                </tr>
              )}
              <tr className="bg-hunter-elevated border-t border-hunter-border">
                <td colSpan={4} className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
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

      {/* Notes + Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {invoice.notes && (
          <div className="rounded-lg bg-hunter-elevated border border-hunter-border p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">Notes</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
        {invoice.terms && (
          <div className="rounded-lg bg-hunter-elevated border border-hunter-border p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">Payment Terms</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.terms}</p>
          </div>
        )}
      </div>

      <InvoiceFormModal
        open={editOpen}
        onOpenChange={(v) => { setEditOpen(v); if (!v) load(); }}
        invoice={invoiceForModal}
      />
    </div>
  );
}
