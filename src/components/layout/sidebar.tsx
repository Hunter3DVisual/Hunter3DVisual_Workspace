"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  GitBranch,
  DollarSign,
  FileText,
  Layers,
  CheckSquare,
  UsersRound,
  BrainCircuit,
  Zap,
  Settings,
  ChevronRight,
} from "lucide-react";

const navGroups = [
  {
    label: "Core",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
      { href: "/dashboard/clients", label: "Clients", icon: Users },
    ],
  },
  {
    label: "Production",
    items: [
      { href: "/dashboard/pipeline", label: "Pipeline", icon: GitBranch },
      { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/dashboard/assets", label: "Asset Library", icon: Layers },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/dashboard/finance", label: "Finance", icon: DollarSign },
      { href: "/dashboard/invoices", label: "Quotes & Invoices", icon: FileText },
      { href: "/dashboard/documents", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Studio",
    items: [
      { href: "/dashboard/team", label: "Team", icon: UsersRound },
      { href: "/dashboard/ai", label: "AI Assistant", icon: BrainCircuit },
      { href: "/dashboard/automation", label: "Automation", icon: Zap },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-full bg-hunter-surface border-r border-hunter-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-hunter-border shrink-0",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <div className="shrink-0 flex items-center justify-center w-8 h-8">
            <img
              src="/logo.png"
              alt="Hunter3Dvisual"
              height={32}
              width={32}
              className="h-8 w-auto object-contain"
            />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
            >
              <p className="text-sm font-semibold text-foreground leading-none">Hunter3Dvisual</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Studio Workspace</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                {!collapsed && (
                  <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150 group relative",
                          isActive
                            ? "bg-indigo-500/15 text-indigo-400 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-hunter-elevated",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                          />
                        )}
                        <Icon className={cn(
                          "shrink-0 transition-colors",
                          collapsed ? "w-5 h-5" : "w-4 h-4",
                          isActive ? "text-indigo-400" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {!collapsed && (
                          <span className="relative">{item.label}</span>
                        )}
                        {!collapsed && isActive && (
                          <ChevronRight className="ml-auto w-3 h-3 text-indigo-400/60" />
                        )}
                      </Link>
                    );

                    if (collapsed) {
                      return (
                        <li key={item.href}>
                          <Tooltip>
                            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        </li>
                      );
                    }

                    return <li key={item.href}>{linkContent}</li>;
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className={cn("shrink-0 p-2 border-t border-hunter-border")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-hunter-elevated transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-hunter-elevated transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
