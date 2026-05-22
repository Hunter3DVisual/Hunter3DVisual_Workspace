import type { Client, ClientStatus } from "@prisma/client";

export type { ClientStatus };

export type ClientWithStats = Client & {
  _count: { projects: number };
  invoices: { total: number }[];
};

export type CreateClientInput = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  notes?: string;
  tags?: string[];
};

export type ClientFilters = {
  search?: string;
  status?: ClientStatus;
  sortBy?: "name" | "createdAt" | "company";
  sortDir?: "asc" | "desc";
};
