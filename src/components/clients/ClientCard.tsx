"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getInitials, formatCurrency } from "@/lib/utils";
import type { ClientWithStats } from "@/types/clients";

const STATUS_GRADIENT: Record<string, string> = {
  LEAD: "from-blue-500/10",
  ACTIVE: "from-emerald-500/10",
  VIP: "from-amber-500/10",
  INACTIVE: "from-slate-500/10",
  ARCHIVED: "from-red-500/10",
};

const STATUS_DOT: Record<string, string> = {
  LEAD: "bg-blue-400",
  ACTIVE: "bg-emerald-400",
  VIP: "bg-amber-400",
  INACTIVE: "bg-slate-500",
  ARCHIVED: "bg-red-500",
};

interface ClientCardProps {
  client: ClientWithStats;
  index?: number;
}

export function ClientCard({ client, index = 0 }: ClientCardProps) {
  const gradient = STATUS_GRADIENT[client.status] ?? "from-indigo-500/10";
  const dot = STATUS_DOT[client.status] ?? "bg-indigo-400";
  const statusLabel = client.status.charAt(0) + client.status.slice(1).toLowerCase();
  const totalValue = client.invoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link href={`/clients/${client.id}`} className="block h-full">
        <Card glow className="group cursor-pointer h-full">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br via-transparent to-transparent flex items-center justify-center shrink-0 border border-hunter-border text-sm font-bold font-mono text-foreground/50 group-hover:text-foreground/70 transition-colors overflow-hidden",
                  gradient
                )}
              >
                {client.avatar ? (
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(client.name)
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-indigo-300 transition-colors truncate">
                  {client.name}
                </p>
                {client.company && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 shrink-0" />
                    {client.company}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
                <span className="text-xs text-muted-foreground">{statusLabel}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-hunter-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <FolderOpen className="w-3 h-3" />
                <span>
                  {client._count.projects} project{client._count.projects !== 1 ? "s" : ""}
                </span>
              </div>
              {totalValue > 0 && (
                <span className="text-xs font-mono text-foreground/60">
                  {formatCurrency(totalValue)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
