"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import type { TaskStatus } from "@prisma/client";
import type { CreateTaskInput, TaskFilters } from "@/types/tasks";

export async function getTasks(filters: TaskFilters = {}) {
  const { search, projectId, assigneeId, priority } = filters;

  return db.task.findMany({
    where: {
      ...(search && {
        title: { contains: search, mode: "insensitive" },
      }),
      ...(projectId && { projectId }),
      ...(assigneeId && { assigneeId }),
      ...(priority && { priority }),
    },
    include: {
      project: { select: { id: true, name: true, code: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTask(input: CreateTaskInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.task.create({
    data: { ...input },
    include: {
      project: { select: { id: true, name: true, code: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
    },
  });
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.task.update({
    where: { id },
    data: {
      status,
      ...(status === "DONE" ? { completedAt: new Date() } : { completedAt: null }),
    },
  });
}

export async function updateTask(id: string, input: Partial<CreateTaskInput> & { status?: TaskStatus }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { status, ...rest } = input;

  return db.task.update({
    where: { id },
    data: {
      ...rest,
      ...(status !== undefined && {
        status,
        ...(status === "DONE" ? { completedAt: new Date() } : { completedAt: null }),
      }),
    },
    include: {
      project: { select: { id: true, name: true, code: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
    },
  });
}

export async function deleteTask(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.task.delete({ where: { id } });
}

export async function getProjectsForTaskSelect() {
  return db.project.findMany({
    select: { id: true, name: true, code: true },
    where: { status: { notIn: ["ARCHIVED"] } },
    orderBy: { name: "asc" },
  });
}

export async function getMembersForTaskSelect() {
  return db.user.findMany({
    select: { id: true, name: true, avatar: true },
    orderBy: { name: "asc" },
  });
}
