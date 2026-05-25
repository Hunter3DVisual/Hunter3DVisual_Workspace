export const dynamic = "force-dynamic";

import { getCompanySettings, getInvoiceStyleSettings, getBankingSettings } from "@/actions/settings";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const [company, style, banking] = await Promise.all([
    getCompanySettings(),
    getInvoiceStyleSettings(),
    getBankingSettings(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-hunter-elevated border border-hunter-border flex items-center justify-center">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Studio Settings</h1>
          <p className="text-xs text-muted-foreground">Company info, invoice appearance, and banking defaults</p>
        </div>
      </div>

      <SettingsClient
        initialCompany={company}
        initialStyle={style}
        initialBanking={banking}
      />
    </div>
  );
}
