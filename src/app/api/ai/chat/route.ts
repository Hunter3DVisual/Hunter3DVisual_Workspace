import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const anthropic = createAnthropic();

const SYSTEM_PROMPT = `You are an AI assistant for an Archviz studio called Hunter3Dvisual. You help with:
- Project management, timelines, and workflow optimization
- Client communications and proposals
- Technical rendering guidance (lighting, materials, post-processing)
- Production pipeline troubleshooting
- Creative direction and concept development
- Finance and invoicing insights
Be concise, professional, and actionable.`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { messages, sessionId } = await req.json();

  const result = streamText({
    model: anthropic("claude-opus-4-7"),
    system: SYSTEM_PROMPT,
    messages,
    onFinish: async ({ text }) => {
      if (sessionId && text) {
        await db.chatMessage.create({
          data: { sessionId, role: "assistant", content: text },
        });
        await db.chatSession.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() },
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
