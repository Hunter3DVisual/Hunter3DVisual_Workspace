"use server";

import { db } from "@/lib/db";
import { startOfMonth, subMonths, format } from "date-fns";
import type { DashboardStats, RevenueChartData } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const thisQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const lastQuarterStart = new Date(thisQuarterStart.getFullYear(), thisQuarterStart.getMonth() - 3, 1);
  const monthAgo = subMonths(now, 1);
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const [
    thisQuarterAgg,
    lastQuarterAgg,
    activeProjects,
    lastMonthActiveProjects,
    pendingTasks,
    lastWeekPendingTasks,
    teamMembers,
  ] = await Promise.all([
    db.invoice.aggregate({
      where: { status: "PAID", paidAt: { gte: thisQuarterStart } },
      _sum: { total: true },
    }),
    db.invoice.aggregate({
      where: { status: "PAID", paidAt: { gte: lastQuarterStart, lt: thisQuarterStart } },
      _sum: { total: true },
    }),
    db.project.count({
      where: { status: { notIn: ["DELIVERED", "ARCHIVED"] } },
    }),
    db.project.count({
      where: { status: { notIn: ["DELIVERED", "ARCHIVED"] }, createdAt: { lt: monthAgo } },
    }),
    db.task.count({
      where: { status: { in: ["TODO", "IN_PROGRESS", "REVIEW"] } },
    }),
    db.task.count({
      where: { status: { in: ["TODO", "IN_PROGRESS", "REVIEW"] }, createdAt: { lt: weekAgo } },
    }),
    db.user.count(),
  ]);

  const thisQ = thisQuarterAgg._sum.total ?? 0;
  const lastQ = lastQuarterAgg._sum.total ?? 0;
  const revenueChange = lastQ === 0 ? 0 : Math.round(((thisQ - lastQ) / lastQ) * 1000) / 10;

  return {
    totalRevenue: thisQ,
    activeProjects,
    pendingTasks,
    teamMembers,
    revenueChange,
    projectsChange: activeProjects - lastMonthActiveProjects,
    tasksChange: pendingTasks - lastWeekPendingTasks,
  };
}

export async function getRevenueChartData(): Promise<RevenueChartData[]> {
  const now = new Date();
  const yearAgo = startOfMonth(subMonths(now, 11));

  const [paidInvoices, allInvoices] = await Promise.all([
    db.invoice.findMany({
      where: { status: "PAID", paidAt: { gte: yearAgo } },
      select: { paidAt: true, total: true },
    }),
    db.invoice.findMany({
      where: { issueDate: { gte: yearAgo } },
      select: { issueDate: true, total: true },
    }),
  ]);

  return Array.from({ length: 12 }, (_, i) => {
    const monthDate = subMonths(now, 11 - i);
    const key = format(monthDate, "yyyy-MM");

    const revenue = paidInvoices
      .filter((inv) => inv.paidAt && format(inv.paidAt, "yyyy-MM") === key)
      .reduce((sum, inv) => sum + inv.total, 0);

    const invoiced = allInvoices
      .filter((inv) => format(inv.issueDate, "yyyy-MM") === key)
      .reduce((sum, inv) => sum + inv.total, 0);

    return { month: format(monthDate, "MMM"), revenue, invoiced };
  });
}
