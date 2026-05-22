import { getPipeline } from "@/actions/pipeline";
import { PipelineHeader } from "@/components/pipeline/PipelineHeader";
import { PipelineStageCard } from "@/components/pipeline/PipelineStage";
import { GitBranch } from "lucide-react";
import { StageStatus } from "@/types/pipeline";

interface PipelinePageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function PipelinePage({ searchParams }: PipelinePageProps) {
  const { projectId } = await searchParams;

  const projects = await getPipeline({ projectId });

  const activeStages = projects.reduce(
    (acc, p) => acc + p.pipeline.filter((s) => s.status === StageStatus.IN_PROGRESS).length,
    0
  );

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name, code: p.code }));

  return (
    <div className="space-y-6 max-w-[1600px]">
      <PipelineHeader
        projects={projectOptions}
        total={projects.length}
        activeStages={activeStages}
        selectedProjectId={projectId}
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <GitBranch className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No pipeline data</p>
          <p className="text-xs text-muted-foreground mt-1">
            {projectId
              ? "No stages found for this project"
              : "Create a project and add pipeline stages to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-foreground/30 tracking-widest uppercase">
                  {project.code}
                </span>
                <p className="text-sm font-semibold text-foreground">{project.name}</p>
                {project.client && (
                  <span className="text-xs text-muted-foreground">{project.client.name}</span>
                )}
                <div className="flex-1 h-px bg-hunter-border" />
                <span className="text-xs text-muted-foreground font-mono">{project.progress}%</span>
              </div>

              {project.pipeline.length === 0 ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-hunter-elevated border border-hunter-border border-dashed">
                  <GitBranch className="w-3.5 h-3.5 text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground/60">No stages defined</span>
                </div>
              ) : (
                <div className="flex items-stretch overflow-x-auto pb-1 gap-0">
                  {project.pipeline.map((stage, i) => (
                    <PipelineStageCard
                      key={stage.id}
                      stage={stage}
                      index={i}
                      isLast={i === project.pipeline.length - 1}
                      taskCount={i === 0 ? project._count.tasks : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
