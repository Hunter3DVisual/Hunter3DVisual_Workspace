"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Loader2, Plus, Trash2, ChevronDown, ChevronUp, Zap, FileText, Landmark,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createInvoice, updateInvoice, getProjectsForSelect } from "@/actions/finance";
import { getClientsForSelect } from "@/actions/clients";
import type { ClientSelectOption } from "@/types/clients";
import type { InvoiceWithClient, BankingInfo } from "@/types/finance";
import type { ServiceType } from "@/types/documents";
import { SERVICE_TYPE_LABELS } from "@/types/documents";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { type: ServiceType; label: string; color: string }[] = [
  { type: "EXTERIOR",  label: "Exterior",   color: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  { type: "INTERIOR",  label: "Interior",   color: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  { type: "IMAGE_360", label: "360° Image", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { type: "TOUR_360",  label: "360° Tour",  color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { type: "ANIMATION", label: "Animation",  color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  { type: "MODEL_3D",  label: "3D Model",   color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  { type: "CUSTOM",    label: "Custom",     color: "bg-muted/30 text-muted-foreground border-hunter-border" },
];

const CAT_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.type, c.color])
);

const NOTE_PRESETS = [
  {
    label: "Revisions",
    text: "Revisions: Up to 2 rounds of minor revisions included per deliverable. Additional revision rounds will be quoted separately.",
  },
  {
    label: "Delivery",
    text: "Delivery: Final files delivered via Google Drive or WeTransfer within 3–5 business days after payment confirmation.",
  },
  {
    label: "Payment",
    text: "Payment: 50% deposit required before project commencement. Remaining balance due upon delivery. Files released only after full payment.",
  },
];

const BANKING_KEY = "h3dv_banking_defaults";
const DEFAULT_BANKING: BankingInfo = {
  bankName:        "ACB – Asia Commercial Bank",
  bankAddress:     "442 Nguyen Thi Minh Khai Street, District 3, Ho Chi Minh City, Vietnam",
  bankPostalCode:  "70000",
  accountName:     "CTY TNHH HUNTER 3DVISUAL",
  accountNumber:   "41163457",
  swift:           "ASCBVNVX",
  currency:        "USD",
  holderAddress:   "196 Truong Xuan Nam Street, Ngu Hanh Son Ward, Da Nang City, Vietnam",
  holderCity:      "Da Nang",
  holderPostalCode: "59000",
};

const BANKING_SEP = "─── Banking / Payment Details ───";

function loadBanking(): BankingInfo {
  if (typeof window === "undefined") return DEFAULT_BANKING;
  try { return { ...DEFAULT_BANKING, ...JSON.parse(localStorage.getItem(BANKING_KEY) ?? "{}") }; }
  catch { return DEFAULT_BANKING; }
}

function serializeBanking(b: BankingInfo): string {
  const bank = [
    "[Receiving Bank]",
    b.bankName        ? "Bank: " + b.bankName : "",
    b.bankAddress     ? "Bank Address: " + b.bankAddress : "",
    b.bankPostalCode  ? "Bank Postal Code: " + b.bankPostalCode : "",
  ].filter(Boolean).join("\n");

  const holder = [
    "[Account Holder]",
    b.accountName      ? "Account Name: " + b.accountName : "",
    b.accountNumber    ? "Account No: " + b.accountNumber : "",
    b.swift            ? "SWIFT/BIC: " + b.swift : "",
    b.currency         ? "Currency: " + b.currency : "",
    b.holderAddress    ? "Holder Address: " + b.holderAddress : "",
    b.holderCity       ? "Holder City: " + b.holderCity : "",
    b.holderPostalCode ? "Holder Postal Code: " + b.holderPostalCode : "",
  ].filter(Boolean).join("\n");

  return [BANKING_SEP, bank, holder].join("\n\n");
}

function generateInvoiceNumber() {
  const d = new Date();
  return `INV-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const lineItemSchema = z.object({
  category: z.string().optional(),
  description: z.string().min(1, "Required"),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().min(0),
});

const schema = z.object({
  number:      z.string().min(1, "Required"),
  contractRef: z.string().optional(),
  clientId:    z.string().min(1, "Client is required"),
  projectId:   z.string().optional(),
  dueDate:     z.string().min(1, "Required"),
  currency:    z.string().default("USD"),
  taxPct:      z.coerce.number().min(0).max(100).default(0),
  discount:    z.coerce.number().min(0).default(0),
  notes:       z.string().optional(),
  terms:       z.string().optional(),
  items:       z.array(lineItemSchema).min(1, "Add at least one line item"),
});

type FormValues = z.infer<typeof schema>;
type ProjectOption = { id: string; name: string; code: string };

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice?: InvoiceWithClient | null;
}

export function InvoiceFormModal({ open, onOpenChange, invoice }: Props) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientSelectOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("");
  const [catCounters, setCatCounters] = useState<Record<string, number>>({});
  const [bankOpen, setBankOpen] = useState(false);
  const [banking, setBanking] = useState<BankingInfo>(DEFAULT_BANKING);

  const existingItems = invoice
    ? ((invoice.items as any[]) ?? []).map((it: any) => ({
        category: it.category ?? undefined,
        description: it.description ?? "",
        quantity: it.quantity ?? 1,
        unitPrice: it.unitPrice ?? 0,
      }))
    : [{ category: undefined, description: "", quantity: 1, unitPrice: 0 }];

  const {
    register, handleSubmit, control, watch, setValue, reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: invoice
      ? {
          number:      invoice.number,
          contractRef: (invoice as any).contractRef ?? "",
          clientId:    invoice.clientId,
          projectId:   invoice.projectId ?? undefined,
          dueDate:     new Date(invoice.dueDate).toISOString().split("T")[0],
          currency:    invoice.currency ?? "USD",
          taxPct:      invoice.tax && invoice.subtotal > 0 ? Math.round((invoice.tax / invoice.subtotal) * 100) : 0,
          discount:    invoice.discount ?? 0,
          notes:       invoice.notes ?? "",
          terms:       invoice.terms ?? "",
          items:       existingItems,
        }
      : {
          number: generateInvoiceNumber(),
          contractRef: "",
          dueDate: defaultDueDate(),
          currency: "USD",
          taxPct: 0,
          discount: 0,
          items: [{ category: undefined, description: "", quantity: 1, unitPrice: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = watch("items");
  const taxPct      = watch("taxPct") ?? 0;
  const discountAmt = watch("discount") ?? 0;

  const subtotal  = watchedItems.reduce((s, it) => s + (it.quantity || 0) * (it.unitPrice || 0), 0);
  const taxAmount = +(subtotal * (taxPct / 100)).toFixed(2);
  const total     = Math.max(0, +(subtotal + taxAmount - discountAmt).toFixed(2));

  // Load clients, projects, banking on open
  useEffect(() => {
    if (!open) return;
    setSaveError(null);
    getClientsForSelect().then(setClients);
    getProjectsForSelect().then(setProjects);
    setBanking(loadBanking());
    if (!invoice) {
      reset({
        number: generateInvoiceNumber(),
        dueDate: defaultDueDate(),
        currency: "USD",
        taxPct: 0,
        discount: 0,
        items: [{ category: undefined, description: "", quantity: 1, unitPrice: 0 }],
      });
      setCatCounters({});
      setPrefix("");
    } else {
      // Always reset form with latest invoice data when edit modal opens
      reset({
        number:      invoice.number,
        contractRef: (invoice as any).contractRef ?? "",
        clientId:    invoice.clientId,
        projectId:   invoice.projectId ?? undefined,
        dueDate:     new Date(invoice.dueDate).toISOString().split("T")[0],
        currency:    invoice.currency ?? "USD",
        taxPct:      invoice.tax && invoice.subtotal > 0
          ? Math.round((invoice.tax / invoice.subtotal) * 100) : 0,
        discount:    invoice.discount ?? 0,
        notes:       invoice.notes ?? "",
        terms:       invoice.terms ?? "",
        items:       existingItems,
      });
      const initialCounters: Record<string, number> = {};
      existingItems.forEach((it) => {
        if (it.category) initialCounters[it.category] = (initialCounters[it.category] ?? 0) + 1;
      });
      setCatCounters(initialCounters);
      setPrefix("");
    }
  }, [open]);

  function quickAdd(cat: ServiceType) {
    const n = (catCounters[cat] ?? 0) + 1;
    setCatCounters((prev) => ({ ...prev, [cat]: n }));
    const catLabel = SERVICE_TYPE_LABELS[cat].en;
    const viewName = prefix
      ? `${prefix} - ${catLabel} ${String(n).padStart(2, "0")}`
      : `${catLabel} ${String(n).padStart(2, "0")}`;
    append({
      category: cat,
      description: viewName,
      quantity: 1,
      unitPrice: SERVICE_TYPE_LABELS[cat].defaultPrice,
    });
  }

  function appendNotePreset(text: string) {
    const current = watch("notes") ?? "";
    setValue("notes", current ? current + "\n\n" + text : text);
  }

  function saveBankingDefault() {
    localStorage.setItem(BANKING_KEY, JSON.stringify(banking));
  }

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    setSaveError(null);
    try {
      // Strip undefined category to avoid Next.js serialization issues
      const items = values.items.map((it) => ({
        ...(it.category ? { category: it.category } : {}),
        description: it.description,
        quantity:    it.quantity,
        unitPrice:   it.unitPrice,
        total:       +(it.quantity * it.unitPrice).toFixed(2),
      }));

      // Strip any existing banking block before appending (prevents duplicates on re-save)
      const cleanTerms = ((values.terms ?? "").split(BANKING_SEP)[0]).trim();
      const bankingText = banking.accountNumber ? serializeBanking(banking) : "";
      const terms = [cleanTerms, bankingText].filter(Boolean).join("\n\n");

      // Pass dueDate as ISO string to avoid Date serialization issues in server actions
      const payload = {
        number:      values.number,
        contractRef: values.contractRef || null,
        clientId:    values.clientId,
        projectId:   values.projectId || null,
        dueDate:     values.dueDate,        // ISO string "YYYY-MM-DD"
        subtotal:    +subtotal.toFixed(2),
        tax:         taxAmount,
        discount:    +discountAmt.toFixed(2),
        total:       total,
        currency:    values.currency || "USD",
        notes:       values.notes || null,
        terms:       terms || null,
        items,
      };

      if (invoice) await updateInvoice(invoice.id, payload);
      else         await createInvoice(payload);

      router.refresh();
      onOpenChange(false);
    } catch (e) {
      console.error("Invoice save error:", e);
      const digest = (e as any)?.digest ? ` [${(e as any).digest}]` : "";
      setSaveError(
        e instanceof Error
          ? e.message + digest
          : `Failed to save invoice. Please try again.${digest}`
      );
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[94vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            {invoice ? "Edit Invoice" : "New Invoice"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ── Row 1: Invoice # + Contract Ref */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="inv-num">Invoice #</Label>
              <Input id="inv-num" {...register("number")} placeholder="INV-2601-001" className="font-mono text-xs" />
              {errors.number && <p className="text-xs text-red-400">{errors.number.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-ref">
                Contract Ref
                <span className="ml-2 text-[10px] text-muted-foreground/60 font-normal normal-case">
                  số hợp đồng · e.g. 0903/2026/HĐ-VS
                </span>
              </Label>
              <Input id="inv-ref" {...register("contractRef")} placeholder="0903/2026/HĐ-DHKT/VS-INC" className="font-mono text-xs" />
            </div>
          </div>

          {/* ── Row 2: Currency + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="inv-cur">Currency</Label>
              <Controller name="currency" control={control} render={({ field }) => (
                <Select value={field.value ?? "USD"} onValueChange={field.onChange}>
                  <SelectTrigger id="inv-cur"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["USD","EUR","GBP","SGD","AUD","CAD","JPY","VND"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-due">Due Date</Label>
              <Input id="inv-due" type="date" {...register("dueDate")} className="[color-scheme:dark]" />
              {errors.dueDate && <p className="text-xs text-red-400">{errors.dueDate.message}</p>}
            </div>
          </div>

          {/* ── Row 2: Client + Project */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Client *</Label>
              <Controller name="clientId" control={control} render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
              {errors.clientId && <p className="text-xs text-red-400">{errors.clientId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Controller name="projectId" control={control} render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={v => field.onChange(v === "__none__" ? undefined : v)}>
                  <SelectTrigger><SelectValue placeholder="No project" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No project</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="font-mono text-foreground/40 text-xs mr-1">{p.code}</span>{p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>

          {/* ── Project Prefix */}
          <div className="space-y-1.5">
            <Label htmlFor="inv-prefix">
              Project Prefix
              <span className="ml-2 text-[10px] text-muted-foreground/60 font-normal normal-case">
                auto-names quick-add items · e.g. "VM Park 2025"
              </span>
            </Label>
            <Input
              id="inv-prefix"
              value={prefix}
              onChange={e => setPrefix(e.target.value)}
              placeholder="VM Park 2025"
              className="text-sm"
            />
          </div>

          {/* ── Quick-add category buttons */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Quick Add</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => quickAdd(cat.type as ServiceType)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all hover:opacity-80 active:scale-95",
                    cat.color
                  )}
                >
                  {cat.label}
                  <span className="opacity-60 font-mono">
                    ${SERVICE_TYPE_LABELS[cat.type as ServiceType].defaultPrice || "—"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Line Items *</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs"
                onClick={() => append({ category: undefined, description: "", quantity: 1, unitPrice: 0 })}>
                <Plus className="w-3.5 h-3.5" /> Add row
              </Button>
            </div>

            <div className="rounded-lg border border-hunter-border overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[100px_1fr_56px_88px_72px_28px] gap-1.5 px-3 py-2 bg-hunter-elevated border-b border-hunter-border">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">View / Description</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-center">Qty</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Unit Price</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Total</span>
                <span />
              </div>

              {fields.map((field, i) => {
                const cat = watchedItems[i]?.category;
                const catMeta = CATEGORIES.find(c => c.type === cat);
                const rowTotal = (watchedItems[i]?.quantity || 0) * (watchedItems[i]?.unitPrice || 0);
                return (
                  <div key={field.id}
                    className="grid grid-cols-[100px_1fr_56px_88px_72px_28px] gap-1.5 px-3 py-2 border-b border-hunter-border last:border-0 items-center">
                    {/* Category selector */}
                    <Controller name={`items.${i}.category`} control={control} render={({ field: f }) => (
                      <Select value={f.value ?? ""} onValueChange={v => f.onChange(v === "__none__" ? undefined : v)}>
                        <SelectTrigger className={cn(
                          "h-7 text-[10px] border px-2",
                          f.value ? CAT_COLOR[f.value] : "text-muted-foreground border-hunter-border"
                        )}>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">—</SelectItem>
                          {CATEGORIES.map(c => (
                            <SelectItem key={c.type} value={c.type}>
                              <span className={cn("px-1 py-0.5 rounded text-[10px] font-medium", c.color)}>{c.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )} />

                    {/* View name */}
                    <Input
                      {...register(`items.${i}.description`)}
                      placeholder={catMeta ? catMeta.label + " view name…" : "Description"}
                      className="h-7 text-xs"
                    />

                    {/* Qty */}
                    <Input
                      {...register(`items.${i}.quantity`)}
                      type="number" min={1} step={1}
                      className="h-7 text-xs text-center px-1"
                    />

                    {/* Unit Price */}
                    <Input
                      {...register(`items.${i}.unitPrice`)}
                      type="number" min={0} step={0.01}
                      className="h-7 text-xs text-right px-2 font-mono"
                    />

                    {/* Total (computed) */}
                    <div className="h-7 flex items-center justify-end pr-0.5">
                      <span className="text-xs font-mono text-foreground/80">{fmt(rowTotal)}</span>
                    </div>

                    {/* Delete */}
                    <Button type="button" variant="ghost" size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-red-400"
                      onClick={() => fields.length > 1 && remove(i)}
                      disabled={fields.length === 1}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
            {errors.items && (
              <p className="text-xs text-red-400">
                {typeof errors.items.message === "string" ? errors.items.message : "Check line items"}
              </p>
            )}
          </div>

          {/* ── Totals */}
          <div className="rounded-lg border border-hunter-border bg-hunter-elevated/60 p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono font-medium">{fmt(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-16">Tax %</span>
                <Input {...register("taxPct")} type="number" min={0} max={100} step={0.1} className="h-7 text-xs w-20" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">+{fmt(taxAmount)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-16">Discount</span>
                <Input {...register("discount")} type="number" min={0} step={0.01} className="h-7 text-xs w-24" />
              </div>
              <span className="text-sm font-mono text-amber-400">-{fmt(+discountAmt)}</span>
            </div>
            <div className="pt-2 border-t border-hunter-border flex justify-between">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-lg font-mono font-bold text-foreground">{fmt(total)}</span>
            </div>
          </div>

          {/* ── Notes with presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Notes <span className="text-muted-foreground/50 font-normal text-xs ml-1">(client-facing)</span></Label>
              <div className="flex items-center gap-1">
                {NOTE_PRESETS.map(p => (
                  <button key={p.label} type="button"
                    onClick={() => appendNotePreset(p.text)}
                    className="text-[10px] px-2 py-0.5 rounded border border-hunter-border text-muted-foreground hover:text-foreground hover:border-indigo-500/40 transition-colors">
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              {...register("notes")}
              placeholder="Add client notes, revision policy, delivery terms…"
              rows={3}
              className="text-xs resize-none"
            />
          </div>

          {/* ── Banking Info (collapsible) */}
          <div className="rounded-lg border border-hunter-border overflow-hidden">
            <button
              type="button"
              onClick={() => setBankOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-hunter-elevated text-sm font-medium hover:bg-hunter-card transition-colors"
            >
              <div className="flex items-center gap-2">
                <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Banking / Payment Details</span>
                {banking.accountNumber && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">saved</span>
                )}
              </div>
              {bankOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>

            {bankOpen && (
              <div className="border-t border-hunter-border divide-y divide-hunter-border">
                {/* Section 1: Receiving Bank */}
                <div className="p-4 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E8521A]">Receiving Bank</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Bank Name</Label>
                    <Input value={banking.bankName} onChange={e => setBanking(b => ({ ...b, bankName: e.target.value }))}
                      placeholder="e.g. ACB, BIDV, DBS" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Bank Address</Label>
                    <Input value={banking.bankAddress} onChange={e => setBanking(b => ({ ...b, bankAddress: e.target.value }))}
                      placeholder="Street address (no PO Box)" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Bank Postal / Zip Code</Label>
                    <Input value={banking.bankPostalCode} onChange={e => setBanking(b => ({ ...b, bankPostalCode: e.target.value }))}
                      placeholder="70000" className="h-8 text-xs font-mono w-40" />
                  </div>
                </div>

                {/* Section 2: Account Holder */}
                <div className="p-4 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E8521A]">Account Holder</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Name on Account</Label>
                      <Input value={banking.accountName} onChange={e => setBanking(b => ({ ...b, accountName: e.target.value }))}
                        placeholder="Legal company name" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Account Number</Label>
                      <Input value={banking.accountNumber} onChange={e => setBanking(b => ({ ...b, accountNumber: e.target.value }))}
                        placeholder="Account number" className="h-8 text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">SWIFT / BIC</Label>
                      <Input value={banking.swift} onChange={e => setBanking(b => ({ ...b, swift: e.target.value }))}
                        placeholder="e.g. ASCBVNVX" className="h-8 text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Currency</Label>
                      <Input value={banking.currency} onChange={e => setBanking(b => ({ ...b, currency: e.target.value }))}
                        placeholder="USD" className="h-8 text-xs font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Holder Address</Label>
                    <Input value={banking.holderAddress} onChange={e => setBanking(b => ({ ...b, holderAddress: e.target.value }))}
                      placeholder="Company street address" className="h-8 text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">City</Label>
                      <Input value={banking.holderCity} onChange={e => setBanking(b => ({ ...b, holderCity: e.target.value }))}
                        placeholder="Da Nang" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Postal / Zip Code</Label>
                      <Input value={banking.holderPostalCode} onChange={e => setBanking(b => ({ ...b, holderPostalCode: e.target.value }))}
                        placeholder="59000" className="h-8 text-xs font-mono" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground/50">Saved per-browser · appended to invoice automatically.</p>
                  <Button type="button" variant="outline" size="sm" onClick={saveBankingDefault} className="gap-1.5 border-hunter-border text-xs">
                    Save as default
                  </Button>
                </div>
              </div>
            )}
          </div>

          {saveError && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
              ⚠ {saveError}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gap-1.5">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {invoice ? "Save Changes" : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
