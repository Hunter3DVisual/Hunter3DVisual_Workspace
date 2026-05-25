"use server";

import { db } from "@/lib/db";
import type { CompanyInfo, InvoiceStyle, StudioSettings } from "@/types/settings";
import type { BankingInfo } from "@/types/finance";

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COMPANY: CompanyInfo = {
  name:    "CTY TNHH HUNTER 3DVISUAL",
  line1:   "196 Trương Xuân Nam, Phường Ngũ Hành Sơn",
  line2:   "Đà Nẵng, Vietnam",
  phone:   "+84 979 592 543",
  email:   "hunterluu.47th@gmail.com",
  website: "hunter3dvisual.com",
  footer:  "Thank you for your business.",
};

const DEFAULT_STYLE: InvoiceStyle = {
  // Brand & text colors
  brand:             "#E8521A",
  textPrimary:       "#111111",
  textSecondary:     "#374151",
  textMuted:         "#6b7280",

  // Surfaces
  borderColor:       "#e5e7eb",
  rowAltBg:          "#fafafa",
  tableHeaderBg:     "#f9fafb",
  notesBg:           "#f9fafb",
  bankingCardBg:     "#f9fafb",

  // Total Due box
  totalDueBg:        "#0a0a0a",
  totalDueTextColor: "#e5e7eb",
  totalDueAmount:    "#E8521A",

  // Logo
  logoHeight:   74,
  logoPosition: "left",
  logoOffsetX:  0,
  logoOffsetY:  0,

  // Global typography
  fontFamily:        "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  fontInvoiceTitle:  36,
  fontStatusBadge:   11,
  fontFooter:        11,

  // Company block
  fontCompanyName:         14,
  fontWeightCompanyName:   "700",
  fontStyleCompanyName:    "normal",
  fontCompanyDetail:       11,
  fontWeightCompanyDetail: "400",
  fontStyleCompanyDetail:  "normal",

  // Invoice Details rows
  fontSectionHeader: 15,
  fontLabel:         13,
  fontWeightLabel:   "400",
  fontStyleLabel:    "normal",
  fontValue:         13,
  fontWeightValue:   "600",
  fontStyleValue:    "normal",
  fontInvoiceNumber: 14,

  // Bill To (client)
  clientTaxLabel:         "Tax ID / VAT",
  fontClientName:         16,
  fontWeightClientName:   "700",
  fontStyleClientName:    "normal",
  textDecoClientName:     "none",
  fontClientDetail:       12,
  fontWeightClientDetail: "400",
  fontStyleClientDetail:  "normal",

  // Table
  fontTableHeader:     10,
  fontTableRow:        13,

  // Totals
  fontTotalLabel:      13,
  fontTotalDueLabel:   13,
  fontTotalDueAmount:  22,

  // Notes
  fontNotes:           12,

  // Banking typography
  fontBankingHeader:             10,
  colorBankingSectionTitle:      "#6b7280",
  fontWeightBankingSectionTitle: "700",

  fontBankingLabel:              12,
  colorBankingLabel:             "#6b7280",
  fontWeightBankingLabel:        "400",
  fontStyleBankingLabel:         "normal",

  fontBankingValue:              12,
  colorBankingValue:             "#111111",
  fontWeightBankingValue:        "600",
  fontStyleBankingValue:         "normal",

  // Banking spacing
  bankingLabelWidth: 160,
  bankingRowGap:     7,
  bankingCardPadV:   16,
  bankingCardPadH:   20,
  bankingCardGap:    12,

  // Global spacing
  pagePaddingV:     48,
  pagePaddingH:     56,
  sectionGap:       36,
  lineHeight:       1.65,
  borderRadius:     6,
  tableRowPaddingV: 12,
  tableRowPaddingH: 12,
};

const DEFAULT_BANKING: BankingInfo = {
  bankName:         "ACB – Asia Commercial Bank",
  bankAddress:      "442 Nguyen Thi Minh Khai Street, District 3, Ho Chi Minh City, Vietnam",
  bankPostalCode:   "70000",
  accountName:      "CTY TNHH HUNTER 3DVISUAL",
  accountNumber:    "41163457",
  swift:            "ASCBVNVX",
  currency:         "USD",
  holderAddress:    "196 Truong Xuan Nam Street, Ngu Hanh Son Ward, Da Nang City, Vietnam",
  holderCity:       "Da Nang",
  holderPostalCode: "59000",
};

// ─── Generic get/save ────────────────────────────────────────────────────────

async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const row = await db.studioSetting.findUnique({ where: { key } });
    if (!row) return defaultValue;
    return { ...defaultValue, ...JSON.parse(row.value) } as T;
  } catch {
    return defaultValue;
  }
}

async function saveSetting(key: string, value: object): Promise<void> {
  await db.studioSetting.upsert({
    where:  { key },
    create: { key, value: JSON.stringify(value) },
    update: { value: JSON.stringify(value) },
  });
}

// ─── Company ─────────────────────────────────────────────────────────────────

export async function getCompanySettings(): Promise<CompanyInfo> {
  return getSetting("company", DEFAULT_COMPANY);
}

export async function saveCompanySettings(data: CompanyInfo): Promise<void> {
  await saveSetting("company", data);
}

// ─── Invoice Style ────────────────────────────────────────────────────────────

export async function getInvoiceStyleSettings(): Promise<InvoiceStyle> {
  return getSetting("invoice_style", DEFAULT_STYLE);
}

export async function saveInvoiceStyleSettings(data: InvoiceStyle): Promise<void> {
  await saveSetting("invoice_style", data);
}

// ─── Banking Defaults ─────────────────────────────────────────────────────────

export async function getBankingSettings(): Promise<BankingInfo> {
  return getSetting("banking", DEFAULT_BANKING);
}

export async function saveBankingSettings(data: BankingInfo): Promise<void> {
  await saveSetting("banking", data);
}

// ─── All settings at once (for print page) ───────────────────────────────────

export async function getAllSettings(): Promise<StudioSettings> {
  const [company, style] = await Promise.all([
    getCompanySettings(),
    getInvoiceStyleSettings(),
  ]);
  return { company, style };
}
