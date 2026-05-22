import { notFound } from "next/navigation";
import { getDocumentById } from "@/actions/documents";
import { ContractTemplate } from "@/components/documents/templates/ContractTemplate";
import { LiquidationTemplate } from "@/components/documents/templates/LiquidationTemplate";
import { InvoiceTemplate } from "@/components/documents/templates/InvoiceTemplate";
import type { ClientInfo, ScopeItem, LineItem } from "@/types/documents";

interface PrintDocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintDocumentPage({ params }: PrintDocumentPageProps) {
  const { id } = await params;
  const doc = await getDocumentById(id);
  if (!doc) notFound();

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
    <>
      <script
        dangerouslySetInnerHTML={{ __html: "window.onload = function(){ window.print(); }" }}
      />
      <div style={{ background: "#ffffff", minHeight: "100vh" }}>
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
    </>
  );
}
