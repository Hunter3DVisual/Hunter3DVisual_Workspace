export const dynamic = "force-dynamic";

import { FileText } from "lucide-react";
import { getDocuments } from "@/actions/documents";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentsHeader } from "@/components/documents/DocumentsHeader";

interface DocumentsPageProps {
  searchParams: Promise<{ type?: string; status?: string }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const { type, status } = await searchParams;

  const documents = await getDocuments({
    type: type || undefined,
    status: status || undefined,
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <DocumentsHeader
        total={documents.length}
        filters={{ type, status }}
      />

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No documents found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {type || status
              ? "Try adjusting your filters"
              : "Create your first document to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(documents as any[]).map((doc, i) => (
            <DocumentCard key={doc.id} document={doc} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
