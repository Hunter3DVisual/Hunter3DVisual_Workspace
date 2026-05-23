export const dynamic = "force-dynamic";

import { getTeamMembers } from "@/actions/team";
import { MemberCard } from "@/components/team/MemberCard";
import { TeamHeader } from "@/components/team/TeamHeader";
import { UsersRound } from "lucide-react";

interface TeamPageProps {
  searchParams: Promise<{ search?: string; role?: string }>;
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const { search, role } = await searchParams;

  const members = await getTeamMembers({ search, role });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <TeamHeader total={members.length} search={search} role={role} />

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-12 h-12 rounded-xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
            <UsersRound className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No members found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search
              ? `No results for "${search}"`
              : "Invite your first team member to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
