import type { Project, Client, Task, PipelineStage, User, InvoiceStatus, ProjectStatus } from "@prisma/client";

export type { ProjectStatus };

export type ProjectWithClient = Project & {
  client: Client | null;
  _count: { tasks: number; assets: number };
};

export type CreateProjectInput = {
  name: string;
  clientId?: string;
  description?: string;
  deadline?: Date;
  budget?: number;
  currency?: string;
  tags?: string[];
};

export type ProjectFilters = {
  search?: string;
  status?: ProjectStatus;
  clientId?: string;
  sortBy?: "name" | "createdAt" | "deadline" | "progress";
  sortDir?: "asc" | "desc";
};

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  status?: ProjectStatus;
  progress?: number;
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
