"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2, Building2, FileText, Landmark,
  CheckCircle2, ChevronDown,
  Italic, Underline,
} from "lucide-react";
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

// ─── Types & Tab ─────────────────────────────────────────────────────────────

interface Props {
  initialCompany: CompanyInfo;
  initialStyle:   InvoiceStyle;
  initialBanking: BankingInfo;
}

type Tab = "company" | "style" | "banking";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const companySchema = z.object({
  name:    z.string().min(1, "Required"),
  line1:   z.string().default(""),
  line2:   z.string().default(""),
  phone:   z.string().default(""),
  email:   z.string().default(""),
  website: z.string().default(""),
  footer:  z.string().default(""),
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

// ─── Small Reusable UI ───────────────────────────────────────────────────────

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
      <Label className="text-xs">
        {label}
        {hint && <span className="ml-2 text-muted-foreground/60 font-normal">{hint}</span>}
      </Label>
      {children}
    </div>
  );
}

function Accordion({ label, defaultOpen = false, children }: {
  label: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-hunter-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground bg-hunter-elevated hover:bg-hunter-elevated/80 transition-colors"
      >
        {label}
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="p-4 space-y-5">{children}</div>}
    </div>
  );
}

// ── ColorField ────────────────────────────────────────────────────────────────
function ColorField({ label, hint, value, onChange }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
}) {
  const safe = value.startsWith("#") && value.length >= 7 ? value : "#000000";
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label}
        {hint && <span className="ml-2 text-muted-foreground/60 font-normal">{hint}</span>}
      </Label>
      <div className="flex items-center gap-2">
        <input
          type="color" value={safe} onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-md border border-hunter-border cursor-pointer bg-transparent p-0.5"
        />
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="#E8521A"
          className="h-9 text-sm font-mono w-28" />
      </div>
    </div>
  );
}

// ── NumField ──────────────────────────────────────────────────────────────────
function NumField({ label, hint, value, onChange, min = 0, max = 200, step = 1 }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label}
        {hint && <span className="ml-2 text-muted-foreground/60 font-normal">{hint}</span>}
      </Label>
      <Input type="number" value={value} onChange={e => onChange(+e.target.value)}
        className="h-9 text-sm font-mono" min={min} max={max} step={step} />
    </div>
  );
}

// ── WeightPicker — font-weight button group ───────────────────────────────────
const WEIGHTS = [
  { label: "300", display: "Li" },
  { label: "400", display: "Re" },
  { label: "500", display: "Me" },
  { label: "600", display: "SB" },
  { label: "700", display: "Bo" },
] as const;

function WeightPicker({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-1">
        {WEIGHTS.map(w => (
          <button
            key={w.label} type="button" onClick={() => onChange(w.label)}
            title={`font-weight: ${w.label}`}
            className={cn(
              "flex-1 h-8 text-xs rounded border transition-colors",
              value === w.label
                ? "border-[#E8521A] text-[#E8521A] bg-[#E8521A]/10 font-semibold"
                : "border-hunter-border text-muted-foreground hover:text-foreground"
            )}
            style={{ fontWeight: w.label }}
          >
            {w.display}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── StyleToggles — italic / underline ─────────────────────────────────────────
function StyleToggles({ italic, onItalic, underline, onUnderline }: {
  italic: boolean; onItalic: (v: boolean) => void;
  underline?: boolean; onUnderline?: (v: boolean) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Style</Label>
      <div className="flex gap-1">
        <button
          type="button" onClick={() => onItalic(!italic)}
          className={cn(
            "w-9 h-8 flex items-center justify-center rounded border text-sm transition-colors",
            italic
              ? "border-[#E8521A] text-[#E8521A] bg-[#E8521A]/10"
              : "border-hunter-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        {underline !== undefined && onUnderline && (
          <button
            type="button" onClick={() => onUnderline(!underline)}
            className={cn(
              "w-9 h-8 flex items-center justify-center rounded border text-sm transition-colors",
              underline
                ? "border-[#E8521A] text-[#E8521A] bg-[#E8521A]/10"
                : "border-hunter-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── TypoRow — one row: size + weight + style toggles ─────────────────────────
function TypoRow({ label, size, weight, italic, underline, onSize, onWeight, onItalic, onUnderline }: {
  label:       string;
  size:        number; onSize:    (v: number) => void;
  weight:      string; onWeight:  (v: string) => void;
  italic:      boolean; onItalic: (v: boolean) => void;
  underline?:  boolean; onUnderline?: (v: boolean) => void;
}) {
  return (
    <div className="border border-hunter-border/50 rounded-md p-3 space-y-3">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <div className="grid grid-cols-[80px_1fr_auto] gap-3 items-end">
        <NumField label="Size (px)" value={size} onChange={onSize} min={6} max={72} />
        <WeightPicker label="Weight" value={weight} onChange={onWeight} />
        <StyleToggles
          italic={italic} onItalic={onItalic}
          underline={underline} onUnderline={onUnderline}
        />
      </div>
    </div>
  );
}

// ─── Font family options ──────────────────────────────────────────────────────

const FONT_FAMILY_OPTIONS = [
  { label: "Inter (default)", value: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" },
  { label: "Helvetica Neue",  value: "Helvetica Neue, Helvetica, Arial, sans-serif" },
  { label: "Georgia (serif)", value: "Georgia, 'Times New Roman', Times, serif" },
  { label: "System UI",       value: "system-ui, -apple-system, sans-serif" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function SettingsClient({ initialCompany, initialStyle, initialBanking }: Props) {
  const [tab, setTab] = useState<Tab>("company");

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "company", label: "Company Info",     icon: Building2 },
    { id: "style",   label: "Invoice Style",    icon: FileText  },
    { id: "banking", label: "Banking Defaults", icon: Landmark  },
  ];

  return (
    <div className="rounded-xl border border-hunter-border bg-hunter-card overflow-hidden">
      <div className="flex border-b border-hunter-border bg-hunter-elevated">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              tab === id ? "text-foreground border-[#E8521A]" : "text-muted-foreground border-transparent hover:text-foreground"
            )}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>
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
    setSaving(true); setSaved(false);
    try { await saveCompanySettings(data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <SectionHeader label="Company Information" hint="Appears in the invoice header and footer" />
      <Field label="Company Name *">
        <Input {...register("name")} placeholder="CTY TNHH HUNTER 3DVISUAL" className="h-9 text-sm" />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Address Line 1"><Input {...register("line1")} placeholder="Street, Ward" className="h-9 text-sm" /></Field>
        <Field label="Address Line 2"><Input {...register("line2")} placeholder="City, Country" className="h-9 text-sm" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone"><Input {...register("phone")} placeholder="+84 979 592 543" className="h-9 text-sm" /></Field>
        <Field label="Email"><Input {...register("email")} placeholder="email@company.com" className="h-9 text-sm" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Website"><Input {...register("website")} placeholder="hunter3dvisual.com" className="h-9 text-sm" /></Field>
        <Field label="Footer Text" hint="(bottom of invoice)"><Input {...register("footer")} placeholder="Thank you for your business." className="h-9 text-sm" /></Field>
      </div>
      <div className="flex items-center justify-between pt-2">
        {saved ? <SavedBadge /> : <span />}
        <Button type="submit" disabled={saving} className="gap-1.5">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Company Info
        </Button>
      </div>
    </form>
  );
}

// ─── Style Tab ────────────────────────────────────────────────────────────────

function StyleTab({ initial }: { initial: InvoiceStyle }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [v, setV] = useState<InvoiceStyle>(initial);

  const set = <K extends keyof InvoiceStyle>(k: K) => (val: InvoiceStyle[K]) =>
    setV(prev => ({ ...prev, [k]: val }));

  // Helpers for string-backed booleans
  const isItalic  = (k: keyof InvoiceStyle) => (v[k] as string) === "italic";
  const setItalic = (k: keyof InvoiceStyle) => (on: boolean) =>
    set(k)((on ? "italic" : "normal") as InvoiceStyle[typeof k]);
  const isUnderline  = (k: keyof InvoiceStyle) => (v[k] as string) === "underline";
  const setUnderline = (k: keyof InvoiceStyle) => (on: boolean) =>
    set(k)((on ? "underline" : "none") as InvoiceStyle[typeof k]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaved(false);
    try { await saveInvoiceStyleSettings(v); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      {/* ── Colors ─────────────────────────────────────────────────── */}
      <Accordion label="Colors" defaultOpen>
        <div>
          <p className="text-xs text-muted-foreground mb-3">Brand &amp; text</p>
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Brand / Accent" hint="section headers, orange" value={v.brand} onChange={set("brand")} />
            <ColorField label="Primary Text"  value={v.textPrimary}    onChange={set("textPrimary")} />
            <ColorField label="Secondary Text" hint="table, descriptions" value={v.textSecondary} onChange={set("textSecondary")} />
            <ColorField label="Muted Text" hint="labels, timestamps" value={v.textMuted} onChange={set("textMuted")} />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-3">Surfaces</p>
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Border Color"     value={v.borderColor}   onChange={set("borderColor")} />
            <ColorField label="Row Alt Bg"       value={v.rowAltBg}      onChange={set("rowAltBg")} />
            <ColorField label="Table Header Bg"  value={v.tableHeaderBg} onChange={set("tableHeaderBg")} />
            <ColorField label="Notes Bg"         value={v.notesBg}       onChange={set("notesBg")} />
            <ColorField label="Banking Card Bg"  value={v.bankingCardBg} onChange={set("bankingCardBg")} />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-3">Total Due box</p>
          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Box Background"  value={v.totalDueBg}        onChange={set("totalDueBg")} />
            <ColorField label="Label Text"      value={v.totalDueTextColor} onChange={set("totalDueTextColor")} />
            <ColorField label="Amount Color"    value={v.totalDueAmount}    onChange={set("totalDueAmount")} />
          </div>
        </div>
      </Accordion>

      {/* ── Logo ───────────────────────────────────────────────────── */}
      <Accordion label="Logo">
        <div className="grid grid-cols-2 gap-4">
          <NumField label="Logo Height (px)" value={v.logoHeight} onChange={set("logoHeight")} min={20} max={200} />
          <div className="space-y-1.5">
            <Label className="text-xs">Logo Position</Label>
            <div className="flex gap-2 mt-1">
              {(["left", "right"] as const).map(pos => (
                <button key={pos} type="button" onClick={() => set("logoPosition")(pos)}
                  className={cn(
                    "flex-1 h-9 rounded-md border text-sm font-medium transition-colors capitalize",
                    v.logoPosition === pos
                      ? "border-[#E8521A] text-[#E8521A] bg-[#E8521A]/10"
                      : "border-hunter-border text-muted-foreground hover:text-foreground"
                  )}>
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-3">Fine-tune position</p>
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Offset X (px)" hint="+ right / − left" value={v.logoOffsetX} onChange={set("logoOffsetX")} min={-200} max={200} />
            <NumField label="Offset Y (px)" hint="+ down / − up"   value={v.logoOffsetY} onChange={set("logoOffsetY")} min={-200} max={200} />
          </div>
        </div>
      </Accordion>

      {/* ── Typography ─────────────────────────────────────────────── */}
      <Accordion label="Typography">
        <div>
          <p className="text-xs text-muted-foreground mb-3">Font family</p>
          <Field label="Font Family">
            <select value={v.fontFamily} onChange={e => set("fontFamily")(e.target.value)}
              className="w-full h-9 rounded-md border border-hunter-border bg-background text-sm px-3 text-foreground">
              {FONT_FAMILY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
              {!FONT_FAMILY_OPTIONS.find(o => o.value === v.fontFamily) && (
                <option value={v.fontFamily}>{v.fontFamily}</option>
              )}
            </select>
          </Field>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-3">Header &amp; document label</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="INVOICE title"    value={v.fontInvoiceTitle}  onChange={set("fontInvoiceTitle")}  min={16} max={72} />
            <NumField label="Invoice number"   value={v.fontInvoiceNumber} onChange={set("fontInvoiceNumber")} min={8}  max={24} />
            <NumField label="Status badge"     value={v.fontStatusBadge}   onChange={set("fontStatusBadge")}   min={7}  max={16} />
            <NumField label="Section headers"  value={v.fontSectionHeader} onChange={set("fontSectionHeader")} min={8}  max={32} />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Company block</p>
          <div className="space-y-3">
            <TypoRow
              label="Company Name"
              size={v.fontCompanyName}    onSize={set("fontCompanyName")}
              weight={v.fontWeightCompanyName} onWeight={set("fontWeightCompanyName")}
              italic={isItalic("fontStyleCompanyName")} onItalic={setItalic("fontStyleCompanyName")}
            />
            <TypoRow
              label="Company Detail (address / email)"
              size={v.fontCompanyDetail}    onSize={set("fontCompanyDetail")}
              weight={v.fontWeightCompanyDetail} onWeight={set("fontWeightCompanyDetail")}
              italic={isItalic("fontStyleCompanyDetail")} onItalic={setItalic("fontStyleCompanyDetail")}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Invoice Details rows</p>
          <div className="space-y-3">
            <TypoRow
              label="Row Labels (Issue Date, Due Date…)"
              size={v.fontLabel}   onSize={set("fontLabel")}
              weight={v.fontWeightLabel} onWeight={set("fontWeightLabel")}
              italic={isItalic("fontStyleLabel")} onItalic={setItalic("fontStyleLabel")}
            />
            <TypoRow
              label="Row Values (dates, currency)"
              size={v.fontValue}   onSize={set("fontValue")}
              weight={v.fontWeightValue} onWeight={set("fontWeightValue")}
              italic={isItalic("fontStyleValue")} onItalic={setItalic("fontStyleValue")}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Bill To (client)</p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tax ID label <span className="text-muted-foreground/60 font-normal ml-1">flexible — Tax ID / VAT / ABN / GSTIN…</span></Label>
              <Input
                value={v.clientTaxLabel}
                onChange={e => set("clientTaxLabel")(e.target.value)}
                placeholder="Tax ID / VAT"
                className="h-9 text-sm w-56"
              />
            </div>
            <TypoRow
              label="Client Name"
              size={v.fontClientName}   onSize={set("fontClientName")}
              weight={v.fontWeightClientName} onWeight={set("fontWeightClientName")}
              italic={isItalic("fontStyleClientName")} onItalic={setItalic("fontStyleClientName")}
              underline={isUnderline("textDecoClientName")} onUnderline={setUnderline("textDecoClientName")}
            />
            <TypoRow
              label="Client Detail (company, project)"
              size={v.fontClientDetail}   onSize={set("fontClientDetail")}
              weight={v.fontWeightClientDetail} onWeight={set("fontWeightClientDetail")}
              italic={isItalic("fontStyleClientDetail")} onItalic={setItalic("fontStyleClientDetail")}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-3">Table &amp; totals</p>
          <div className="grid grid-cols-3 gap-3">
            <NumField label="Table header"     value={v.fontTableHeader}    onChange={set("fontTableHeader")}    min={7}  max={16} />
            <NumField label="Table rows"       value={v.fontTableRow}       onChange={set("fontTableRow")}       min={8}  max={20} />
            <NumField label="Subtotal rows"    value={v.fontTotalLabel}     onChange={set("fontTotalLabel")}     min={8}  max={20} />
            <NumField label="TOTAL DUE label"  value={v.fontTotalDueLabel}  onChange={set("fontTotalDueLabel")}  min={8}  max={24} />
            <NumField label="TOTAL DUE amount" value={v.fontTotalDueAmount} onChange={set("fontTotalDueAmount")} min={12} max={48} />
            <NumField label="Notes text"       value={v.fontNotes}          onChange={set("fontNotes")}          min={8}  max={18} />
            <NumField label="Footer text"      value={v.fontFooter}         onChange={set("fontFooter")}         min={7}  max={16} />
          </div>
        </div>
      </Accordion>

      {/* ── Banking Typography & Spacing ──────────────────────────── */}
      <Accordion label="Banking Typography &amp; Spacing">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Section title (RECEIVING BANK / ACCOUNT HOLDER)</p>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <NumField label="Size (px)"   value={v.fontBankingHeader}             onChange={set("fontBankingHeader")}             min={7} max={18} />
            <WeightPicker label="Weight"  value={v.fontWeightBankingSectionTitle} onChange={set("fontWeightBankingSectionTitle")} />
            <div className="space-y-1.5">
              <Label className="text-xs">Color</Label>
              <div className="flex items-center gap-1">
                <input type="color"
                  value={v.colorBankingSectionTitle.startsWith("#") ? v.colorBankingSectionTitle : "#6b7280"}
                  onChange={e => set("colorBankingSectionTitle")(e.target.value)}
                  className="w-9 h-9 rounded border border-hunter-border cursor-pointer bg-transparent p-0.5"
                />
                <Input value={v.colorBankingSectionTitle} onChange={e => set("colorBankingSectionTitle")(e.target.value)}
                  className="h-9 text-xs font-mono w-24" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Row labels (Bank, Address…)</p>
          <div className="space-y-3">
            <div className="grid grid-cols-[80px_1fr_1fr_auto] gap-3 items-end">
              <NumField label="Size (px)"  value={v.fontBankingLabel}       onChange={set("fontBankingLabel")}       min={7} max={18} />
              <WeightPicker label="Weight" value={v.fontWeightBankingLabel} onChange={set("fontWeightBankingLabel")} />
              <StyleToggles italic={isItalic("fontStyleBankingLabel")} onItalic={setItalic("fontStyleBankingLabel")} />
              <div className="space-y-1.5">
                <Label className="text-xs">Color</Label>
                <div className="flex items-center gap-1">
                  <input type="color"
                    value={v.colorBankingLabel.startsWith("#") ? v.colorBankingLabel : "#6b7280"}
                    onChange={e => set("colorBankingLabel")(e.target.value)}
                    className="w-9 h-9 rounded border border-hunter-border cursor-pointer bg-transparent p-0.5"
                  />
                  <Input value={v.colorBankingLabel} onChange={e => set("colorBankingLabel")(e.target.value)}
                    className="h-9 text-xs font-mono w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Row values (ACB, 41163457…)</p>
          <div className="grid grid-cols-[80px_1fr_1fr_auto] gap-3 items-end">
            <NumField label="Size (px)"  value={v.fontBankingValue}       onChange={set("fontBankingValue")}       min={7} max={18} />
            <WeightPicker label="Weight" value={v.fontWeightBankingValue} onChange={set("fontWeightBankingValue")} />
            <StyleToggles italic={isItalic("fontStyleBankingValue")} onItalic={setItalic("fontStyleBankingValue")} />
            <div className="space-y-1.5">
              <Label className="text-xs">Color</Label>
              <div className="flex items-center gap-1">
                <input type="color"
                  value={v.colorBankingValue.startsWith("#") ? v.colorBankingValue : "#111111"}
                  onChange={e => set("colorBankingValue")(e.target.value)}
                  className="w-9 h-9 rounded border border-hunter-border cursor-pointer bg-transparent p-0.5"
                />
                <Input value={v.colorBankingValue} onChange={e => set("colorBankingValue")(e.target.value)}
                  className="h-9 text-xs font-mono w-24" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-3">Spacing &amp; alignment</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Label column width (px)" hint="fixed left column"               value={v.bankingLabelWidth} onChange={set("bankingLabelWidth")} min={80}  max={280} />
            <NumField label="Row padding (px)"         hint="top &amp; bottom per row"        value={v.bankingRowGap}    onChange={set("bankingRowGap")}    min={2}   max={24}  />
            <NumField label="Card gap (px)"             hint="between Receiving / Holder"     value={v.bankingCardGap}   onChange={set("bankingCardGap")}   min={0}   max={40}  />
            <NumField label="Card padding V (px)"      value={v.bankingCardPadV} onChange={set("bankingCardPadV")} min={4} max={40} />
            <NumField label="Card padding H (px)"      value={v.bankingCardPadH} onChange={set("bankingCardPadH")} min={4} max={40} />
          </div>
        </div>
      </Accordion>

      {/* ── Spacing & Layout ─────────────────────────────────────── */}
      <Accordion label="Spacing &amp; Layout">
        <div>
          <p className="text-xs text-muted-foreground mb-3">Page padding</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Vertical (px)"   value={v.pagePaddingV} onChange={set("pagePaddingV")} min={16} max={96} />
            <NumField label="Horizontal (px)" value={v.pagePaddingH} onChange={set("pagePaddingH")} min={16} max={96} />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-3">Section &amp; table gaps</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Section gap (px)"     value={v.sectionGap}       onChange={set("sectionGap")}       min={8}  max={80} />
            <NumField label="Table row pad V (px)" value={v.tableRowPaddingV} onChange={set("tableRowPaddingV")} min={4}  max={32} />
            <NumField label="Table row pad H (px)" value={v.tableRowPaddingH} onChange={set("tableRowPaddingH")} min={4}  max={32} />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-3">Rhythm</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Line height" hint="e.g. 1.65" value={v.lineHeight}   onChange={set("lineHeight")}   min={1}  max={3}  step={0.05} />
            <NumField label="Border radius (px)"            value={v.borderRadius} onChange={set("borderRadius")} min={0}  max={20} />
          </div>
        </div>
      </Accordion>

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
    setSaving(true); setSaved(false);
    try {
      await saveBankingSettings(data);
      if (typeof window !== "undefined") localStorage.setItem("h3dv_banking_defaults", JSON.stringify(data));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-xs text-muted-foreground -mt-2">
        Defaults for new invoices. Synced to localStorage so the Invoice form auto-fills.
      </p>
      <div>
        <SectionHeader label="Receiving Bank" />
        <div className="space-y-3">
          <Field label="Bank Name"><Input {...register("bankName")} placeholder="ACB – Asia Commercial Bank" className="h-9 text-sm" /></Field>
          <Field label="Bank Address" hint="(no PO Box)"><Input {...register("bankAddress")} placeholder="Street address" className="h-9 text-sm" /></Field>
          <Field label="Bank Postal Code"><Input {...register("bankPostalCode")} placeholder="70000" className="h-9 text-sm font-mono w-40" /></Field>
        </div>
      </div>
      <div>
        <SectionHeader label="Account Holder" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name on Account"><Input {...register("accountName")} placeholder="Legal company name" className="h-9 text-sm" /></Field>
          <Field label="Account Number"><Input {...register("accountNumber")} placeholder="41163457" className="h-9 text-sm font-mono" /></Field>
          <Field label="SWIFT / BIC"><Input {...register("swift")} placeholder="ASCBVNVX" className="h-9 text-sm font-mono" /></Field>
          <Field label="Currency"><Input {...register("currency")} placeholder="USD" className="h-9 text-sm font-mono" /></Field>
        </div>
        <div className="space-y-3 mt-3">
          <Field label="Holder Address"><Input {...register("holderAddress")} placeholder="Street address" className="h-9 text-sm" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><Input {...register("holderCity")} placeholder="Da Nang" className="h-9 text-sm" /></Field>
            <Field label="Postal / Zip Code"><Input {...register("holderPostalCode")} placeholder="59000" className="h-9 text-sm font-mono" /></Field>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        {saved ? <SavedBadge /> : <span />}
        <Button type="submit" disabled={saving} className="gap-1.5">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Banking Defaults
        </Button>
      </div>
    </form>
  );
}
