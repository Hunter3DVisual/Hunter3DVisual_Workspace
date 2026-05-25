"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Building2, FileText, Landmark, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  saveCompanySettings,
  saveInvoiceStyleSettings,
  saveBankingSettings,
} from "@/actions/settings";
import type { CompanyInfo, InvoiceStyle } from "@/types/settings";
import type { BankingInfo } from "@/types/finance";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  initialCompany: CompanyInfo;
  initialStyle:   InvoiceStyle;
  initialBanking: BankingInfo;
}

type Tab = "company" | "style" | "banking";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const companySchema = z.object({
  name:    z.string().min(1, "Required"),
  line1:   z.string().default(""),
  line2:   z.string().default(""),
  phone:   z.string().default(""),
  email:   z.string().default(""),
  website: z.string().default(""),
  footer:  z.string().default(""),
});

const styleSchema = z.object({
  brand:          z.string().min(4, "Enter a hex color"),
  textPrimary:    z.string().min(4),
  textSecondary:  z.string().min(4),
  textMuted:      z.string().min(4),
  totalDueBg:     z.string().min(4),
  totalDueAmount: z.string().min(4),
  logoHeight:          z.coerce.number().min(20).max(200),
  fontInvoiceTitle:    z.coerce.number().min(16).max(72),
  fontSectionHeader:   z.coerce.number().min(8).max(32),
  fontCompanyName:     z.coerce.number().min(8).max(32),
  fontCompanyDetail:   z.coerce.number().min(6).max(20),
  fontLabel:           z.coerce.number().min(8).max(20),
  fontValue:           z.coerce.number().min(8).max(20),
  fontTableRow:        z.coerce.number().min(8).max(20),
  fontTotalDueLabel:   z.coerce.number().min(8).max(24),
  fontTotalDueAmount:  z.coerce.number().min(12).max(48),
});

const bankingSchema = z.object({
  bankName:         z.string().default(""),
  bankAddress:      z.string().default(""),
  bankPostalCode:   z.string().default(""),
  accountName:      z.string().default(""),
  accountNumber:    z.string().default(""),
  swift:            z.string().default(""),
  currency:         z.string().default("USD"),
  holderAddress:    z.string().default(""),
  holderCity:       z.string().default(""),
  holderPostalCode: z.string().default(""),
});

// ─── Helper ───────────────────────────────────────────────────────────────────

function SavedBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
      <CheckCircle2 className="w-3.5 h-3.5" /> Saved
    </span>
  );
}

function SectionHeader({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="pb-3 mb-4 border-b border-hunter-border">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{hint && <span className="ml-2 text-muted-foreground/60 font-normal">{hint}</span>}</Label>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SettingsClient({ initialCompany, initialStyle, initialBanking }: Props) {
  const [tab, setTab] = useState<Tab>("company");

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "company", label: "Company Info",    icon: Building2 },
    { id: "style",   label: "Invoice Style",   icon: FileText  },
    { id: "banking", label: "Banking Defaults", icon: Landmark  },
  ];

  return (
    <div className="rounded-xl border border-hunter-border bg-hunter-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-hunter-border bg-hunter-elevated">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              tab === id
                ? "text-foreground border-[#E8521A]"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {tab === "company" && <CompanyTab initial={initialCompany} />}
        {tab === "style"   && <StyleTab   initial={initialStyle}   />}
        {tab === "banking" && <BankingTab initial={initialBanking} />}
      </div>
    </div>
  );
}

// ─── Company Tab ──────────────────────────────────────────────────────────────

function CompanyTab({ initial }: { initial: CompanyInfo }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CompanyInfo>({
    resolver: zodResolver(companySchema),
    defaultValues: initial,
  });

  const onSubmit = async (data: CompanyInfo) => {
    setSaving(true);
    setSaved(false);
    try {
      await saveCompanySettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <SectionHeader label="Company Information" hint="Appears in the invoice header and footer" />

      <Field label="Company Name *">
        <Input {...register("name")} placeholder="CTY TNHH HUNTER 3DVISUAL" className="h-9 text-sm" />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Address Line 1">
          <Input {...register("line1")} placeholder="Street, Ward" className="h-9 text-sm" />
        </Field>
        <Field label="Address Line 2">
          <Input {...register("line2")} placeholder="City, Country" className="h-9 text-sm" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone">
          <Input {...register("phone")} placeholder="+84 979 592 543" className="h-9 text-sm" />
        </Field>
        <Field label="Email">
          <Input {...register("email")} placeholder="email@company.com" className="h-9 text-sm" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Website">
          <Input {...register("website")} placeholder="hunter3dvisual.com" className="h-9 text-sm" />
        </Field>
        <Field label="Footer Text" hint="(bottom of invoice)">
          <Input {...register("footer")} placeholder="Thank you for your business." className="h-9 text-sm" />
        </Field>
      </div>

      <div className="flex items-center justify-between pt-2">
        {saved ? <SavedBadge /> : <span />}
        <Button type="submit" disabled={saving} className="gap-1.5">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Company Info
        </Button>
      </div>
    </form>
  );
}

// ─── Style Tab ────────────────────────────────────────────────────────────────

function ColorField({ label, hint, value, onChange }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{hint && <span className="ml-2 text-muted-foreground/60 font-normal">{hint}</span>}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-md border border-hunter-border cursor-pointer bg-transparent p-0.5"
        />
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#E8521A"
          className="h-9 text-sm font-mono w-32"
        />
      </div>
    </div>
  );
}

function StyleTab({ initial }: { initial: InvoiceStyle }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [values, setValues] = useState<InvoiceStyle>(initial);

  const set = (k: keyof InvoiceStyle) => (v: string | number) =>
    setValues(prev => ({ ...prev, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await saveInvoiceStyleSettings(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* Colors */}
      <div>
        <SectionHeader label="Colors" hint="Hex codes — affects invoice print page" />
        <div className="grid grid-cols-2 gap-4">
          <ColorField label="Brand Color" hint="Orange accents, section headers" value={values.brand} onChange={set("brand")} />
          <ColorField label="Primary Text" value={values.textPrimary} onChange={set("textPrimary")} />
          <ColorField label="Secondary Text" hint="Table, descriptions" value={values.textSecondary} onChange={set("textSecondary")} />
          <ColorField label="Muted Text" hint="Labels, timestamps" value={values.textMuted} onChange={set("textMuted")} />
          <ColorField label="TOTAL DUE Background" value={values.totalDueBg} onChange={set("totalDueBg")} />
          <ColorField label="TOTAL DUE Amount" value={values.totalDueAmount} onChange={set("totalDueAmount")} />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <SectionHeader label="Sizes" hint="Pixel values — font sizes and logo height" />
        <div className="grid grid-cols-3 gap-4">
          {([
            ["logoHeight",         "Logo Height (px)"],
            ["fontInvoiceTitle",   "INVOICE title"],
            ["fontSectionHeader",  "Section headers"],
            ["fontCompanyName",    "Company name"],
            ["fontCompanyDetail",  "Company detail"],
            ["fontLabel",          "Row labels"],
            ["fontValue",          "Row values"],
            ["fontTableRow",       "Table rows"],
            ["fontTotalDueLabel",  "TOTAL DUE label"],
            ["fontTotalDueAmount", "TOTAL DUE amount"],
          ] as [keyof InvoiceStyle, string][]).map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-xs">{label}</Label>
              <Input
                type="number"
                value={values[k] as number}
                onChange={e => set(k)(+e.target.value)}
                className="h-9 text-sm font-mono"
                min={6} max={200}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        {saved ? <SavedBadge /> : <span />}
        <Button type="submit" disabled={saving} className="gap-1.5">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Invoice Style
        </Button>
      </div>
    </form>
  );
}

// ─── Banking Tab ──────────────────────────────────────────────────────────────

function BankingTab({ initial }: { initial: BankingInfo }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const { register, handleSubmit } = useForm<BankingInfo>({
    resolver: zodResolver(bankingSchema),
    defaultValues: initial,
  });

  const onSubmit = async (data: BankingInfo) => {
    setSaving(true);
    setSaved(false);
    try {
      await saveBankingSettings(data);
      // Also sync to localStorage so InvoiceFormModal picks it up
      if (typeof window !== "undefined") {
        localStorage.setItem("h3dv_banking_defaults", JSON.stringify(data));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-xs text-muted-foreground -mt-2">
        Defaults for new invoices. Synced to localStorage so the Invoice form auto-fills.
      </p>

      {/* Receiving Bank */}
      <div>
        <SectionHeader label="Receiving Bank" />
        <div className="space-y-3">
          <Field label="Bank Name">
            <Input {...register("bankName")} placeholder="ACB – Asia Commercial Bank" className="h-9 text-sm" />
          </Field>
          <Field label="Bank Address" hint="(no PO Box)">
            <Input {...register("bankAddress")} placeholder="Street address" className="h-9 text-sm" />
          </Field>
          <Field label="Bank Postal Code">
            <Input {...register("bankPostalCode")} placeholder="70000" className="h-9 text-sm font-mono w-40" />
          </Field>
        </div>
      </div>

      {/* Account Holder */}
      <div>
        <SectionHeader label="Account Holder" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name on Account">
            <Input {...register("accountName")} placeholder="Legal company name" className="h-9 text-sm" />
          </Field>
          <Field label="Account Number">
            <Input {...register("accountNumber")} placeholder="41163457" className="h-9 text-sm font-mono" />
          </Field>
          <Field label="SWIFT / BIC">
            <Input {...register("swift")} placeholder="ASCBVNVX" className="h-9 text-sm font-mono" />
          </Field>
          <Field label="Currency">
            <Input {...register("currency")} placeholder="USD" className="h-9 text-sm font-mono" />
          </Field>
        </div>
        <div className="space-y-3 mt-3">
          <Field label="Holder Address">
            <Input {...register("holderAddress")} placeholder="Street address" className="h-9 text-sm" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <Input {...register("holderCity")} placeholder="Da Nang" className="h-9 text-sm" />
            </Field>
            <Field label="Postal / Zip Code">
              <Input {...register("holderPostalCode")} placeholder="59000" className="h-9 text-sm font-mono" />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        {saved ? <SavedBadge /> : <span />}
        <Button type="submit" disabled={saving} className="gap-1.5">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Banking Defaults
        </Button>
      </div>
    </form>
  );
}
