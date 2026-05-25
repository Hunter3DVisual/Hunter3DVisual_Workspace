"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import type { InvoiceFilters, CreateInvoiceInput, Transaction } from "@/types/finance";

export async function getProjectsForSelect() {
  return db.project.findMany({
    select: { id: true, name: true, code: true },
    orderBy: { name: "asc" },
  });
}

export async function getFinanceStats() {
  const [paidAgg, pendingInvoices] = await Promise.all([
    db.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { total: true },
    }),
    db.invoice.findMany({
      where: { status: { in: ["SENT", "VIEWED", "PARTIAL", "OVERDUE"] } },
      select: { total: true },
    }),
  ]);

  const revenue = paidAgg._sum.total ?? 0;
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return {
    revenue,
    expenses: 0,
    profit: revenue,
    pendingAmount,
    pendingCount: pendingInvoices.length,
  };
}

export async function getRecentTransactions(): Promise<Transaction[]> {
  const invoices = await db.invoice.findMany({
    where: { status: { in: ["PAID", "PARTIAL"] } },
    include: { client: { select: { name: true } } },
    orderBy: { paidAt: "desc" },
    take: 10,
  });

  return invoices.map((inv) => ({
    id: inv.id,
    type: "income" as const,
    description: "Invoice " + inv.number,
    amount: inv.total,
    date: inv.paidAt ?? inv.updatedAt,
    invoiceNumber: inv.number,
    clientName: inv.client.name,
  }));
}

export async function getInvoices(filters: InvoiceFilters = {}) {
  const { status, search, clientId } = filters;

  return db.invoice.findMany({
    where: {
      ...(status && { status }),
      ...(clientId && { clientId }),
      ...(search && {
        OR: [
          { number: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    },
    include: {
      client: { select: { id: true, name: true, company: true } },
      project: { select: { id: true, name: true, code: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInvoice(
  input: CreateInvoiceInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  const { number, contractRef, clientId, projectId, dueDate, subtotal, tax, discount, total, currency, notes, terms, items } = input;

  try {
    const invoice = await db.invoice.create({
      data: {
        number,
        contractRef:  contractRef  ?? undefined,
        clientId,
        projectId:    projectId    ?? undefined,
        dueDate:      new Date(dueDate),
        subtotal,
        tax:          tax          ?? 0,
        discount:     discount     ?? 0,
        total,
        currency:     currency     || "USD",
        notes:        notes        ?? undefined,
        terms:        terms        ?? undefined,
        items,
      },
    });
    return { ok: true, id: invoice.id };
  } catch (e: any) {
    // Return real error details instead of throwing — bypasses Next.js production sanitization
    const detail = [e?.code, e?.meta?.target, e?.message]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 400);
    console.error("[createInvoice] Prisma error:", e?.code, e?.message);
    return { ok: false, error: detail };
  }
}

export async function getInvoiceById(id: string) {
  return db.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      project: { select: { id: true, name: true, code: true } },
    },
  });
}

export async function deleteInvoice(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return db.invoice.delete({ where: { id } });
}

export async function updateInvoiceStatus(id: string, status: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.invoice.update({
    where: { id },
    data: {
      status: status as any,
      ...(status === "PAID" ? { paidAt: new Date() } : {}),
    },
  });
}

export async function updateInvoice(
  id: string,
  input: CreateInvoiceInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  const {
    contractRef, clientId, projectId, dueDate,
    subtotal, tax, discount, total, currency,
    notes, terms, items,
  } = input;

  try {
    await db.invoice.update({
      where: { id },
      data: {
        // number is intentionally omitted — invoice numbers never change after creation
        contractRef: contractRef ?? undefined,  // null clears, undefined = skip
        clientId,
        projectId:   projectId  ?? undefined,  // null clears project link
        dueDate:     new Date(dueDate),
        subtotal,
        tax:         tax        ?? 0,
        discount:    discount   ?? 0,
        total,
        currency:    currency   || "USD",
        notes:       notes      ?? undefined,  // null clears notes
        terms:       terms      ?? undefined,  // null clears terms
        items:       items as any,
      },
    });
    return { ok: true };
  } catch (e: any) {
    // Return real error details instead of throwing — bypasses Next.js production sanitization
    const detail = [e?.code, e?.meta?.target, e?.message]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 400);
    console.error("[updateInvoice] Prisma error:", e?.code, e?.message);
    return { ok: false, error: detail };
  }
}
