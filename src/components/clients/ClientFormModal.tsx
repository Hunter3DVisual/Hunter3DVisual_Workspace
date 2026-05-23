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
import { createClient, updateClient } from "@/actions/clients";
import type { ClientWithStats } from "@/types/clients";

const CLIENT_STATUSES = ["LEAD", "ACTIVE", "VIP", "INACTIVE"] as const;

const schema = z.object({
  name: z.string().min(1, "Bắt buộc"),
  company: z.string().optional(),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  status: z.enum(["LEAD", "ACTIVE", "VIP", "INACTIVE", "ARCHIVED"]).default("LEAD"),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  representative: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client?: ClientWithStats;
}

export function ClientFormModal({ open, onOpenChange, client }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: client
      ? {
          name: client.name,
          company: client.company ?? undefined,
          email: client.email,
          phone: client.phone ?? undefined,
          whatsapp: client.whatsapp ?? undefined,
          status: client.status,
          country: client.country ?? undefined,
          city: client.city ?? undefined,
          address: client.address ?? undefined,
          representative: client.representative ?? undefined,
          position: client.position ?? undefined,
          notes: client.notes ?? undefined,
        }
      : { status: "LEAD" },
  });

  useEffect(() => {
    if (open) {
      if (!client) reset({ status: "LEAD" });
      else
        reset({
          name: client.name,
          company: client.company ?? undefined,
          email: client.email,
          phone: client.phone ?? undefined,
          whatsapp: client.whatsapp ?? undefined,
          status: client.status,
          country: client.country ?? undefined,
          city: client.city ?? undefined,
          address: client.address ?? undefined,
          representative: client.representative ?? undefined,
          position: client.position ?? undefined,
          notes: client.notes ?? undefined,
        });
    }
  }, [open, client, reset]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (client) {
        await updateClient(client.id, values);
      } else {
        await createClient({
          name: values.name,
          company: values.company || undefined,
          email: values.email,
          phone: values.phone || undefined,
          country: values.country || undefined,
          city: values.city || undefined,
          notes: values.notes || undefined,
        });
      }

      router.refresh();
      onOpenChange(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "New Client"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cl-name">Name *</Label>
              <Input
                id="cl-name"
                {...register("name")}
                placeholder="Nguyen Van A"
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cl-company">Company</Label>
              <Input
                id="cl-company"
                {...register("company")}
                placeholder="ABC Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cl-email">Email *</Label>
              <Input
                id="cl-email"
                type="email"
                {...register("email")}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLIENT_STATUSES.map((s) => (
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cl-phone">Phone</Label>
              <Input
                id="cl-phone"
                {...register("phone")}
                placeholder="+84 xxx xxx xxx"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cl-whatsapp">WhatsApp</Label>
              <Input
                id="cl-whatsapp"
                {...register("whatsapp")}
                placeholder="+84 xxx xxx xxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cl-rep">Representative</Label>
              <Input
                id="cl-rep"
                {...register("representative")}
                placeholder="Contact person"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cl-pos">Position</Label>
              <Input
                id="cl-pos"
                {...register("position")}
                placeholder="CEO / PM / ..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cl-country">Country</Label>
              <Input
                id="cl-country"
                {...register("country")}
                placeholder="Vietnam"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cl-city">City</Label>
              <Input
                id="cl-city"
                {...register("city")}
                placeholder="Ho Chi Minh City"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cl-notes">Notes</Label>
            <Textarea
              id="cl-notes"
              {...register("notes")}
              placeholder="Internal notes..."
              rows={3}
            />
          </div>

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
              {client ? "Save Changes" : "Create Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
