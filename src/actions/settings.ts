"use server";

import { db } from "@/lib/db";
import type { CompanyInfo, InvoiceStyle, StudioSettings } from "@/types/settings";
import type { BankingInfo } from "@/types/finance";

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_COMPANY: CompanyInfo = {
  name:    "CTY TNHH HUNTER 3DVISUAL",
  line1:   "196 Trương Xuân Nam, Phường Ngũ Hành Sơn",
  line2:   "Đà Nẵng, Vietnam",
  phone:   "+84 979 592 543",
  email:   "hunterluu.47th@gmail.com",
  website: "hunter3dvisual.com",
  footer:  "Thank you for your business.",
};

export const DEFAULT_STYLE: InvoiceStyle = {
  brand:          "#E8521A",
  textPrimary:    "#111111",
  textSecondary:  "#374151",
  textMuted:      "#6b7280",
  totalDueBg:     "#0a0a0a",
  totalDueAmount: "#E8521A",
  logoHeight:          62,
  fontInvoiceTitle:    32,
  fontSectionHeader:   13,
  fontCompanyName:     14,
  fontCompanyDetail:   11,
  fontLabel:           13,
  fontValue:           13,
  fontTableRow:        13,
  fontTotalDueLabel:   13,
  fontTotalDueAmount:  20,
};

export const DEFAULT_BANKING: BankingInfo = {
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
