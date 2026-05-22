import type {
  Project,
  Client,
  Task,
  Invoice,
  Quote,
  Asset,
  User,
  Automation,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  InvoiceStatus,
  QuoteStatus,
  ClientStatus,
  AssetCategory,
} from "@prisma/client";

// Re-export Prisma types
export type {
  Project,
  Client,
  Task,
  Invoice,
  Quote,
  Asset,
  User,
  Automation,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  InvoiceStatus,
  QuoteStatus,
  ClientStatus,
  AssetCategory,
};

// Enriched types
export type ProjectWithClient = Project & {
  client: Client | null;
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
  _count: { tasks: number };
};

export type ProjectFull = Project & {
  client: Client | null;
  tasks: Task[];
  _count: { tasks: number; assets: number; renders: number };
};

export type TaskWithProject = Task & {
  project: Project | null;
  assignee: User | null;
};

export type InvoiceWithClient = Invoice & {
  client: Client;
  project: Project | null;
};

// Dashboard stats
export interface DashboardStats {
  totalRevenue: number;
  activeProjects: number;
  pendingTasks: number;
  teamMembers: number;
  revenueChange: number;
  projectsChange: number;
  tasksChange: number;
}

// Nav items
export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

// API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter/sort params
export interface ProjectFilters {
  status?: ProjectStatus;
  clientId?: string;
  search?: string;
  sortBy?: "name" | "createdAt" | "deadline" | "progress";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  search?: string;
  dueDate?: "today" | "week" | "overdue";
}

// Chart data
export interface RevenueChartData {
  month: string;
  revenue: number;
  invoiced: number;
}

export interface PipelineChartData {
  stage: string;
  count: number;
  color: string;
}
