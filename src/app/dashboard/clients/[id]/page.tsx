import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Building2,
  FolderOpen,
  FileText,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClientDetailActions } from "@/components/clients/ClientDetailActions";
import { getClientById } from "@/actions/clients";
import { formatDate, formatCurrency, getInitials, cn } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = {
  LEAD: "bg-blue-400",
  ACTIVE: "bg-emerald-400",
  VIP: "bg-amber-400",
  INACTIVE: "bg-slate-500",
  ARCHIVED: "bg-red-500",
};

const STATUS_GRADIENT: Record<string, string> = {
  LEAD: "from-blue-500/20",
  ACTIVE: "from-emerald-500/20",
  VIP: "from-amber-500/20",
  INACTIVE: "from-slate-500/20",
  ARCHIVED: "from-red-500/20",
};

const PROJECT_STATUS_VARIANT: Record<string, string> = {
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

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const statusLabel =
    client.status.charAt(0) + client.status.slice(1).toLowerCase();
  const dot = STATUS_DOT[client.status] ?? "bg-indigo-400";
  const gradient = STATUS_GRADIENT[client.status] ?? "from-indigo-500/20";

  const totalInvoiced = client.invoices.reduce((s, inv) => s + inv.total, 0);
  const outstanding = client.invoices
    .filter((i) =>
      ["SENT", "VIEWED", "PARTIAL", "OVERDUE"].includes(i.status)
    )
    .reduce((s, inv) => s + inv.total, 0);
  const activeProjects = client.projects.filter(
    (p) => !["DELIVERED", "ARCHIVED"].includes(p.status)
  ).length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Nav + actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/clients"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Clients
        </Link>
        <ClientDetailActions
          client={{
            id: client.id,
            name: client.name,
            company: client.company,
            email: client.email,
            phone: client.phone,
            whatsapp: client.whatsapp,
            status: client.status,
            country: client.country,
            city: client.city,
            address: client.address,
            representative: client.representative,
            position: client.position,
            notes: client.notes,
            _count: { projects: client._count.projects },
            invoices: client.invoices.map((i) => ({ total: i.total })),
          }}
        />
      </div>

      {/* Profile header */}
      <div className="flex items-start gap-5">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl bg-gradient-to-br via-transparent to-transparent border border-hunter-border flex items-center justify-center text-xl font-bold font-mono text-foreground/50 shrink-0 overflow-hidden",
            gradient
          )}
        >
          {client.avatar ? (
            <img
              src={client.avatar}
              alt={client.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(client.name)
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground">
              {client.name}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", dot)} />
              <span className="text-sm text-muted-foreground">{statusLabel}</span>
            </div>
          </div>

          {client.company && (
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {client.company}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-3">
            {client.email && (
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {client.email}
              </a>
            )}
            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {client.phone}
              </a>
            )}
            {client.whatsapp && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageCircle className="w-3.5 h-3.5" />
                {client.whatsapp}
              </span>
            )}
            {(client.city || client.country) && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                {[client.city, client.country].filter(Boolean).join(", ")}
              </span>
            )}
          </div>

          {client.representative && (
            <p className="text-xs text-muted-foreground mt-2">
              Contact:{" "}
              <span className="text-foreground/70">{client.representative}</span>
              {client.position && (
                <span className="text-muted-foreground/60">
                  {" "}
                  · {client.position}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              Projects
            </div>
            <p className="text-lg font-semibold text-foreground font-mono">
              {client._count.projects}
            </p>
            {activeProjects > 0 && (
              <p className="text-xs text-blue-400 mt-0.5">
                {activeProjects} active
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <FileText className="w-3.5 h-3.5" />
              Total Invoiced
            </div>
            <p className="text-lg font-semibold text-foreground font-mono">
              {totalInvoiced > 0 ? (
                formatCurrency(totalInvoiced)
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Outstanding
            </div>
            <p
              className={cn(
                "text-lg font-semibold font-mono",
                outstanding > 0 ? "text-amber-400" : "text-foreground"
              )}
            >
              {outstanding > 0 ? (
                formatCurrency(outstanding)
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Client Since
            </div>
            <p className="text-lg font-semibold text-foreground">
              {formatDate(client.createdAt, "MMM yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Projects */}
        <div className="xl:col-span-7 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Projects
            <span className="text-muted-foreground font-normal ml-2">
              ({client.projects.length})
            </span>
          </h2>

          {client.projects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No projects yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-1.5">
              {client.projects.map((project) => {
                const sLabel =
                  project.status.charAt(0) +
                  project.status.slice(1).toLowerCase();
                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                  >
                    <Card className="hover:border-hunter-border-bright transition-colors cursor-pointer">
                      <CardContent className="p-3 flex items-center gap-3">
                        <span className="text-xs font-mono text-foreground/40 shrink-0 hidden sm:block">
                          {project.code}
                        </span>
                        <span className="text-sm text-foreground flex-1 truncate">
                          {project.name}
                        </span>
                        <Badge
                          variant={
                            PROJECT_STATUS_VARIANT[project.status] as any
                          }
                          className="text-[10px] shrink-0"
                        >
                          {sLabel}
                        </Badge>
                        <div className="w-20 hidden md:block shrink-0">
                          <div className="flex justify-end text-[10px] text-muted-foreground mb-1 font-mono">
                            {project.progress}%
                          </div>
                          <Progress value={project.progress} className="h-0.5" />
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {project._count.tasks} tasks
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="xl:col-span-5 space-y-5">
          {/* Invoices */}
          {client.invoices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Invoices
                </h2>
                <span className="text-xs text-muted-foreground">
                  {client.invoices.length} total
                </span>
              </div>
              <div className="space-y-1.5">
                {client.invoices.slice(0, 8).map((inv) => {
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

          {/* Contacts */}
          {client.contacts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                Contacts
              </h2>
              <div className="space-y-1.5">
                {client.contacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-hunter-elevated border border-hunter-border flex items-center justify-center text-xs font-bold text-foreground/50 shrink-0">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {contact.name}
                        </p>
                        {contact.title && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {contact.title}
                          </p>
                        )}
                      </div>
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors truncate max-w-[140px]"
                        >
                          {contact.email}
                        </a>
                      )}
                      {contact.isPrimary && (
                        <span className="text-[10px] text-amber-400 shrink-0">
                          Primary
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Notes
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {client.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Details */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Details
              </h3>
              <div className="space-y-1.5 text-xs">
                {client.taxCode && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Code</span>
                    <span className="font-mono text-foreground/70">
                      {client.taxCode}
                    </span>
                  </div>
                )}
                {client.website && (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground shrink-0">
                      Website
                    </span>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 truncate"
                    >
                      {client.website}
                    </a>
                  </div>
                )}
                {client.firstContact && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Contact</span>
                    <span className="text-foreground/70">
                      {formatDate(client.firstContact)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added</span>
                  <span className="text-foreground/70">
                    {formatDate(client.createdAt)}
                  </span>
                </div>
                {client.tags?.length > 0 && (
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-muted-foreground shrink-0">Tags</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {client.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-hunter-elevated text-foreground/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
