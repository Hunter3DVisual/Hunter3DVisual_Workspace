import { notFound } from "next/navigation";
import { getInvoiceById } from "@/actions/finance";
import { getAllSettings } from "@/actions/settings";
import { PrintActions } from "@/app/print/invoices/PrintActions";
import type { InvoiceLineItem } from "@/types/finance";

// ─────────────────────────────────────────────────────────────────────────────

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

const BANKING_SEP = "─── Banking / Payment Details ───";

type BankingParsed = {
  receivingBank: { key: string; val: string }[];
  accountHolder: { key: string; val: string }[];
  other: string;
};

function parseKV(lines: string[]): { key: string; val: string }[] {
  return lines.flatMap(line => {
    const idx = line.indexOf(": ");
    if (idx === -1 || line.startsWith("[")) return [];
    return [{ key: line.slice(0, idx), val: line.slice(idx + 2) }];
  });
}

function parseBankingFromTerms(terms: string | null): BankingParsed {
  if (!terms) return { receivingBank: [], accountHolder: [], other: "" };
  const idx = terms.indexOf(BANKING_SEP);
  if (idx === -1) return { receivingBank: [], accountHolder: [], other: terms };

  const before = terms.slice(0, idx).trim();
  const block  = terms.slice(idx + BANKING_SEP.length).trim();
  const lines  = block.split("\n").map(l => l.trim()).filter(Boolean);

  const hasSubSections = lines.some(l => l === "[Receiving Bank]" || l === "[Account Holder]");
  if (!hasSubSections) {
    return { receivingBank: parseKV(lines), accountHolder: [], other: before };
  }

  const receivingBank: string[] = [];
  const accountHolder: string[] = [];
  let cur: string[] = [];
  for (const line of lines) {
    if (line === "[Receiving Bank]") { cur = receivingBank; continue; }
    if (line === "[Account Holder]") { cur = accountHolder; continue; }
    cur.push(line);
  }
  return { receivingBank: parseKV(receivingBank), accountHolder: parseKV(accountHolder), other: before };
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoicePrintPage({ params }: Props) {
  const { id } = await params;
  const [invoice, { company, style }] = await Promise.all([
    getInvoiceById(id),
    getAllSettings(),
  ]);
  if (!invoice) notFound();

  const divider    = `linear-gradient(90deg, ${style.brand}, #f97316, transparent)`;
  const items      = (invoice.items as InvoiceLineItem[]) ?? [];
  const { receivingBank, accountHolder, other: paymentTerms } = parseBankingFromTerms(invoice.terms);
  const hasBanking = receivingBank.length > 0 || accountHolder.length > 0;
  const statusColor = STATUS_COLOR[invoice.status] ?? "#6b7280";
  const currency    = invoice.currency ?? "USD";
  const r           = style.borderRadius;
  const logoOnRight = style.logoPosition === "right";

  return (
    <>
      <style>{`
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: ${style.fontFamily};
          background: #fff;
          color: #111;
          line-height: ${style.lineHeight};
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print { .no-print { display: none !important; } body { margin: 0; } }
      `}</style>

      <PrintActions />

      <div style={{
        maxWidth: 794,
        margin: "0 auto",
        padding: `${style.pagePaddingV}px ${style.pagePaddingH}px`,
        minHeight: "100vh",
        background: "#fff",
      }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: logoOnRight ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: style.sectionGap,
        }}>

          {/* Logo + Company info */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt={company.name}
              style={{
                height: style.logoHeight,
                width: "auto",
                marginBottom: 12,
                display: "block",
                transform: `translate(${style.logoOffsetX}px, ${style.logoOffsetY}px)`,
              }}
            />
            <div style={{
              fontSize:   style.fontCompanyName,
              fontWeight: style.fontWeightCompanyName,
              fontStyle:  style.fontStyleCompanyName,
              color:      style.textPrimary,
              letterSpacing: "0.01em",
            }}>
              {company.name}
            </div>
            <div style={{
              fontSize:   style.fontCompanyDetail,
              fontWeight: style.fontWeightCompanyDetail,
              fontStyle:  style.fontStyleCompanyDetail,
              color:      style.textSecondary,
              marginTop: 4,
            }}>{company.line1}</div>
            <div style={{
              fontSize:   style.fontCompanyDetail,
              fontWeight: style.fontWeightCompanyDetail,
              fontStyle:  style.fontStyleCompanyDetail,
              color:      style.textSecondary,
            }}>{company.line2}</div>
            <div style={{
              fontSize:   style.fontCompanyDetail,
              fontWeight: style.fontWeightCompanyDetail,
              fontStyle:  style.fontStyleCompanyDetail,
              color:      style.textSecondary,
              marginTop: 4,
            }}>{company.phone}</div>
            <div style={{
              fontSize:   style.fontCompanyDetail,
              fontWeight: style.fontWeightCompanyDetail,
              fontStyle:  style.fontStyleCompanyDetail,
              color:      style.textSecondary,
            }}>{company.email} · {company.website}</div>
          </div>

          {/* INVOICE label + number + status */}
          <div style={{ textAlign: logoOnRight ? "left" : "right" }}>
            <div style={{
              fontSize:   style.fontInvoiceTitle,
              fontWeight: 800,
              color:      style.brand,
              letterSpacing: "-1px",
              lineHeight: 1,
            }}>
              INVOICE
            </div>
            <div style={{
              fontFamily: "monospace",
              fontSize:   style.fontInvoiceNumber,
              color:      style.textPrimary,
              marginTop:  6,
              fontWeight: 700,
            }}>
              {invoice.number}
            </div>
            {(invoice as any).contractRef && (
              <div style={{ fontFamily: "monospace", fontSize: style.fontStatusBadge, color: style.textMuted, marginTop: 3 }}>
                {(invoice as any).contractRef}
              </div>
            )}
            <div style={{
              display:      "inline-block",
              marginTop:    8,
              background:   statusColor + "20",
              color:        statusColor,
              border:       `1px solid ${statusColor}40`,
              borderRadius: r,
              padding:      "3px 12px",
              fontSize:     style.fontStatusBadge,
              fontWeight:   700,
              letterSpacing: "0.06em",
            }}>
              {invoice.status}
            </div>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div style={{ height: 2, background: divider, marginBottom: style.sectionGap - 4, borderRadius: 1 }} />

        {/* ── Invoice Details + Bill To ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: style.sectionGap }}>

          {/* Invoice Details */}
          <div>
            <div style={{
              fontSize:   style.fontSectionHeader,
              fontWeight: 700,
              color:      style.brand,
              marginBottom: 14,
              letterSpacing: "0.01em",
            }}>
              Invoice Details
            </div>
            {([
              ["Issue Date", fmtDate(invoice.issueDate)],
              ["Due Date",   fmtDate(invoice.dueDate)],
              ["Currency",   currency],
              ...((invoice as any).contractRef ? [["Contract Ref", (invoice as any).contractRef]] : []),
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} style={{
                display:        "flex",
                justifyContent: "space-between",
                fontSize:       style.fontLabel,
                marginBottom:   8,
                gap:            16,
              }}>
                <span style={{
                  color:      style.textMuted,
                  fontWeight: style.fontWeightLabel,
                  fontStyle:  style.fontStyleLabel,
                }}>{label}</span>
                <span style={{
                  fontWeight:     style.fontWeightValue,
                  fontStyle:      style.fontStyleValue,
                  color:          style.textPrimary,
                  fontFamily:     label === "Contract Ref" ? "monospace" : "inherit",
                  textAlign:      "right",
                }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Bill To */}
          <div>
            <div style={{
              fontSize:   style.fontSectionHeader,
              fontWeight: 700,
              color:      style.brand,
              marginBottom: 14,
              letterSpacing: "0.01em",
            }}>
              Bill To
            </div>
            <div style={{
              fontSize:        style.fontClientName,
              fontWeight:      style.fontWeightClientName,
              fontStyle:       style.fontStyleClientName,
              textDecoration:  style.textDecoClientName,
              color:           style.textPrimary,
              marginBottom:    4,
            }}>
              {invoice.client.name}
            </div>
            {invoice.client.company && (
              <div style={{
                fontSize:   style.fontClientDetail,
                fontWeight: style.fontWeightClientDetail,
                fontStyle:  style.fontStyleClientDetail,
                color:      style.textSecondary,
                marginBottom: 2,
              }}>
                {invoice.client.company}
              </div>
            )}
            {invoice.project && (
              <div style={{ fontSize: style.fontClientDetail, color: style.textMuted, marginTop: 6 }}>
                <span style={{ fontFamily: "monospace", marginRight: 6, color: "#9ca3af" }}>{invoice.project.code}</span>
                {invoice.project.name}
              </div>
            )}
          </div>
        </div>

        {/* ── Line Items ──────────────────────────────────────────────────── */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ background: style.tableHeaderBg, borderBottom: `2px solid ${style.borderColor}` }}>
              {(["Service", "Description", "Qty", "Unit Price", "Total"] as const).map((col, i) => (
                <th key={col} style={{
                  textAlign:    i === 0 || i === 1 ? "left" : i === 2 ? "center" : "right",
                  padding:      `${style.tableRowPaddingV}px ${style.tableRowPaddingH}px`,
                  fontSize:     style.fontTableHeader,
                  fontWeight:   700,
                  letterSpacing: "0.06em",
                  color:        style.textSecondary,
                  textTransform: "uppercase",
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const catColor = item.category ? CAT_COLOR[item.category] : "#6b7280";
              const catLabel = item.category ? CAT_LABEL[item.category] : "";
              return (
                <tr key={i} style={{ borderBottom: `1px solid #f3f4f6`, background: i % 2 === 0 ? "#fff" : style.rowAltBg }}>
                  <td style={{ padding: `${style.tableRowPaddingV}px ${style.tableRowPaddingH}px` }}>
                    {catLabel && (
                      <span style={{
                        display:      "inline-block",
                        background:   catColor + "18",
                        color:        catColor,
                        border:       `1px solid ${catColor}40`,
                        borderRadius: r - 2 > 0 ? r - 2 : 2,
                        padding:      "2px 7px",
                        fontSize:     10,
                        fontWeight:   600,
                        whiteSpace:   "nowrap",
                      }}>{catLabel}</span>
                    )}
                  </td>
                  <td style={{ padding: `${style.tableRowPaddingV}px ${style.tableRowPaddingH}px`, fontSize: style.fontTableRow, color: style.textPrimary, fontWeight: 500 }}>
                    {item.description}
                  </td>
                  <td style={{ padding: `${style.tableRowPaddingV}px ${style.tableRowPaddingH}px`, fontSize: style.fontTableRow, color: style.textSecondary, textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: `${style.tableRowPaddingV}px ${style.tableRowPaddingH}px`, fontSize: style.fontTableRow, color: style.textSecondary, textAlign: "right", fontFamily: "monospace" }}>
                    {fmt(item.unitPrice, currency)}
                  </td>
                  <td style={{ padding: `${style.tableRowPaddingV}px ${style.tableRowPaddingH}px`, fontSize: style.fontTableRow, color: style.textPrimary, textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                    {fmt(item.total, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Totals ──────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: style.sectionGap }}>
          <div style={{ minWidth: 300 }}>
            {([
              ["Subtotal",  fmt(invoice.subtotal, currency)],
              invoice.tax      > 0 ? ["Tax",      "+" + fmt(invoice.tax, currency)]      : null,
              invoice.discount > 0 ? ["Discount", "-" + fmt(invoice.discount, currency)] : null,
            ].filter(Boolean) as [string, string][]).map(([label, value]) => (
              <div key={label} style={{
                display:        "flex",
                justifyContent: "space-between",
                fontSize:       style.fontTotalLabel,
                padding:        "7px 4px",
                borderBottom:   `1px solid ${style.borderColor}`,
              }}>
                <span style={{ color: style.textSecondary, fontWeight: 500 }}>{label}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 600, color: style.textPrimary }}>{value}</span>
              </div>
            ))}
            <div style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              padding:        "14px 20px",
              marginTop:      10,
              background:     style.totalDueBg,
              borderRadius:   r,
            }}>
              <span style={{ fontSize: style.fontTotalDueLabel, fontWeight: 700, color: style.totalDueTextColor, letterSpacing: "0.06em" }}>
                TOTAL DUE
              </span>
              <span style={{ fontSize: style.fontTotalDueAmount, fontWeight: 800, color: style.totalDueAmount, fontFamily: "monospace" }}>
                {fmt(invoice.total, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Notes ───────────────────────────────────────────────────────── */}
        {(invoice.notes || paymentTerms) && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: style.fontSectionHeader, fontWeight: 700, color: style.brand, marginBottom: 10, letterSpacing: "0.01em" }}>
              Notes
            </div>
            {invoice.notes && (
              <div style={{
                fontSize:    style.fontNotes,
                color:       style.textSecondary,
                lineHeight:  style.lineHeight,
                whiteSpace:  "pre-line",
                background:  style.notesBg,
                borderRadius: r,
                padding:     "14px 16px",
                border:      `1px solid ${style.borderColor}`,
              }}>
                {invoice.notes}
              </div>
            )}
            {paymentTerms && (
              <div style={{
                fontSize:    style.fontNotes,
                color:       style.textSecondary,
                lineHeight:  style.lineHeight,
                whiteSpace:  "pre-line",
                marginTop:   10,
                background:  style.notesBg,
                borderRadius: r,
                padding:     "14px 16px",
                border:      `1px solid ${style.borderColor}`,
              }}>
                {paymentTerms}
              </div>
            )}
          </div>
        )}

        {/* ── Banking ─────────────────────────────────────────────────────── */}
        {hasBanking && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: style.fontSectionHeader, fontWeight: 700, color: style.brand, marginBottom: 14, letterSpacing: "0.01em" }}>
              Banking / Payment Details
            </div>

            {/* ── Banking card — shared row renderer ──────────────────── */}
            {([
              { title: "Receiving Bank",  rows: receivingBank,  last: accountHolder.length === 0 },
              { title: "Account Holder",  rows: accountHolder,  last: true },
            ] as { title: string; rows: { key: string; val: string }[]; last: boolean }[])
              .filter(({ rows }) => rows.length > 0)
              .map(({ title, rows, last }) => (
                <div key={title} style={{
                  background:   style.bankingCardBg,
                  borderRadius: r,
                  padding:      `${style.bankingCardPadV}px ${style.bankingCardPadH}px`,
                  border:       `1px solid ${style.borderColor}`,
                  marginBottom: last ? 0 : style.bankingCardGap,
                }}>
                  {/* Section title + underline */}
                  <div style={{
                    fontSize:      style.fontBankingHeader,
                    fontWeight:    style.fontWeightBankingSectionTitle,
                    color:         style.colorBankingSectionTitle,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    paddingBottom: 8,
                    marginBottom:  4,
                    borderBottom:  `1px solid ${style.borderColor}`,
                  }}>
                    {title}
                  </div>

                  {/* Rows — fixed label column + value column */}
                  {rows.map(({ key, val }, i) => {
                    const isLast = i === rows.length - 1;
                    const isMono = key.includes("Account") || key.includes("SWIFT") || key.includes("No");
                    return (
                      <div key={i} style={{
                        display:             "grid",
                        gridTemplateColumns: `${style.bankingLabelWidth}px 1fr`,
                        alignItems:          "baseline",
                        paddingTop:          style.bankingRowGap,
                        paddingBottom:       style.bankingRowGap,
                        borderBottom:        isLast ? "none" : "1px solid rgba(0,0,0,0.05)",
                      }}>
                        {/* Label — fixed width, colon-terminated */}
                        <span style={{
                          fontSize:   style.fontBankingLabel,
                          fontWeight: style.fontWeightBankingLabel,
                          fontStyle:  style.fontStyleBankingLabel,
                          color:      style.colorBankingLabel,
                          whiteSpace: "nowrap",
                        }}>
                          {key}:
                        </span>

                        {/* Value — always starts at the same x position */}
                        <span style={{
                          fontSize:   style.fontBankingValue,
                          fontWeight: style.fontWeightBankingValue,
                          fontStyle:  style.fontStyleBankingValue,
                          color:      style.colorBankingValue,
                          fontFamily: isMono ? "monospace" : "inherit",
                        }}>
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))
            }
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div style={{ borderTop: `1px solid ${style.borderColor}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: style.fontFooter, color: "#9ca3af" }}>
            {company.footer} · {company.name} · {company.website}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: style.fontFooter, color: "#d1d5db" }}>
            {invoice.number}
          </div>
        </div>

      </div>
    </>
  );
}
