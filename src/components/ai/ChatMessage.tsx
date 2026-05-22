"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Bot, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageRole } from "@/types/ai";
import type { Message } from "@/types/ai";

interface ChatMessageProps {
  message: Message;
  index?: number;
}

export function ChatMessage({ message, index = 0 }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === MessageRole.USER;

  async function copy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.4) }}
      className={cn("flex gap-3 group", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          isUser
            ? "bg-indigo-500/20 border border-indigo-500/30"
            : "bg-hunter-elevated border border-hunter-border"
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
        )}
      </div>

      <div className={cn("flex flex-col gap-1 max-w-[76%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-indigo-500/12 border border-indigo-500/20 text-foreground"
              : "bg-hunter-elevated border border-hunter-border text-foreground"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-1",
            isUser && "flex-row-reverse"
          )}
        >
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          <button
            onClick={copy}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy message"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
