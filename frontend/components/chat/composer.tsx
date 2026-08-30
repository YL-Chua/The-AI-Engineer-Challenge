"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled: boolean
}

export function Composer({ value, onChange, onSend, disabled }: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize the textarea to fit content, up to a max height.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Respect IME composition (CJK input) before submitting on Enter.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  const canSend = !disabled && value.trim().length > 0

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-4">
        <div className="flex flex-1 items-end rounded-2xl border border-border bg-card focus-within:border-accenture/60">
          <label htmlFor="chat-input" className="sr-only">
            Message the AI Mental Coach
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Share what's on your mind..."
            className="max-h-40 flex-1 resize-none bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accenture focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            canSend
              ? "bg-accenture text-accenture-foreground hover:opacity-90"
              : "cursor-not-allowed bg-secondary text-muted-foreground",
          )}
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
