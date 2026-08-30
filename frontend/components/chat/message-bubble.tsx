import { cn } from "@/lib/utils"
import type { Message } from "./types"

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap text-pretty rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
          isUser && "rounded-br-sm bg-accenture text-accenture-foreground",
          !isUser && !message.isError && "rounded-bl-sm bg-secondary text-secondary-foreground",
          message.isError && "rounded-bl-sm border border-destructive/40 bg-destructive/15 text-foreground",
        )}
      >
        {message.isError && (
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-destructive">Error</span>
        )}
        {message.content}
      </div>
    </div>
  )
}
