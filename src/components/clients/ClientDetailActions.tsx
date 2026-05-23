"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { deleteClient } from "@/actions/clients";
import type { ClientStatus } from "@/types/clients";

export type SerializedClient = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  status: ClientStatus;
  country: string | null;
  city: string | null;
  address: string | null;
  representative: string | null;
  position: string | null;
  notes: string | null;
  _count: { projects: number };
  invoices: { total: number }[];
};

interface Props {
  client: SerializedClient;
}

export function ClientDetailActions({ client }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${client.name}"? This cannot be undone.`)) return;
    await deleteClient(client.id);
    router.push("/dashboard/clients");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <ClientFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client as any}
      />
    </>
  );
}
