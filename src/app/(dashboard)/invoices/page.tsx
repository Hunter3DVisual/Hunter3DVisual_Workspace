import Link from "next/link";
import { getInvoices } from "@/actions/finance";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@prisma/client";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Viewed", value: "VIEWED" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
] as const;

interface InvoicesPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const { status, search } = await searchParams;

  const invoices = await getInvoices({
    status: status as InvoiceStatus | undefined,
    search,
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
            {status ? ` · ${status.charAt(0) + status.slice(1).toLowerCase()}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-lg bg-hunter-elevated border border-hunter-border w-fit overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const isActive = (status ?? "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/invoices?status=${tab.value}` : "/invoices"}
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

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No invoices found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {status
              ? `No ${status.charAt(0) + status.slice(1).toLowerCase()} invoices`
              : "Create your first invoice to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {invoices.map((invoice, i) => (
            <InvoiceCard key={invoice.id} invoice={invoice} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
