"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { generateProjectCode } from "@/lib/utils";
import type { ProjectStatus } from "@prisma/client";
import type { CreateProjectInput, UpdateProjectInput, ProjectFilters } from "@/types/projects";

/**
 * Get the DB User row for the current Clerk session, creating it on first sign-in.
 * The User model requires clerkId + email + name. We upsert so there's never a
 * "User not found" hard failure — no Clerk webhook sync needed.
 */
async function requireDbUser(userId: string) {
  const existing = await db.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  // First time this user hits a write action — seed from Clerk profile
  const clerk = await currentUser();
  return db.user.create({
    data: {
      clerkId: userId,
      email:   clerk?.emailAddresses[0]?.emailAddress ?? `${userId}@noreply.local`,
      name:    [clerk?.firstName, clerk?.lastName].filter(Boolean).join(" ") || "Studio Owner",
      avatar:  clerk?.imageUrl ?? undefined,
    },
  });
}

export async function getProjects(filters: ProjectFilters = {}) {
  const { search, status, clientId, sortBy = "createdAt", sortDir = "desc" } = filters;

  return db.project.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(status && { status }),
      ...(clientId && { clientId }),
    },
    include: {
      client: true,
      _count: { select: { tasks: true, assets: true } },
    },
    orderBy: { [sortBy]: sortDir } as any,
  });
}

export async function createProject(input: CreateProjectInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await requireDbUser(userId);

  return db.project.create({
    data: {
      name:        input.name,
      code:        generateProjectCode(input.name),
      ownerId:     user.id,
      clientId:    input.clientId    || undefined,
      description: input.description || undefined,
      deadline:    input.deadline    ? new Date(input.deadline) : undefined,
      budget:      input.budget,
      currency:    input.currency    || "USD",
    },
    include: { client: true },
  });
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.project.update({
    where: { id },
    data: { status },
  });
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.project.update({
    where: { id },
    data: {
      ...(input.name        !== undefined && { name:        input.name }),
      ...(input.clientId    !== undefined && { clientId:    input.clientId    ?? undefined }),
      ...(input.description !== undefined && { description: input.description ?? null }),
      ...(input.deadline    !== undefined && { deadline:    input.deadline    ? new Date(input.deadline) : null }),
      ...(input.budget      !== undefined && { budget:      input.budget }),
      ...(input.currency    !== undefined && { currency:    input.currency }),
      ...(input.status      !== undefined && { status:      input.status }),
      ...(input.progress    !== undefined && { progress:    input.progress }),
    },
    include: { client: true },
  });
}

export async function deleteProject(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.project.delete({ where: { id } });
}

export async function getProjectById(id: string) {
  return db.project.findUnique({
    where: { id },
    include: {
      client: true,
      tasks: {
        where: { status: { not: "CANCELLED" } },
        orderBy: { order: "asc" },
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
        },
      },
      pipeline: { orderBy: { order: "asc" } },
      invoices: {
        select: {
          id: true,
          number: true,
          status: true,
          total: true,
          currency: true,
          dueDate: true,
          issueDate: true,
        },
        orderBy: { issueDate: "desc" },
        take: 10,
      },
      _count: { select: { tasks: true, assets: true, renders: true } },
    },
  });
}
