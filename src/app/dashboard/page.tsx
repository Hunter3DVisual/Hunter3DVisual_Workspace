export const dynamic = "force-dynamic";

import { getDashboardStats, getRevenueChartData } from "@/actions/dashboard";
import { getProjects } from "@/actions/projects";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const [stats, chartData, allProjects] = await Promise.all([
    getDashboardStats(),
    getRevenueChartData(),
    getProjects({ sortBy: "createdAt", sortDir: "desc" }),
  ]);

  const activeProjects = allProjects
    .filter((p) => p.status !== "DELIVERED" && p.status !== "ARCHIVED")
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-[1600px]">
      <DashboardHero stats={stats} />
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RevenueChart data={chartData} />
          <RecentProjects projects={activeProjects} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <PipelineOverview />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
