export const dynamic = "force-dynamic";

import { getFinanceStats, getRecentTransactions } from "@/actions/finance";
import { FinanceStats } from "@/components/finance/FinanceStats";
import { DollarSign, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export default async function FinancePage() {
  const [stats, transactions] = await Promise.all([
    getFinanceStats(),
    getRecentTransactions(),
  ]);

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Finance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Revenue overview and transaction history</p>
      </div>

      <FinanceStats stats={stats} />

      <div className="rounded-xl border border-hunter-border bg-hunter-card overflow-hidden">
        <div className="px-5 py-4 border-b border-hunter-border">
          <p className="text-sm font-semibold text-foreground">Recent Transactions</p>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-hunter-border">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-hunter-elevated/50 transition-colors"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    tx.type === "income" ? "bg-emerald-500/10" : "bg-red-500/10"
                  )}
                >
                  {tx.type === "income" ? (
                    <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                  {tx.clientName && (
                    <p className="text-xs text-muted-foreground mt-0.5">{tx.clientName}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={cn(
                      "text-sm font-mono font-semibold",
                      tx.type === "income" ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {tx.type === "income" ? "+" : "−"}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(tx.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
