export const dynamic = "force-dynamic";

import { getInvoices } from "@/actions/finance";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import { InvoicesHeader } from "@/components/invoices/InvoicesHeader";
import { FileText } from "lucide-react";
import type { InvoiceStatus } from "@prisma/client";

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
      <InvoicesHeader total={invoices.length} activeStatus={status} />

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
