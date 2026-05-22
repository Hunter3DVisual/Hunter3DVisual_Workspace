import type { Task, TaskStatus, TaskPriority } from "@prisma/client";

export type { TaskStatus, TaskPriority };

export type TaskWithRelations = Task & {
  project: { id: string; name: string; code: string } | null;
  assignee: { id: string; name: string; avatar: string | null } | null;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  dueDate?: Date;
  estimateHrs?: number;
  tags?: string[];
};

export type TaskFilters = {
  search?: string;
  projectId?: string;
  assigneeId?: string;
  priority?: TaskPriority;
};
