export function ThinkingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="Coach is thinking">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3.5">
        <span className="sr-only">Coach is thinking</span>
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-accenture"
      style={{ animationDelay: delay, animationDuration: "1s" }}
    />
  )
}
