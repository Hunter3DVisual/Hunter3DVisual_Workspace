import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px]">
      <DashboardHero />
      <StatsGrid />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RevenueChart />
          <RecentProjects />
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
