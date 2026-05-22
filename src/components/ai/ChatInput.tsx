"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SUGGESTED_PROMPTS = [
  "Summarize active projects",
  "Draft a client update email",
  "Suggest rendering optimizations",
  "Review pipeline bottlenecks",
];

interface ChatInputProps {
  onSend: (content: string) => void;
  isStreaming: boolean;
}

export function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              setValue(prompt);
              textareaRef.current?.focus();
            }}
            disabled={isStreaming}
            className="text-xs px-3 py-1.5 rounded-full border border-hunter-border bg-hunter-elevated text-muted-foreground hover:text-foreground hover:border-indigo-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-end bg-hunter-elevated border border-hunter-border rounded-xl p-3 focus-within:border-indigo-500/40 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={autoResize}
          placeholder="Ask anything about your projects, clients, or studio..."
          rows={1}
          disabled={isStreaming}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[24px] disabled:opacity-50"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!value.trim() || isStreaming}
          className={cn(
            "h-8 w-8 p-0 shrink-0 transition-colors",
            value.trim() && !isStreaming
              ? "bg-indigo-500 hover:bg-indigo-600 text-white"
              : "bg-hunter-border text-muted-foreground cursor-not-allowed"
          )}
        >
          {isStreaming ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
