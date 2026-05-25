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
  category?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type BankingInfo = {
  // Receiving Bank
  bankName: string;
  bankAddress: string;
  bankPostalCode: string;
  // Account Holder
  accountName: string;
  accountNumber: string;
  swift: string;
  currency: string;
  holderAddress: string;
  holderCity: string;
  holderPostalCode: string;
};

export type CreateInvoiceInput = {
  number:      string;
  contractRef: string | null;
  clientId:    string;
  projectId:   string | null;
  dueDate:     string;      // ISO string "YYYY-MM-DD" — safe for server action serialization
  subtotal:    number;
  tax:         number;
  discount:    number;
  total:       number;
  currency:    string;
  notes:       string | null;
  terms:       string | null;
  items:       InvoiceLineItem[];
};

export type InvoiceFilters = {
  status?: InvoiceStatus;
  search?: string;
  clientId?: string;
};
