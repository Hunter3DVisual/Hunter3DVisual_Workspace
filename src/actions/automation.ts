"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import type { AutomationFilters, CreateAutomationInput } from "@/types/automation";
import { AutomationStatus } from "@/types/automation";

export async function getAutomations(filters: AutomationFilters = {}) {
  const { status } = filters;

  return db.automation.findMany({
    where: {
      ...(status === AutomationStatus.ACTIVE && { isActive: true }),
      ...(status === AutomationStatus.INACTIVE && { isActive: false }),
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createAutomation(input: CreateAutomationInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name, description, trigger, action, conditions, payload } = input;

  return db.automation.create({
    data: { name, description, trigger, action, conditions: conditions as any, payload: payload as any },
  });
}

export async function toggleAutomation(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const automation = await db.automation.findUniqueOrThrow({ where: { id } });

  return db.automation.update({
    where: { id },
    data: { isActive: !automation.isActive },
  });
}

export async function runAutomation(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const run = await db.automationRun.create({
    data: {
      automationId: id,
      status: "success",
      output: { message: "Manually triggered" },
    },
  });

  await db.automation.update({
    where: { id },
    data: {
      runCount: { increment: 1 },
      lastRunAt: new Date(),
    },
  });

  return run;
}
