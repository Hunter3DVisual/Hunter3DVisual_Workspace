export enum TeamRole {
  OWNER = "owner",
  ADMIN = "admin",
  LEAD = "lead",
  ARTIST = "artist",
  MEMBER = "member",
}

export enum MemberStatus {
  ONLINE = "online",
  IDLE = "idle",
  OFFLINE = "offline",
}

export type TeamMemberWithStats = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  timezone: string;
  createdAt: Date;
  status: MemberStatus;
  activeProjects: number;
  totalProjects: number;
};

export type InviteMemberInput = {
  email: string;
  role: TeamRole;
};

export type TeamFilters = {
  search?: string;
  role?: string;
};
