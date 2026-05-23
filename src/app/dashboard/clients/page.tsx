export const dynamic = "force-dynamic";

import { getClients } from "@/actions/clients";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { Users } from "lucide-react";
import type { ClientStatus } from "@prisma/client";

interface ClientsPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const { search, status } = await searchParams;

  const clients = await getClients({
    search,
    status: status as ClientStatus | undefined,
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <ClientsHeader total={clients.length} search={search} status={status} />

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No clients found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search ? `No results for "${search}"` : "Add your first client to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((client, i) => (
            <ClientCard key={client.id} client={client} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
