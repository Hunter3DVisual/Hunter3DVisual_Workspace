"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Copy, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDocumentById, duplicateDocument, deleteDocument } from "@/actions/documents";
import { ContractTemplate } from "@/components/documents/templates/ContractTemplate";
import { LiquidationTemplate } from "@/components/documents/templates/LiquidationTemplate";
import { InvoiceTemplate } from "@/components/documents/templates/InvoiceTemplate";
import type { ClientInfo, ScopeItem, LineItem, DocumentType, DocumentStatus } from "@/types/documents";

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

type DocumentRecord = Awaited<ReturnType<typeof getDocumentById>>;

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentRecord>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getDocumentById(params.id).then((d) => {
      setDoc(d);
      setLoading(false);
    });
  }, [params.id]);

  async function handleDuplicate() {
    if (!doc) return;
    setActionLoading(true);
    try {
      const copy = await duplicateDocument(doc.id);
      router.push(`/dashboard/documents/${copy.id}`);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!doc) return;
    if (!confirm("Delete this document? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await deleteDocument(doc.id);
      router.push("/dashboard/documents");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-sm font-medium text-foreground">Document not found</p>
        <Button asChild variant="ghost" size="sm" className="mt-4">
          <Link href="/dashboard/documents">Back to Documents</Link>
        </Button>
      </div>
    );
  }

  const clientInfo = (doc.clientInfo as ClientInfo) ?? {
    name: doc.client?.name ?? "",
    company: doc.client?.company ?? "",
    address: "",
    representative: "",
    position: "",
    taxCode: "",
    phone: "",
  };
  const scopeItems = (doc.scopeItems as ScopeItem[]) ?? [];
  const lineItems = (doc.lineItems as LineItem[]) ?? [];

  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Link href="/dashboard/documents">
              <ArrowLeft className="w-4 h-4" />
              Documents
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border", TYPE_COLORS[doc.type as DocumentType])}>
              {TYPE_LABELS[doc.type as DocumentType]}
            </span>
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border", STATUS_COLORS[doc.status as DocumentStatus])}>
              {STATUS_LABELS[doc.status as DocumentStatus]}
            </span>
          </div>
          {doc.contractNumber && (
            <span className="text-sm font-medium text-foreground">{doc.contractNumber}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-hunter-border"
            onClick={() => window.open(`/print/documents/${doc.id}`, "_blank")}
          >
            <Printer className="w-4 h-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-hunter-border"
            onClick={handleDuplicate}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-hunter-border text-red-400 hover:text-red-300 hover:border-red-500/30"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl mx-auto">
        {doc.type === "CONTRACT" && (
          <ContractTemplate
            contractNumber={doc.contractNumber ?? ""}
            signDate={doc.signDate ?? new Date()}
            startDate={doc.startDate ?? new Date()}
            endDate={doc.endDate ?? new Date()}
            clientInfo={clientInfo}
            scopeItems={scopeItems}
            totalAmount={doc.totalAmount}
          />
        )}
        {doc.type === "LIQUIDATION" && (
          <LiquidationTemplate
            contractNumber={doc.contractNumber ?? ""}
            signDate={doc.signDate ?? new Date()}
            liquidationDate={doc.updatedAt}
            clientInfo={clientInfo}
            scopeItems={scopeItems}
            totalAmount={doc.totalAmount}
          />
        )}
        {doc.type === "INVOICE" && (
          <InvoiceTemplate
            contractNumber={doc.contractNumber ?? ""}
            signDate={doc.signDate ?? new Date()}
            clientInfo={clientInfo}
            lineItems={lineItems}
            totalAmount={doc.totalAmount}
            currency={doc.currency}
            notes={doc.notes ?? undefined}
          />
        )}
      </div>
    </div>
  );
}
