export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  CheckSquare,
  User2,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectDetailActions } from "@/components/projects/ProjectDetailActions";
import { getProjectById } from "@/actions/projects";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/utils";

const STATUS_VARIANT: Record<string, string> = {
  BRIEF: "brief",
  CONCEPT: "concept",
  MODELING: "modeling",
  LIGHTING: "lighting",
  RENDERING: "rendering",
  POST: "post",
  REVIEW: "review",
  DELIVERED: "delivered",
  ARCHIVED: "archived",
};

const INV_STATUS: Record<string, { variant: string; label: string }> = {
  DRAFT: { variant: "secondary", label: "Draft" },
  SENT: { variant: "info", label: "Sent" },
  VIEWED: { variant: "info", label: "Viewed" },
  PARTIAL: { variant: "warning", label: "Partial" },
  PAID: { variant: "success", label: "Paid" },
  OVERDUE: { variant: "destructive", label: "Overdue" },
  CANCELLED: { variant: "secondary", label: "Cancelled" },
};

const TASK_STATUS: Record<string, { bg: string; text: string; label: string }> = {
  BACKLOG: { bg: "bg-slate-500/10", text: "text-slate-400", label: "Backlog" },
  TODO: { bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Todo" },
  IN_PROGRESS: { bg: "bg-blue-500/10", text: "text-blue-400", label: "In Progress" },
  REVIEW: { bg: "bg-violet-500/10", text: "text-violet-400", label: "Review" },
  DONE: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Done" },
};

const TASK_PRIORITY: Record<string, { text: string; label: string }> = {
  LOW: { text: "text-slate-500", label: "Low" },
  MEDIUM: { text: "text-blue-400", label: "Med" },
  HIGH: { text: "text-amber-400", label: "High" },
  URGENT: { text: "text-red-400", label: "Urgent" },
};

const PIPELINE_STATUS: Record<string, { dot: string }> = {
  pending: { dot: "bg-slate-500" },
  in_progress: { dot: "bg-blue-400 animate-pulse" },
  done: { dot: "bg-emerald-400" },
  complete: { dot: "bg-emerald-400" },
  completed: { dot: "bg-emerald-400" },
};

const STATUS_ORDER: Record<string, number> = {
  IN_PROGRESS: 0,
  REVIEW: 1,
  TODO: 2,
  BACKLOG: 3,
  DONE: 4,
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const statusLabel =
    project.status.charAt(0) + project.status.slice(1).toLowerCase();
  const doneTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = project.tasks.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const totalInvoiced = project.invoices.reduce((s, inv) => s + inv.total, 0);

  const sortedTasks = [...project.tasks].sort(
    (a, b) =>
      (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
  );

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Nav + actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Projects
          </Link>
          <span className="text-hunter-border">/</span>
          <span className="text-xs font-mono text-muted-foreground/60 shrink-0">
            {project.code}
          </span>
          <Badge
            variant={STATUS_VARIANT[project.status] as any}
            className="text-[10px] shrink-0"
          >
            {statusLabel}
          </Badge>
        </div>

        <ProjectDetailActions
          project={{
            id: project.id,
            name: project.name,
            code: project.code,
            clientId: project.clientId,
            description: project.description,
            status: project.status,
            deadline: project.deadline?.toISOString() ?? null,
            budget: project.budget,
            currency: project.currency,
            progress: project.progress,
            client: project.client,
            _count: {
              tasks: project._count.tasks,
              assets: project._count.assets,
            },
          }}
        />
      </div>

      {/* Title + description */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          {project.name}
        </h1>
        {project.client && (
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <User2 className="w-3.5 h-3.5" />
            {project.client.name}
            {project.client.company && (
              <span className="text-muted-foreground/50">
                · {project.client.company}
              </span>
            )}
          </p>
        )}
        {project.description && (
          <p className="text-sm text-muted-foreground/80 mt-3 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Budget
            </div>
            <p className="text-lg font-semibold text-foreground font-mono">
              {project.budget ? (
                formatCurrency(project.budget, project.currency)
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <Target className="w-3.5 h-3.5" />
              Progress
            </div>
            <p className="text-lg font-semibold text-foreground font-mono mb-1.5">
              {project.progress}%
            </p>
            <Progress value={project.progress} className="h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Deadline
            </div>
            <p className="text-lg font-semibold text-foreground">
              {project.deadline ? (
                formatDate(project.deadline, "MMM d, yyyy")
              ) : (
                <span className="text-muted-foreground text-sm">None</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              Tasks
            </div>
            <p className="text-lg font-semibold text-foreground font-mono">
              {doneTasks}
              <span className="text-muted-foreground text-sm font-normal">
                /{project._count.tasks}
              </span>
            </p>
            {inProgressTasks > 0 && (
              <p className="text-xs text-blue-400 mt-0.5">
                {inProgressTasks} in progress
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Tasks */}
        <div className="xl:col-span-7 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Tasks
            <span className="text-muted-foreground font-normal ml-2">
              ({project._count.tasks})
            </span>
          </h2>

          {sortedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No tasks yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-1.5">
              {sortedTasks.map((task) => {
                const ts = TASK_STATUS[task.status] ?? TASK_STATUS.TODO;
                const tp = TASK_PRIORITY[task.priority] ?? TASK_PRIORITY.MEDIUM;
                return (
                  <Card
                    key={task.id}
                    className="hover:border-hunter-border-bright transition-colors"
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <span
                        className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded ${ts.bg} ${ts.text}`}
                      >
                        {ts.label}
                      </span>
                      <span className="text-sm text-foreground flex-1 truncate">
                        {task.title}
                      </span>
                      <span
                        className={`text-[10px] font-medium shrink-0 ${tp.text}`}
                      >
                        {tp.label}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(task.dueDate, "MMM d")}
                        </span>
                      )}
                      {task.assignee && (
                        <div
                          className="w-5 h-5 rounded-full bg-hunter-elevated border border-hunter-border flex items-center justify-center text-[9px] font-bold text-foreground/60 shrink-0 overflow-hidden"
                          title={task.assignee.name}
                        >
                          {task.assignee.avatar ? (
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            task.assignee.name.charAt(0).toUpperCase()
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="xl:col-span-5 space-y-5">
          {/* Pipeline */}
          {project.pipeline.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                Pipeline
              </h2>
              <div className="space-y-2">
                {project.pipeline.map((stage) => {
                  const ps =
                    PIPELINE_STATUS[stage.status] ?? PIPELINE_STATUS.pending;
                  return (
                    <Card key={stage.id}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${ps.dot}`}
                            />
                            <span className="text-sm text-foreground">
                              {stage.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {stage.progress}%
                          </span>
                        </div>
                        {stage.progress > 0 && (
                          <Progress value={stage.progress} className="h-0.5" />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Invoices */}
          {project.invoices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Invoices
                </h2>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatCurrency(totalInvoiced, project.currency ?? "USD")}
                </span>
              </div>
              <div className="space-y-1.5">
                {project.invoices.map((inv) => {
                  const is = INV_STATUS[inv.status] ?? INV_STATUS.DRAFT;
                  return (
                    <Card key={inv.id}>
                      <CardContent className="p-3 flex items-center gap-3">
                        <span className="text-xs font-mono text-foreground/60 shrink-0">
                          {inv.number}
                        </span>
                        <Badge
                          variant={is.variant as any}
                          className="text-[10px] shrink-0"
                        >
                          {is.label}
                        </Badge>
                        <span className="flex-1" />
                        <span className="text-xs font-mono text-foreground">
                          {formatCurrency(inv.total, inv.currency)}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatDate(inv.dueDate, "MMM d")}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details card */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Details
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code</span>
                  <span className="font-mono text-foreground/70">
                    {project.code}
                  </span>
                </div>
                {project.startDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start</span>
                    <span className="text-foreground/70">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                )}
                {project.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered</span>
                    <span className="text-foreground/70">
                      {formatDate(project.deliveredAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground/70">
                    {formatRelativeTime(project.createdAt)}
                  </span>
                </div>
                {project._count.assets > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assets</span>
                    <span className="text-foreground/70">
                      {project._count.assets}
                    </span>
                  </div>
                )}
                {project._count.renders > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renders</span>
                    <span className="text-foreground/70">
                      {project._count.renders}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
