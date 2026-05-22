import type { Project, Client, ProjectStatus } from "@prisma/client";

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

export type ProjectViewMode = "grid" | "list";
