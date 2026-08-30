"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Message } from "./types"
import { MessageBubble } from "./message-bubble"
import { ThinkingIndicator } from "./thinking-indicator"
import { EmptyState } from "./empty-state"
import { Composer } from "./composer"

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the newest message whenever messages change or loading toggles.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, isLoading])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const userMessage: Message = { id: createId(), role: "user", content: trimmed }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Backend is stateless: send only the newest user message.
          body: JSON.stringify({ message: trimmed }),
        })

        if (!res.ok) {
          let detail = `Request failed (${res.status})`
          try {
            const data = await res.json()
            if (data?.detail) detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)
          } catch {
            // response wasn't JSON; keep the status-based message
          }
          throw new Error(detail)
        }

        const data = await res.json()
        const reply = typeof data?.reply === "string" ? data.reply : "I received an unexpected response."
        setMessages((prev) => [...prev, { id: createId(), role: "assistant", content: reply }])
      } catch (err) {
        const messageText =
          err instanceof Error ? err.message : "Something went wrong reaching the coach. Please try again."
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            content: `${messageText} Your message is still in the box below — feel free to try again.`,
            isError: true,
          },
        ])
        // Restore the user's text so they can retry.
        setInput(trimmed)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-accenture text-lg font-bold text-accenture-foreground"
            aria-hidden="true"
          >
            {">"}
          </span>
          <div>
            <h1 className="text-base font-semibold leading-none text-foreground">AI Mental Coach</h1>
            <p className="mt-1 text-xs text-muted-foreground">Here to support you, one step at a time</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="h-full py-8">
            <EmptyState onPick={(prompt) => sendMessage(prompt)} />
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6" role="log" aria-live="polite">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <ThinkingIndicator />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <Composer value={input} onChange={setInput} onSend={() => sendMessage(input)} disabled={isLoading} />
    </div>
  )
}
