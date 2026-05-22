export type DocumentType = "CONTRACT" | "LIQUIDATION" | "INVOICE";
export type DocumentStatus = "DRAFT" | "SENT" | "SIGNED" | "PAID";

export interface ScopeItem {
  description: string;
  quantity: number;
}

export interface LineItem {
  item: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface ClientInfo {
  name: string;
  company: string;
  address: string;
  representative: string;
  position: string;
  taxCode: string;
  phone: string;
}

export interface CreateDocumentInput {
  type: DocumentType;
  contractNumber?: string;
  signDate?: Date;
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  projectId?: string;
  clientInfo?: ClientInfo;
  scopeItems?: ScopeItem[];
  lineItems?: LineItem[];
  totalAmount?: number;
  currency?: string;
  status?: DocumentStatus;
  notes?: string;
}
