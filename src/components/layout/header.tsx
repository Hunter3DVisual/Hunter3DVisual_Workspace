"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Bell, Search, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/clients": "Clients CRM",
  "/pipeline": "Production Pipeline",
  "/tasks": "Tasks",
  "/assets": "Asset Library",
  "/finance": "Finance",
  "/quotes": "Quotes & Invoices",
  "/team": "Team Workspace",
  "/ai": "AI Assistant",
  "/automation": "Automation",
  "/settings": "Settings",
};

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ collapsed, onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const label = Object.entries(routeLabels).find(([route]) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  )?.[1] ?? "Workspace";

  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-hunter-border bg-hunter-surface/80 backdrop-blur-sm shrink-0">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleSidebar}
        className="text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </Button>

      <div className="h-4 w-px bg-hunter-border" />

      <h1 className="text-sm font-semibold text-foreground">{label}</h1>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search anything..."
          className="pl-9 h-8 w-64 text-xs bg-hunter-elevated/50"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/60 font-mono border border-hunter-border rounded px-1">
          ⌘K
        </kbd>
      </div>

      {/* AI Quick access */}
      <Button variant="secondary" size="sm" className="gap-1.5 text-xs hidden md:flex">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        Ask AI
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon-sm" className="relative text-muted-foreground hover:text-foreground">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
      </Button>

      {/* User */}
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          },
        }}
      />
    </header>
  );
}
