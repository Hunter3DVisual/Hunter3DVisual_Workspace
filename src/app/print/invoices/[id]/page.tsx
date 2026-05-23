import { notFound } from "next/navigation";
import { getInvoiceById } from "@/actions/finance";
import { PrintActions } from "@/app/print/invoices/PrintActions";
import type { InvoiceLineItem } from "@/types/finance";

interface Props {
  params: Promise<{ id: string }>;
}

const CAT_LABEL: Record<string, string> = {
  EXTERIOR:  "Exterior Render",
  INTERIOR:  "Interior Render",
  IMAGE_360: "360° Image",
  TOUR_360:  "360° Tour",
  ANIMATION: "Animation",
  MODEL_3D:  "3D Model",
  CUSTOM:    "Custom",
};

const CAT_COLOR: Record<string, string> = {
  EXTERIOR:  "#0ea5e9",
  INTERIOR:  "#8b5cf6",
  IMAGE_360: "#f59e0b",
  TOUR_360:  "#10b981",
  ANIMATION: "#f43f5e",
  MODEL_3D:  "#6366f1",
  CUSTOM:    "#6b7280",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     "#6b7280",
  SENT:      "#3b82f6",
  VIEWED:    "#8b5cf6",
  PARTIAL:   "#f59e0b",
  PAID:      "#10b981",
  OVERDUE:   "#ef4444",
  CANCELLED: "#9ca3af",
};

function fmt(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(n);
}

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function parseBankingFromTerms(terms: string | null): { banking: string[]; other: string } {
  if (!terms) return { banking: [], other: "" };
  const sep = "─── Banking / Payment Details ───";
  const idx = terms.indexOf(sep);
  if (idx === -1) return { banking: [], other: terms };
  const before = terms.slice(0, idx).trim();
  const after  = terms.slice(idx + sep.length).trim().split("\n").filter(Boolean);
  return { banking: after, other: before };
}

export default async function InvoicePrintPage({ params }: Props) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const items = (invoice.items as InvoiceLineItem[]) ?? [];
  const { banking, other: paymentTerms } = parseBankingFromTerms(invoice.terms);
  const statusColor = STATUS_COLOR[invoice.status] ?? "#6b7280";
  const currency = invoice.currency ?? "USD";

  return (
    <>
      <style>{`
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #fff; color: #111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
        }
      `}</style>

      <PrintActions />

      <div style={{ maxWidth: 794, margin: "0 auto", padding: "48px 56px", minHeight: "100vh", background: "#fff" }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", color: "#111" }}>
              Hunter3DVisual
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Architectural Visualization Studio</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>hunterluu.47th@gmail.com</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>hunter3dvisual.com</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#E8521A", letterSpacing: "-1px", lineHeight: 1 }}>
              INVOICE
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: "#374151", marginTop: 6, fontWeight: 600 }}>
              {invoice.number}
            </div>
            <div style={{
              display: "inline-block", marginTop: 6,
              background: statusColor + "20", color: statusColor,
              border: `1px solid ${statusColor}40`,
              borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
            }}>
              {invoice.status}
            </div>
          </div>
        </div>

        {/* ── Divider */}
        <div style={{ height: 2, background: "linear-gradient(90deg, #E8521A, #f97316, transparent)", marginBottom: 32, borderRadius: 1 }} />

        {/* ── Invoice Meta + Bill To ───────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 36 }}>
          {/* Dates */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 10 }}>Invoice Details</div>
            {[
              ["Issue Date", fmtDate(invoice.issueDate)],
              ["Due Date",   fmtDate(invoice.dueDate)],
              ["Currency",   currency],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span style={{ color: "#6b7280" }}>{label}</span>
                <span style={{ fontWeight: 500, color: "#111" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Bill To */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 10 }}>Bill To</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 3 }}>{invoice.client.name}</div>
            {invoice.client.company && (
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}>{invoice.client.company}</div>
            )}
            {invoice.project && (
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                <span style={{ fontFamily: "monospace", marginRight: 6, color: "#9ca3af" }}>{invoice.project.code}</span>
                {invoice.project.name}
              </div>
            )}
          </div>
        </div>

        {/* ── Line Items ─────────────────────────────────────────── */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6b7280", textTransform: "uppercase" }}>Service</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6b7280", textTransform: "uppercase" }}>Description</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6b7280", textTransform: "uppercase" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6b7280", textTransform: "uppercase" }}>Unit Price</th>
              <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6b7280", textTransform: "uppercase" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const catColor = item.category ? CAT_COLOR[item.category] : "#6b7280";
              const catLabel = item.category ? CAT_LABEL[item.category] : "";
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 12px" }}>
                    {catLabel && (
                      <span style={{
                        display: "inline-block",
                        background: catColor + "18", color: catColor,
                        border: `1px solid ${catColor}40`,
                        borderRadius: 4, padding: "2px 7px",
                        fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
                      }}>
                        {catLabel}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "#111", fontWeight: 500 }}>
                    {item.description}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "#374151", textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "#374151", textAlign: "right", fontFamily: "monospace" }}>
                    {fmt(item.unitPrice, currency)}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "#111", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                    {fmt(item.total, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Totals ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 36 }}>
          <div style={{ minWidth: 260 }}>
            {[
              ["Subtotal", fmt(invoice.subtotal, currency), false],
              invoice.tax > 0 ? ["Tax", "+" + fmt(invoice.tax, currency), false] : null,
              invoice.discount > 0 ? ["Discount", "-" + fmt(invoice.discount, currency), false] : null,
            ].filter(Boolean).map(([label, value]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#6b7280" }}>{label as string}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 500 }}>{value as string}</span>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "12px 16px", marginTop: 8,
              background: "#111", borderRadius: 8,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>TOTAL DUE</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#E8521A", fontFamily: "monospace" }}>
                {fmt(invoice.total, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Notes + Banking ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: banking.length > 0 ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 32 }}>
          {invoice.notes && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 8 }}>Notes</div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line", background: "#f9fafb", borderRadius: 8, padding: 14, border: "1px solid #e5e7eb" }}>
                {invoice.notes}
              </div>
              {paymentTerms && (
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line", marginTop: 12, background: "#f9fafb", borderRadius: 8, padding: 14, border: "1px solid #e5e7eb" }}>
                  {paymentTerms}
                </div>
              )}
            </div>
          )}

          {banking.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 8 }}>Banking Details</div>
              <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 14, border: "1px solid #bbf7d0" }}>
                {banking.map((line, i) => {
                  const [key, ...rest] = line.split(": ");
                  const val = rest.join(": ");
                  return val ? (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5, gap: 12 }}>
                      <span style={{ color: "#6b7280", whiteSpace: "nowrap" }}>{key}</span>
                      <span style={{ fontWeight: 600, color: "#111", fontFamily: key.includes("Account") || key.includes("SWIFT") ? "monospace" : "inherit", textAlign: "right" }}>{val}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>
            Thank you for your business. · hunter3dvisual.com
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#d1d5db" }}>
            {invoice.number}
          </div>
        </div>

      </div>
    </>
  );
}
