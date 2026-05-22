"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MemberStatus } from "@/types/team";
import type { TeamMemberWithStats } from "@/types/team";

const ROLE_COLORS: Record<string, string> = {
  owner: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  admin: "text-violet-400 border-violet-400/30 bg-violet-400/10",
  lead: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  artist: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  member: "text-slate-400 border-slate-400/30 bg-slate-400/10",
};

const STATUS_DOT: Record<MemberStatus, string> = {
  [MemberStatus.ONLINE]: "bg-emerald-500 shadow-[0_0_6px_1px_rgba(16,185,129,0.5)]",
  [MemberStatus.IDLE]: "bg-amber-400 shadow-[0_0_6px_1px_rgba(251,191,36,0.4)]",
  [MemberStatus.OFFLINE]: "bg-slate-600",
};

interface MemberCardProps {
  member: TeamMemberWithStats;
  index?: number;
}

export function MemberCard({ member, index = 0 }: MemberCardProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleColor = ROLE_COLORS[member.role] ?? ROLE_COLORS.member;
  const statusDot = STATUS_DOT[member.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card glow className="group">
        <CardContent className="p-5 flex flex-col items-center text-center gap-3">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={member.avatar ?? undefined} alt={member.name} />
              <AvatarFallback className="text-sm font-semibold bg-hunter-elevated">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-hunter-surface",
                statusDot
              )}
            />
          </div>

          <div className="space-y-1 min-w-0 w-full">
            <p className="text-sm font-semibold text-foreground group-hover:text-indigo-300 transition-colors truncate">
              {member.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
          </div>

          <span
            className={cn(
              "text-[10px] font-medium px-2.5 py-0.5 rounded-full border capitalize",
              roleColor
            )}
          >
            {member.role}
          </span>

          <div className="flex items-center justify-center gap-4 w-full pt-2 border-t border-hunter-border">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground font-mono">
                {member.activeProjects}
              </p>
              <p className="text-[10px] text-muted-foreground">Active</p>
            </div>
            <div className="w-px h-6 bg-hunter-border" />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground font-mono">
                {member.totalProjects}
              </p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
