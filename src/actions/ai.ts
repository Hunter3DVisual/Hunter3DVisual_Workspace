"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MessageRole } from "@/types/ai";

export async function getOrCreateSession() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  let session = await db.chatSession.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session) {
    session = await db.chatSession.create({
      data: { userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }

  return session;
}

export async function getChatHistory(sessionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
}

export async function sendMessage(sessionId: string, content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.chatMessage.create({
    data: { sessionId, role: MessageRole.USER, content },
  });
}

export async function saveAssistantMessage(sessionId: string, content: string) {
  return db.chatMessage.create({
    data: { sessionId, role: MessageRole.ASSISTANT, content },
  });
}

export async function clearHistory(sessionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.chatMessage.deleteMany({ where: { sessionId } });
  await db.chatSession.update({
    where: { id: sessionId },
    data: { title: "New Chat", updatedAt: new Date() },
  });

  revalidatePath("/ai");
}
