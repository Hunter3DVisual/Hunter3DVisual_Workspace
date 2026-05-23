export const dynamic = "force-dynamic";

import { getTasks } from "@/actions/tasks";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { CheckSquare } from "lucide-react";

interface TasksPageProps {
  searchParams: Promise<{ search?: string; projectId?: string; assigneeId?: string }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const { search, projectId, assigneeId } = await searchParams;

  const tasks = await getTasks({ search, projectId, assigneeId });

  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  return (
    <div className="space-y-6 max-w-[1600px]">
      <TasksHeader
        total={tasks.length}
        inProgressCount={inProgressCount}
        search={search}
      />

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <CheckSquare className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No tasks found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search ? `No results for "${search}"` : "Create your first task to get started"}
          </p>
        </div>
      ) : (
        <KanbanBoard initialTasks={tasks} />
      )}
    </div>
  );
}
