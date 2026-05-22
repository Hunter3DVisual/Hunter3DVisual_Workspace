import type { Invoice, InvoiceStatus } from "@prisma/client";

export type { InvoiceStatus };

export type InvoiceWithClient = Invoice & {
  client: { id: string; name: string; company: string | null };
  project: { id: string; name: string; code: string } | null;
};

export type FinanceStats = {
  revenue: number;
  expenses: number;
  profit: number;
  pendingAmount: number;
  pendingCount: number;
};

export type Transaction = {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: Date;
  invoiceNumber?: string;
  clientName?: string;
};

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type CreateInvoiceInput = {
  number: string;
  clientId: string;
  projectId?: string;
  dueDate: Date;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  currency?: string;
  notes?: string;
  terms?: string;
  items: InvoiceLineItem[];
};

export type InvoiceFilters = {
  status?: InvoiceStatus;
  search?: string;
  clientId?: string;
};
