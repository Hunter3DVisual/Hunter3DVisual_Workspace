"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTask,
  updateTask,
  deleteTask,
  getProjectsForTaskSelect,
  getMembersForTaskSelect,
} from "@/actions/tasks";
import type { TaskWithRelations } from "@/types/tasks";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
const STATUSES = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const;

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES).default("MEDIUM"),
  status: z.enum(STATUSES).default("TODO"),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  estimateHrs: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive().optional()
  ),
});

type FormValues = z.infer<typeof schema>;

type ProjectOption = { id: string; name: string; code: string };
type MemberOption = { id: string; name: string; avatar: string | null };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task?: TaskWithRelations;
  defaultProjectId?: string;
  defaultStatus?: (typeof STATUSES)[number];
  onSuccess?: () => void;
}

export function TaskFormModal({
  open,
  onOpenChange,
  task,
  defaultProjectId,
  defaultStatus,
  onSuccess,
}: Props) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description ?? undefined,
          priority: task.priority,
          status: task.status as (typeof STATUSES)[number],
          projectId: task.projectId ?? undefined,
          assigneeId: task.assigneeId ?? undefined,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : undefined,
          estimateHrs: task.estimateHrs ?? undefined,
        }
      : {
          priority: "MEDIUM",
          status: defaultStatus ?? "TODO",
          projectId: defaultProjectId,
        },
  });

  useEffect(() => {
    if (!open) return;
    Promise.all([getProjectsForTaskSelect(), getMembersForTaskSelect()]).then(
      ([p, m]) => {
        setProjects(p);
        setMembers(m);
      }
    );
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? undefined,
        priority: task.priority,
        status: task.status as (typeof STATUSES)[number],
        projectId: task.projectId ?? undefined,
        assigneeId: task.assigneeId ?? undefined,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : undefined,
        estimateHrs: task.estimateHrs ?? undefined,
      });
    } else {
      reset({
        priority: "MEDIUM",
        status: defaultStatus ?? "TODO",
        projectId: defaultProjectId,
      });
    }
  }, [open, task, defaultProjectId, defaultStatus, reset]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const data = {
        title: values.title,
        description: values.description || undefined,
        priority: values.priority,
        projectId: values.projectId || undefined,
        assigneeId: values.assigneeId || undefined,
        dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
        estimateHrs: values.estimateHrs,
      };

      if (task) {
        await updateTask(task.id, { ...data, status: values.status });
      } else {
        await createTask(data);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      onOpenChange(false);
      onSuccess?.();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              {...register("title")}
              placeholder="Task title"
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              {...register("description")}
              placeholder="Details, context, acceptance criteria..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Medium" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="To Do" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s === "IN_PROGRESS"
                            ? "In Progress"
                            : s.charAt(0) + s.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? "__none__"}
                    onValueChange={(v) =>
                      field.onChange(v === "__none__" ? undefined : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No project</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <span className="font-mono text-xs text-foreground/40 mr-1.5">
                            {p.code}
                          </span>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Assignee</Label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? "__none__"}
                    onValueChange={(v) =>
                      field.onChange(v === "__none__" ? undefined : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Unassigned</SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                {...register("dueDate")}
                className="[color-scheme:dark]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-estimate">Estimate (hrs)</Label>
              <Input
                id="task-estimate"
                type="number"
                min={0}
                step={0.5}
                {...register("estimateHrs")}
                placeholder="0"
              />
              {errors.estimateHrs && (
                <p className="text-xs text-red-400">
                  {errors.estimateHrs.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            {task && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={deleting}
                onClick={handleDelete}
                className="mr-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
