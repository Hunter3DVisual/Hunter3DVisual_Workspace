export const dynamic = "force-dynamic";

import { getAutomations } from "@/actions/automation";
import { AutomationHeader } from "@/components/automation/AutomationHeader";
import { AutomationCard } from "@/components/automation/AutomationCard";
import { AutomationStatus } from "@/types/automation";
import type { Automation } from "@/types/automation";
import { Zap } from "lucide-react";

interface AutomationPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AutomationPage({ searchParams }: AutomationPageProps) {
  const { status } = await searchParams;

  const validStatus = Object.values(AutomationStatus).includes(status as AutomationStatus)
    ? (status as AutomationStatus)
    : undefined;

  const automations = (await getAutomations({ status: validStatus })) as unknown as Automation[];

  const activeCount = automations.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6 max-w-[1600px]">
      <AutomationHeader
        total={automations.length}
        activeCount={activeCount}
        status={validStatus}
      />

      {automations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No automation rules</p>
          <p className="text-xs text-muted-foreground mt-1">
            {validStatus
              ? `No ${validStatus} rules found`
              : "Create your first rule to automate studio workflows"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {automations.map((automation, i) => (
            <AutomationCard key={automation.id} automation={automation} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
