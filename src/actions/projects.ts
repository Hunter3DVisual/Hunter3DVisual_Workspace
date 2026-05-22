"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { generateProjectCode } from "@/lib/utils";
import type { ProjectStatus } from "@prisma/client";
import type { CreateProjectInput, ProjectFilters } from "@/types/projects";

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

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  return db.project.create({
    data: {
      ...input,
      code: generateProjectCode(input.name),
      ownerId: user.id,
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
