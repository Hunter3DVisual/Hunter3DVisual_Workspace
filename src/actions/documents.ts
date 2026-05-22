"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import type { CreateDocumentInput } from "@/types/documents";

const docDb = db as any;

export async function getDocuments(filters?: { type?: string; status?: string }) {
  return docDb.document.findMany({
    where: {
      ...(filters?.type && { type: filters.type as any }),
      ...(filters?.status && { status: filters.status as any }),
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
      project: { select: { id: true, name: true, code: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocumentById(id: string) {
  return docDb.document.findUnique({
    where: { id },
    include: {
      client: true,
      project: true,
    },
  });
}

export async function createDocument(input: CreateDocumentInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return docDb.document.create({
    data: {
      type: input.type,
      contractNumber: input.contractNumber,
      signDate: input.signDate,
      startDate: input.startDate,
      endDate: input.endDate,
      clientId: input.clientId,
      projectId: input.projectId,
      clientInfo: input.clientInfo as any,
      scopeItems: input.scopeItems as any,
      lineItems: input.lineItems as any,
      totalAmount: input.totalAmount ?? 0,
      currency: input.currency ?? "USD",
      status: input.status ?? "DRAFT",
      notes: input.notes,
    },
  });
}

export async function updateDocument(id: string, input: Partial<CreateDocumentInput>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return docDb.document.update({
    where: { id },
    data: {
      ...(input.type !== undefined && { type: input.type }),
      ...(input.contractNumber !== undefined && { contractNumber: input.contractNumber }),
      ...(input.signDate !== undefined && { signDate: input.signDate }),
      ...(input.startDate !== undefined && { startDate: input.startDate }),
      ...(input.endDate !== undefined && { endDate: input.endDate }),
      ...(input.clientId !== undefined && { clientId: input.clientId }),
      ...(input.projectId !== undefined && { projectId: input.projectId }),
      ...(input.clientInfo !== undefined && { clientInfo: input.clientInfo as any }),
      ...(input.scopeItems !== undefined && { scopeItems: input.scopeItems as any }),
      ...(input.lineItems !== undefined && { lineItems: input.lineItems as any }),
      ...(input.totalAmount !== undefined && { totalAmount: input.totalAmount }),
      ...(input.currency !== undefined && { currency: input.currency }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.notes !== undefined && { notes: input.notes }),
    },
  });
}

export async function deleteDocument(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return docDb.document.delete({ where: { id } });
}

export async function duplicateDocument(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const original = await docDb.document.findUnique({ where: { id } });
  if (!original) throw new Error("Document not found");

  return docDb.document.create({
    data: {
      type: original.type,
      contractNumber: original.contractNumber ? `${original.contractNumber}-COPY` : undefined,
      signDate: original.signDate,
      startDate: original.startDate,
      endDate: original.endDate,
      clientId: original.clientId,
      projectId: original.projectId,
      clientInfo: original.clientInfo as any,
      scopeItems: original.scopeItems as any,
      lineItems: original.lineItems as any,
      totalAmount: original.totalAmount,
      currency: original.currency,
      status: "DRAFT",
      notes: original.notes,
    },
  });
}
