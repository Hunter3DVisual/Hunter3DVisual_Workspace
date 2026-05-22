import type { PipelineStage } from "@prisma/client";

export type { PipelineStage };

export enum StageStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  BLOCKED = "blocked",
}

export type ProjectPipeline = {
  id: string;
  name: string;
  code: string;
  status: string;
  progress: number;
  client: { name: string } | null;
  _count: { tasks: number };
  pipeline: PipelineStage[];
};

export type UpdateStageProgressInput = {
  id: string;
  progress: number;
  status?: StageStatus;
};

export type PipelineFilters = {
  projectId?: string;
};
