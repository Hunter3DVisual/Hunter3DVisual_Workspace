"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import type { CreateClientInput, UpdateClientInput, ClientFilters, ClientSelectOption } from "@/types/clients";

export async function getClients(filters: ClientFilters = {}) {
  const { search, status, sortBy = "createdAt", sortDir = "desc" } = filters;

  return db.client.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
    },
    include: {
      _count: { select: { projects: true } },
      invoices: { select: { total: true } },
    },
    orderBy: { [sortBy]: sortDir } as any,
  });
}

export async function createClient(input: CreateClientInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.client.create({ data: input });
}

export async function getClientsForSelect(): Promise<ClientSelectOption[]> {
  return db.client.findMany({
    select: { id: true, name: true, company: true },
    where: { status: { not: "ARCHIVED" } },
    orderBy: { name: "asc" },
  });
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.client.update({ where: { id }, data: input });
}

export async function deleteClient(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.client.delete({ where: { id } });
}

export async function getClientById(id: string) {
  return db.client.findUnique({
    where: { id },
    include: {
      projects: { include: { _count: { select: { tasks: true } } } },
      invoices: true,
      contacts: true,
      _count: { select: { projects: true } },
    },
  });
}
