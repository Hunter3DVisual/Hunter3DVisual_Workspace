"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, FileCheck, Receipt, Plus, Trash2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createDocument } from "@/actions/documents";
import { ContractTemplate } from "@/components/documents/templates/ContractTemplate";
import { LiquidationTemplate } from "@/components/documents/templates/LiquidationTemplate";
import { InvoiceTemplate } from "@/components/documents/templates/InvoiceTemplate";
import type { DocumentType, ClientInfo, ScopeItem, LineItem, ServiceType } from "@/types/documents";
import { SERVICE_TYPE_LABELS } from "@/types/documents";

interface ClientOption {
  id: string;
  name: string;
  company: string | null;
  clientInfo?: Partial<ClientInfo> | null;
  phone?: string | null;
  address?: string | null;
  representative?: string | null;
  position?: string | null;
  taxCode?: string | null;
  whatsapp?: string | null;
}

interface ProjectOption {
  id: string;
  name: string;
  code: string;
}

interface DocumentWizardProps {
  clients: ClientOption[];
  projects: ProjectOption[];
}

const STEPS = ["Type", "Client", "Details", "Preview", "Save"];

const TYPE_OPTIONS: { type: DocumentType; label: string; labelVI: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
  {
    type: "CONTRACT",
    label: "Contract",
    labelVI: "Hợp đồng",
    icon: FileText,
    desc: "3D design and rendering service contract between two parties",
  },
  {
    type: "LIQUIDATION",
    label: "Liquidation",
    labelVI: "Biên bản thanh lý",
    icon: FileCheck,
    desc: "Contract liquidation minutes upon project completion",
  },
  {
    type: "INVOICE",
    label: "Invoice",
    labelVI: "Hóa đơn",
    icon: Receipt,
    desc: "Professional invoice for services rendered",
  },
];

function emptyClientInfo(): ClientInfo {
  return { name: "", company: "", address: "", representative: "", position: "", taxCode: "", phone: "" };
}

function emptyScopeItem(): ScopeItem {
  return { description: "", quantity: 1 };
}

function emptyLineItem(): LineItem {
  return { item: "", description: "", qty: 1, unitPrice: 0 };
}

export function DocumentWizard({ clients, projects }: DocumentWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<DocumentType | null>(null);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [signDate, setSignDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [liquidationDate, setLiquidationDate] = useState("");
  const [clientInfo, setClientInfo] = useState<ClientInfo>(emptyClientInfo());
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>([emptyScopeItem()]);
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLineItem()]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [projectPrefix, setProjectPrefix] = useState("");

  const patchClientInfo = useCallback((field: keyof ClientInfo, val: string) => {
    setClientInfo((prev) => ({ ...prev, [field]: val }));
  }, []);

  function selectClient(id: string) {
    setClientId(id);
    const c = clients.find((cl) => cl.id === id);
    if (!c) return;
    setClientInfo({
      name: c.name ?? "",
      company: c.company ?? "",
      address: c.address ?? "",
      representative: c.representative ?? "",
      position: c.position ?? "",
      taxCode: c.taxCode ?? "",
      phone: c.phone ?? "",
    });
  }

  function addScopeItem() {
    setScopeItems((prev) => [...prev, emptyScopeItem()]);
  }

  function removeScopeItem(i: number) {
    setScopeItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function patchScopeItem(i: number, field: keyof ScopeItem, val: string | number) {
    setScopeItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, emptyLineItem()]);
  }

  function removeLineItem(i: number) {
    setLineItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function patchLineItem(i: number, field: keyof LineItem, val: string | number) {
    setLineItems((prev) => {
      const next = prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
      if (type === "INVOICE") {
        const sum = next.reduce((s, item) => s + Number(item.qty) * Number(item.unitPrice), 0);
        setTotalAmount(sum);
      }
      return next;
    });
  }

  function applyServiceType(i: number, svcType: ServiceType) {
    const meta = SERVICE_TYPE_LABELS[svcType];
    setLineItems((prev) => {
      const next = prev.map((item, idx) => {
        if (idx !== i) return item;
        return {
          ...item,
          serviceType: svcType,
          description: meta.en,
          unitPrice: meta.defaultPrice > 0 ? meta.defaultPrice : item.unitPrice,
        };
      });
      const sum = next.reduce((s, item) => s + Number(item.qty) * Number(item.unitPrice), 0);
      setTotalAmount(sum);
      return next;
    });
  }

  function quickAddServiceType(svcType: ServiceType) {
    const meta = SERVICE_TYPE_LABELS[svcType];
    setLineItems((prev) => {
      const newItem: LineItem = {
        item: projectPrefix ? `${projectPrefix} - ` : "",
        description: meta.en,
        qty: 1,
        unitPrice: meta.defaultPrice,
        serviceType: svcType,
      };
      const next = [...prev, newItem];
      const sum = next.reduce((s, item) => s + Number(item.qty) * Number(item.unitPrice), 0);
      setTotalAmount(sum);
      return next;
    });
  }

  function canAdvance(): boolean {
    if (step === 0) return type !== null;
    if (step === 1) return true;
    if (step === 2) {
      if (!contractNumber || !signDate) return false;
      if (type === "CONTRACT") return !!(startDate && endDate);
      if (type === "LIQUIDATION") return !!liquidationDate;
      return true;
    }
    return true;
  }

  async function handleSave() {
    if (!type) return;
    setSaving(true);
    setError(null);
    try {
      const doc = await createDocument({
        type,
        contractNumber: contractNumber || undefined,
        signDate: signDate ? new Date(signDate) : undefined,
        startDate: type === "CONTRACT" && startDate ? new Date(startDate) : undefined,
        endDate: type === "CONTRACT" && endDate ? new Date(endDate) : undefined,
        clientId: clientId || undefined,
        projectId: projectId || undefined,
        clientInfo,
        scopeItems: type !== "INVOICE" ? scopeItems : undefined,
        lineItems: type === "INVOICE" ? lineItems : undefined,
        totalAmount,
        currency: "USD",
        notes: notes || undefined,
      });
      router.push(`/dashboard/documents/${doc.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save document");
      setSaving(false);
    }
  }

  const inputCls = "bg-hunter-elevated border-hunter-border text-foreground placeholder:text-muted-foreground focus-visible:ring-indigo-500";
  const labelCls = "text-xs text-muted-foreground";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border transition-colors",
              i === step
                ? "bg-indigo-500 text-white border-indigo-500"
                : i < step
                  ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                  : "bg-hunter-elevated text-muted-foreground border-hunter-border"
            )}>
              {i + 1}
            </div>
            <span className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-hunter-border bg-hunter-card p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-base font-semibold text-foreground mb-1">Loại tài liệu / Document Type</h2>
                <p className="text-sm text-muted-foreground mb-6">Chọn loại tài liệu bạn muốn tạo</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {TYPE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = type === opt.type;
                    return (
                      <button
                        key={opt.type}
                        onClick={() => setType(opt.type)}
                        className={cn(
                          "flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all duration-150",
                          selected
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-hunter-border bg-hunter-elevated hover:border-hunter-border/80 hover:bg-hunter-card"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg",
                          selected ? "bg-indigo-500/20 text-indigo-400" : "bg-hunter-card text-muted-foreground"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className={cn("font-semibold text-sm", selected ? "text-indigo-400" : "text-foreground")}>
                            {opt.labelVI}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{opt.label}</div>
                          <div className="text-xs text-muted-foreground/70 mt-1">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-base font-semibold text-foreground mb-1">Khách hàng / Client</h2>
                <p className="text-sm text-muted-foreground mb-6">Chọn khách hàng và dự án liên quan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Khách hàng / Client</Label>
                    <select
                      value={clientId}
                      onChange={(e) => selectClient(e.target.value)}
                      className="w-full h-9 rounded-md border border-hunter-border bg-hunter-elevated text-sm text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">— Select client —</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.company ?? c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className={labelCls}>Dự án / Project (optional)</Label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full h-9 rounded-md border border-hunter-border bg-hunter-elevated text-sm text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">— Select project —</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                  </div>

                  {(type === "INVOICE" || type === "LIQUIDATION") && (
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className={labelCls}>Số hợp đồng gốc / Reference Contract No.</Label>
                      <Input
                        className={inputCls}
                        placeholder="HĐ-2026-001"
                        value={contractNumber}
                        onChange={(e) => setContractNumber(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-1">Chi tiết / Details</h2>
                  <p className="text-sm text-muted-foreground">Điền đầy đủ thông tin tài liệu</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {type === "CONTRACT" && (
                    <>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Số hợp đồng / Contract No. *</Label>
                        <Input className={inputCls} placeholder="HĐ-2026-001" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Ngày ký / Sign Date *</Label>
                        <Input type="date" className={inputCls} value={signDate} onChange={(e) => setSignDate(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Ngày bắt đầu / Start Date *</Label>
                        <Input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Ngày kết thúc / End Date *</Label>
                        <Input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                      </div>
                    </>
                  )}

                  {type === "LIQUIDATION" && (
                    <>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Số hợp đồng / Contract No. *</Label>
                        <Input className={inputCls} placeholder="HĐ-2026-001" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Ngày ký HĐ / Original Sign Date *</Label>
                        <Input type="date" className={inputCls} value={signDate} onChange={(e) => setSignDate(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Ngày thanh lý / Liquidation Date *</Label>
                        <Input type="date" className={inputCls} value={liquidationDate} onChange={(e) => setLiquidationDate(e.target.value)} />
                      </div>
                    </>
                  )}

                  {type === "INVOICE" && (
                    <>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Số hóa đơn / Invoice No. *</Label>
                        <Input className={inputCls} placeholder="INV-2026-001" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={labelCls}>Ngày hóa đơn / Invoice Date *</Label>
                        <Input type="date" className={inputCls} value={signDate} onChange={(e) => setSignDate(e.target.value)} />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Thông tin khách hàng / Client Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(["company", "representative", "position", "address", "taxCode", "phone"] as (keyof ClientInfo)[]).map((field) => (
                      <div key={field} className={cn("space-y-1.5", field === "address" && "sm:col-span-2")}>
                        <Label className={labelCls}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                        <Input
                          className={inputCls}
                          value={clientInfo[field]}
                          onChange={(e) => patchClientInfo(field, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {type !== "INVOICE" && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground">Sản phẩm bàn giao / Deliverables</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addScopeItem} className="gap-1 h-7 text-xs border-hunter-border">
                        <Plus className="w-3 h-3" /> Add Row
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {scopeItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}.</span>
                          <Input
                            className={cn(inputCls, "flex-1")}
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => patchScopeItem(i, "description", e.target.value)}
                          />
                          <Input
                            className={cn(inputCls, "w-20")}
                            type="number"
                            min={1}
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => patchScopeItem(i, "quantity", Number(e.target.value))}
                          />
                          <button
                            type="button"
                            onClick={() => removeScopeItem(i)}
                            disabled={scopeItems.length === 1}
                            className="text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <Label className={labelCls}>Tổng giá trị / Total Amount (USD) *</Label>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        className={cn(inputCls, "w-40")}
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                {type === "INVOICE" && (
                  <div className="space-y-4">

                    {/* Project Prefix */}
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Tên dự án / Project Prefix (tự ghép vào tên view)</Label>
                      <Input
                        className={inputCls}
                        placeholder="VD: VM Park"
                        value={projectPrefix}
                        onChange={(e) => setProjectPrefix(e.target.value)}
                      />
                    </div>

                    {/* Quick-add service type buttons */}
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Thêm nhanh / Quick Add</Label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((svcType) => {
                          const meta = SERVICE_TYPE_LABELS[svcType];
                          return (
                            <button
                              key={svcType}
                              type="button"
                              onClick={() => quickAddServiceType(svcType)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hunter-border bg-hunter-elevated hover:border-[#E8521A] hover:text-[#E8521A] transition-colors text-xs font-medium text-foreground"
                            >
                              <Plus className="w-3 h-3" />
                              {meta.vi}
                              {meta.defaultPrice > 0 && (
                                <span className="text-muted-foreground ml-0.5">${meta.defaultPrice}</span>
                              )}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={addLineItem}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-hunter-border hover:border-indigo-500 hover:text-indigo-400 transition-colors text-xs font-medium text-muted-foreground"
                        >
                          <Plus className="w-3 h-3" /> Dòng trống
                        </button>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-1">
                      <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground px-1 mb-1">
                        <span className="col-span-1">Loại</span>
                        <span className="col-span-4">Tên view / Item</span>
                        <span className="col-span-2">Mô tả</span>
                        <span className="col-span-1 text-center">SL</span>
                        <span className="col-span-2 text-right">Đơn giá</span>
                        <span className="col-span-1 text-right">Tổng</span>
                        <span className="col-span-1" />
                      </div>

                      {lineItems.map((item, i) => (
                        <div key={i} className="rounded-lg border border-hunter-border bg-hunter-elevated/40 p-2 space-y-1.5">
                          {/* Service type chips */}
                          <div className="flex flex-wrap gap-1">
                            {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((svcType) => {
                              const meta = SERVICE_TYPE_LABELS[svcType];
                              const active = item.serviceType === svcType;
                              return (
                                <button
                                  key={svcType}
                                  type="button"
                                  onClick={() => applyServiceType(i, svcType)}
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors",
                                    active
                                      ? "bg-[#E8521A] text-white border-[#E8521A]"
                                      : "border-hunter-border text-muted-foreground hover:border-[#E8521A] hover:text-[#E8521A]"
                                  )}
                                >
                                  {meta.vi}
                                </button>
                              );
                            })}
                          </div>
                          {/* Row inputs */}
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <Input
                              className={cn(inputCls, "col-span-5")}
                              placeholder={projectPrefix ? `${projectPrefix} - tên view` : "Tên view / Item name"}
                              value={item.item}
                              onChange={(e) => patchLineItem(i, "item", e.target.value)}
                            />
                            <Input
                              className={cn(inputCls, "col-span-2")}
                              placeholder="Mô tả"
                              value={item.description}
                              onChange={(e) => patchLineItem(i, "description", e.target.value)}
                            />
                            <Input
                              className={cn(inputCls, "col-span-1")}
                              type="number" min={1}
                              value={item.qty}
                              onChange={(e) => patchLineItem(i, "qty", Number(e.target.value))}
                            />
                            <Input
                              className={cn(inputCls, "col-span-2")}
                              type="number" min={0} step={50}
                              value={item.unitPrice}
                              onChange={(e) => patchLineItem(i, "unitPrice", Number(e.target.value))}
                            />
                            <div className="col-span-1 text-right text-xs font-medium text-foreground pr-1">
                              {'$'}{(item.qty * item.unitPrice).toLocaleString()}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLineItem(i)}
                              disabled={lineItems.length === 1}
                              className="col-span-1 flex justify-center text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between rounded-lg bg-[#E8521A]/10 border border-[#E8521A]/30 px-4 py-2.5">
                      <span className="text-sm text-muted-foreground">{lineItems.length} hạng mục</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <span className="text-base font-bold text-[#E8521A]">${totalAmount.toLocaleString()} USD</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Ghi chú / Notes</Label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded-md border border-hunter-border bg-hunter-elevated text-sm text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Xem trước / Preview</h2>
                <div className="overflow-auto max-h-[65vh] rounded-lg border border-hunter-border bg-white">
                  {type === "CONTRACT" && signDate && startDate && endDate && (
                    <ContractTemplate
                      contractNumber={contractNumber}
                      signDate={signDate}
                      startDate={startDate}
                      endDate={endDate}
                      clientInfo={clientInfo}
                      scopeItems={scopeItems}
                      totalAmount={totalAmount}
                    />
                  )}
                  {type === "LIQUIDATION" && signDate && liquidationDate && (
                    <LiquidationTemplate
                      contractNumber={contractNumber}
                      signDate={signDate}
                      liquidationDate={liquidationDate}
                      clientInfo={clientInfo}
                      scopeItems={scopeItems}
                      totalAmount={totalAmount}
                    />
                  )}
                  {type === "INVOICE" && signDate && (
                    <InvoiceTemplate
                      contractNumber={contractNumber}
                      signDate={signDate}
                      clientInfo={clientInfo}
                      lineItems={lineItems}
                      totalAmount={totalAmount}
                      notes={notes || undefined}
                    />
                  )}
                  {!(signDate) && (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                      Please complete the details step to preview the document.
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-500/15 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-indigo-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-base font-semibold text-foreground mb-1">Ready to save</h2>
                  <p className="text-sm text-muted-foreground">
                    {type} · {contractNumber || "No number"} · {totalAmount.toLocaleString()} USD
                  </p>
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2">{error}</p>
                )}
                <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-32">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? "Saving..." : "Save Document"}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="gap-2 border-hunter-border"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        {step < STEPS.length - 1 && (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
                              {'$'}{(item.qty * item.unitPrice).toLocaleString()}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLineItem(i)}
                              disabled={lineItems.length === 1}
                              className="col-span-1 flex justify-center text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between rounded-lg bg-[#E8521A]/10 border border-[#E8521A]/30 px-4 py-2.5">
                      <span className="text-sm text-muted-foreground">{lineItems.length} hang muc</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <span className="text-base font-bold text-[#E8521A]">${totalAmount.toLocaleString()} USD</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <Label className={labelCls}>Ghi chu / Notes</Label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded-md border border-hunter-border bg-hunter-elevated text-sm text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Xem truoc / Preview</h2>
                <div className="overflow-auto max-h-[65vh] rounded-lg border border-hunter-border bg-white">
                  {type === "CONTRACT" && signDate && startDate && endDate && (
                    <ContractTemplate
                      contractNumber={contractNumber}
                      signDate={signDate}
                      startDate={startDate}
                      endDate={endDate}
                      clientInfo={clientInfo}
                      scopeItems={scopeItems}
                      totalAmount={totalAmount}
                    />
                  )}
                  {type === "LIQUIDATION" && signDate && liquidationDate && (
                    <LiquidationTemplate
                      contractNumber={contractNumber}
                      signDate={signDate}
                      liquidationDate={liquidationDate}
                      clientInfo={clientInfo}
                      scopeItems={scopeItems}
                      totalAmount={totalAmount}
                    />
                  )}
                  {type === "INVOICE" && signDate && (
                    <InvoiceTemplate
                      contractNumber={contractNumber}
                      signDate={signDate}
                      clientInfo={clientInfo}
                      lineItems={lineItems}
                      totalAmount={totalAmount}
                      notes={notes || undefined}
                    />
                  )}
                  {!(signDate) && (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                      Please complete the details step to preview the document.
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-500/15 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-indigo-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-base font-semibold text-foreground mb-1">Ready to save</h2>
                  <p className="text-sm text-muted-foreground">
                    {type} · {contractNumber || "No number"} · {totalAmount.toLocaleString()} USD
                  </p>
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2">{error}</p>
                )}
                <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-32">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? "Saving..." : "Save Document"}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="gap-2 border-hunter-border"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        {step < STEPS.length - 1 && (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
