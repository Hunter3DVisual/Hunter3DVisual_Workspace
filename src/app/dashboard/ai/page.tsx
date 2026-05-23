export const dynamic = "force-dynamic";

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Trash2, Sparkles } from "lucide-react";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { ChatInput } from "@/components/ai/ChatInput";
import { getOrCreateSession, sendMessage, clearHistory } from "@/actions/ai";
import { MessageRole } from "@/types/ai";
import type { Message, ChatSession } from "@/types/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function AIPage() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getOrCreateSession().then((s) => {
      setSession(s as unknown as ChatSession);
      setMessages(s.messages as unknown as Message[]);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!session || isStreaming) return;

      const optimisticUser: Message = {
        id: crypto.randomUUID(),
        sessionId: session.id,
        role: MessageRole.USER,
        content,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, optimisticUser]);
      setIsStreaming(true);
      setStreamingText("");

      await sendMessage(session.id, content);

      const history = [...messages, optimisticUser].map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, sessionId: session.id }),
        });

        if (!res.ok || !res.body) throw new Error("Stream failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const raw = decoder.decode(value, { stream: true });
          const lines = raw.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.slice(2));
                accumulated += text;
                setStreamingText(accumulated);
              } catch {}
            }
          }
        }

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          sessionId: session.id,
          role: MessageRole.ASSISTANT,
          content: accumulated,
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setStreamingText("");
      } catch {
        setStreamingText("");
      } finally {
        setIsStreaming(false);
      }
    },
    [session, messages, isStreaming]
  );

  async function handleClear() {
    if (!session) return;
    await clearHistory(session.id);
    setMessages([]);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">Powered by Claude</p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground h-8 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-5 pb-4 pr-2">
          {messages.length === 0 && !isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">How can I help today?</p>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Ask me anything about your projects, clients, studio workflows, or rendering techniques.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatMessage key={msg.id} message={msg} index={i} />
            ))}
          </AnimatePresence>

          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              className="flex gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-hunter-elevated border border-hunter-border flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="bg-hunter-elevated border border-hunter-border rounded-xl px-4 py-3 text-sm leading-relaxed max-w-[76%]">
                {streamingText ? (
                  <>
                    <p className="whitespace-pre-wrap break-words">{streamingText}</p>
                    <span className="inline-block w-0.5 h-3.5 bg-indigo-400 animate-pulse ml-0.5 align-middle" />
                  </>
                ) : (
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="pt-4 border-t border-hunter-border shrink-0">
        <ChatInput onSend={handleSend} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
