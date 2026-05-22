"use server";

import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { MemberStatus } from "@/types/team";
import type { InviteMemberInput, TeamFilters } from "@/types/team";

function derivedStatus(updatedAt: Date): MemberStatus {
  const diff = Date.now() - updatedAt.getTime();
  if (diff < 3_600_000) return MemberStatus.ONLINE;
  if (diff < 86_400_000) return MemberStatus.IDLE;
  return MemberStatus.OFFLINE;
}

export async function getTeamMembers(filters: TeamFilters = {}) {
  const { search, role } = filters;

  const users = await db.user.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role }),
    },
    include: {
      teamMembers: {
        include: {
          project: { select: { status: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    timezone: u.timezone,
    createdAt: u.createdAt,
    status: derivedStatus(u.updatedAt),
    activeProjects: u.teamMembers.filter(
      (tm) => tm.project.status !== "DELIVERED" && tm.project.status !== "ARCHIVED"
    ).length,
    totalProjects: u.teamMembers.length,
  }));
}

export async function inviteMember(input: InviteMemberInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const client = await clerkClient();
  await client.invitations.createInvitation({
    emailAddress: input.email,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
    publicMetadata: { role: input.role },
    ignoreExisting: true,
  });
}

export async function updateMemberRole(id: string, role: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.user.update({
    where: { id },
    data: { role },
  });
}
