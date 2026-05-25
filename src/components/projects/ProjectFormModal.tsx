"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { createProject, updateProject } from "@/actions/projects";
import { getClientsForSelect } from "@/actions/clients";
import type { ProjectWithClient } from "@/types/projects";
import type { ClientSelectOption } from "@/types/clients";

const PROJECT_STATUSES = [
  "BRIEF",
  "CONCEPT",
  "MODELING",
  "LIGHTING",
  "RENDERING",
  "POST",
  "REVIEW",
  "DELIVERED",
  "ARCHIVED",
] as const;

const schema = z.object({
  name: z.string().min(1, "Bắt buộc"),
  clientId: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  deadline: z.string().optional(),
  budget: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive().optional()
  ),
  currency: z.string().default("USD"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project?: ProjectWithClient;
}

export function ProjectFormModal({ open, onOpenChange, project }: Props) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          name: project.name,
          clientId: project.clientId ?? undefined,
          description: project.description ?? undefined,
          status: project.status,
          deadline: project.deadline
            ? new Date(project.deadline).toISOString().split("T")[0]
            : undefined,
          budget: project.budget ?? undefined,
          currency: project.currency ?? "USD",
        }
      : { currency: "USD" },
  });

  useEffect(() => {
    if (open) {
      setSaveError(null);
      getClientsForSelect().then(setClients);
      if (!project) reset({ currency: "USD" });
      else
        reset({
          name: project.name,
          clientId: project.clientId ?? undefined,
          description: project.description ?? undefined,
          status: project.status,
          deadline: project.deadline
            ? new Date(project.deadline).toISOString().split("T")[0]
            : undefined,
          budget: project.budget ?? undefined,
          currency: project.currency ?? "USD",
        });
    }
  }, [open, project, reset]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setSaveError(null);
    try {
      const data = {
        name:        values.name,
        clientId:    values.clientId    || undefined,
        // null explicitly clears the field; undefined means "don't touch"
        description: values.description !== undefined ? (values.description || null) : null,
        deadline:    values.deadline    || null,       // ISO string or null
        budget:      values.budget,
        currency:    values.currency    || "USD",
      };

      if (project) {
        await updateProject(project.id, { ...data, status: values.status });
      } else {
        await createProject(data);
      }

      router.refresh();
      onOpenChange(false);
    } catch (e) {
      console.error("Project save error:", e);
      const digest = (e as any)?.digest ? ` [${(e as any).digest}]` : "";
      setSaveError(
        e instanceof Error
          ? e.message + digest
          : `Failed to save project. Please try again.${digest}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="proj-name">Name *</Label>
            <Input
              id="proj-name"
              {...register("name")}
              placeholder="Project name"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(v) =>
                      field.onChange(v === "__none__" ? undefined : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No client</SelectItem>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
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
                  <Select
                    value={field.value ?? "BRIEF"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Brief" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-desc">Description</Label>
            <Textarea
              id="proj-desc"
              {...register("description")}
              placeholder="Brief description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="proj-budget">Budget</Label>
              <Input
                id="proj-budget"
                type="number"
                min={0}
                step={0.01}
                {...register("budget")}
                placeholder="0"
              />
              {errors.budget && (
                <p className="text-xs text-red-400">{errors.budget.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-currency">Currency</Label>
              <Input
                id="proj-currency"
                {...register("currency")}
                placeholder="USD"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-deadline">Deadline</Label>
            <Input
              id="proj-deadline"
              type="date"
              {...register("deadline")}
              className="[color-scheme:dark]"
            />
          </div>

          {saveError && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
              ⚠ {saveError}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {project ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
