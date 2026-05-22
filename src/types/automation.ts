import type { Automation as PrismaAutomation, AutomationRun } from "@prisma/client";

export type { PrismaAutomation, AutomationRun };

export enum TriggerType {
  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_STATUS_CHANGED = "PROJECT_STATUS_CHANGED",
  TASK_COMPLETED = "TASK_COMPLETED",
  INVOICE_PAID = "INVOICE_PAID",
  INVOICE_OVERDUE = "INVOICE_OVERDUE",
  QUOTE_ACCEPTED = "QUOTE_ACCEPTED",
  CLIENT_CREATED = "CLIENT_CREATED",
  DEADLINE_APPROACHING = "DEADLINE_APPROACHING",
}

export enum ActionType {
  SEND_EMAIL = "SEND_EMAIL",
  CREATE_TASK = "CREATE_TASK",
  UPDATE_STATUS = "UPDATE_STATUS",
  SEND_NOTIFICATION = "SEND_NOTIFICATION",
  WEBHOOK = "WEBHOOK",
}

export enum AutomationStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type Automation = {
  id: string;
  name: string;
  description: string | null;
  trigger: TriggerType;
  action: ActionType;
  conditions: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  isActive: boolean;
  runCount: number;
  lastRunAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAutomationInput = {
  name: string;
  description?: string;
  trigger: TriggerType;
  action: ActionType;
  conditions?: Record<string, unknown>;
  payload?: Record<string, unknown>;
};

export type AutomationFilters = {
  status?: AutomationStatus;
};
