export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { DocumentWizard } from "@/components/documents/DocumentWizard";

export default async function NewDocumentPage() {
  const [clients, projects] = await Promise.all([
    db.client.findMany({
      select: {
        id: true,
        name: true,
        company: true,
        phone: true,
        address: true,
        representative: true,
        position: true,
        taxCode: true,
        whatsapp: true,
      },
      orderBy: { name: "asc" },
    }),
    db.project.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Tạo tài liệu / New Document</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Follow the steps to create a contract, liquidation minutes, or invoice
        </p>
      </div>
      <DocumentWizard clients={clients as any} projects={projects} />
    </div>
  );
}
