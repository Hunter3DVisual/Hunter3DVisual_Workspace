"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { deleteProject } from "@/actions/projects";
import type { ProjectStatus } from "@/types/projects";
import type { Client } from "@prisma/client";

export type SerializedProject = {
  id: string;
  name: string;
  code: string;
  clientId: string | null;
  description: string | null;
  status: ProjectStatus;
  deadline: string | null;
  budget: number | null;
  currency: string;
  progress: number;
  client: Client | null;
  _count: { tasks: number; assets: number };
};

interface Props {
  project: SerializedProject;
}

export function ProjectDetailActions({ project }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    await deleteProject(project.id);
    router.push("/dashboard/projects");
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

      <ProjectFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project as any}
      />
    </>
  );
}
