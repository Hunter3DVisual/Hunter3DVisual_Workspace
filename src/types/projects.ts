import type { Project, Client, Task, PipelineStage, User, InvoiceStatus, ProjectStatus } from "@prisma/client";

export type { ProjectStatus };

export type ProjectWithClient = Project & {
  client: Client | null;
  _count: { tasks: number; assets: number };
};

export type CreateProjectInput = {
  name:        string;
  clientId?:   string;
  description: string | null;   // null = explicitly clear the field
  deadline:    string | null;   // ISO string "YYYY-MM-DD" or null
  budget?:     number;
  currency?:   string;
  tags?:       string[];
};

export type ProjectFilters = {
  search?:   string;
  status?:   ProjectStatus;
  clientId?: string;
  sortBy?:   "name" | "createdAt" | "deadline" | "progress";
  sortDir?:  "asc" | "desc";
};

export type UpdateProjectInput = {
  name?:        string;
  clientId?:    string | null;
  description?: string | null;  // null = explicitly clear
  deadline?:    string | null;  // ISO string or null
  budget?:      number;
  currency?:    string;
  status?:      ProjectStatus;
  progress?:    number;
};

export type ProjectDetail = Project & {
  client: Client | null;
  tasks: (Task & {
    assignee: Pick<User, "id" | "name" | "avatar"> | null;
  })[];
  pipeline: PipelineStage[];
  invoices: {
    id: string;
    number: string;
    status: InvoiceStatus;
    total: number;
    currency: string;
    dueDate: Date;
    issueDate: Date;
  }[];
  _count: { tasks: number; assets: number; renders: number };
};

export type ProjectViewMode = "grid" | "list";
