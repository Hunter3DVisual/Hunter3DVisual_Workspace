"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import type { PipelineFilters, UpdateStageProgressInput } from "@/types/pipeline";
import { StageStatus } from "@/types/pipeline";

export async function getPipeline(filters: PipelineFilters = {}) {
  const { projectId } = filters;

  return db.project.findMany({
    where: {
      ...(projectId && { id: projectId }),
    },
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      progress: true,
      client: { select: { name: true } },
      _count: { select: { tasks: true } },
      pipeline: { orderBy: { order: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPipelineByProject(projectId: string) {
  return db.pipelineStage.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
}

export async function updateStageProgress(input: UpdateStageProgressInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { id, progress, status } = input;

  const derivedStatus =
    progress === 100
      ? StageStatus.COMPLETED
      : progress > 0
        ? StageStatus.IN_PROGRESS
        : StageStatus.PENDING;

  return db.pipelineStage.update({
    where: { id },
    data: {
      progress,
      status: status ?? derivedStatus,
      ...(progress === 100 ? { completedAt: new Date() } : {}),
      ...(progress > 0 && !status ? { startedAt: new Date() } : {}),
    },
  });
}
