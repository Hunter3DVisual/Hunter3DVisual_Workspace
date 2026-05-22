import { getProjects } from "@/actions/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsHeader } from "@/components/projects/ProjectsHeader";
import { FolderKanban } from "lucide-react";
import type { ProjectStatus } from "@prisma/client";
import type { ProjectViewMode } from "@/types/projects";

interface ProjectsPageProps {
  searchParams: Promise<{ search?: string; status?: string; view?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { search, status, view } = await searchParams;

  const viewMode: ProjectViewMode = view === "list" ? "list" : "grid";

  const projects = await getProjects({
    search,
    status: status as ProjectStatus | undefined,
  });

  const activeCount = projects.filter(
    (p) => p.status !== "DELIVERED" && p.status !== "ARCHIVED"
  ).length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <ProjectsHeader
        total={projects.length}
        activeCount={activeCount}
        viewMode={viewMode}
        search={search}
        status={status}
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <FolderKanban className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No projects found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search ? `No results for "${search}"` : "Create your first project to get started"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
}
