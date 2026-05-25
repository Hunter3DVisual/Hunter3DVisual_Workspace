import type { Client, ClientStatus, Project, Invoice, Contact } from "@prisma/client";

export type { ClientStatus };

export type ClientWithStats = Client & {
  _count: { projects: number };
  invoices: { total: number }[];
};

export type CreateClientInput = {
  name:           string;
  company?:       string;
  email:          string;
  phone?:         string;
  whatsapp?:      string;
  status?:        ClientStatus;
  country?:       string;
  city?:          string;
  address?:       string;
  website?:       string;
  taxCode?:       string;
  representative?: string;
  position?:      string;
  notes?:         string;
  tags?:          string[];
};

export type UpdateClientInput = Partial<CreateClientInput>;

export type ClientSelectOption = {
  id:      string;
  name:    string;
  company: string | null;
};

export type ClientDetail = Client & {
  projects:  (Project & { _count: { tasks: number } })[];
  invoices:  Invoice[];
  contacts:  Contact[];
  _count:    { projects: number };
};

export type ClientFilters = {
  search?:  string;
  status?:  ClientStatus;
  sortBy?:  "name" | "createdAt" | "company";
  sortDir?: "asc" | "desc";
};
