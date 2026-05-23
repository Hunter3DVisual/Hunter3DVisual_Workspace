export type DocumentType = "CONTRACT" | "LIQUIDATION" | "INVOICE";
export type DocumentStatus = "DRAFT" | "SENT" | "SIGNED" | "PAID";

export interface ScopeItem {
  description: string;
  quantity: number;
}

export type ServiceType =
  | "EXTERIOR"
  | "INTERIOR"
  | "IMAGE_360"
  | "TOUR_360"
  | "ANIMATION"
  | "MODEL_3D"
  | "CUSTOM";

export const SERVICE_TYPE_LABELS: Record<ServiceType, { en: string; vi: string; defaultPrice: number }> = {
  EXTERIOR:  { en: "Exterior Render", vi: "Ngoai that",  defaultPrice: 400 },
  INTERIOR:  { en: "Interior Render", vi: "Noi that",    defaultPrice: 150 },
  IMAGE_360: { en: "360 Image",       vi: "Anh 360",     defaultPrice: 500 },
  TOUR_360:  { en: "360 Tour",        vi: "Tour 360",    defaultPrice: 500 },
  ANIMATION: { en: "Animation",       vi: "Animation",   defaultPrice: 800 },
  MODEL_3D:  { en: "3D Model",        vi: "Model 3D",    defaultPrice: 600 },
  CUSTOM:    { en: "Custom",          vi: "Khac",        defaultPrice: 0   },
};

export interface LineItem {
  item: string;
  description: string;
  qty: number;
  unitPrice: number;
  serviceType?: ServiceType;
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
