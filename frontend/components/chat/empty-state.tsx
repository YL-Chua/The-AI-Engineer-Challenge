const EXAMPLES = [
  {
    title: "Managing stress",
    prompt: "I've been feeling really stressed at work lately. How can I manage it better?",
  },
  {
    title: "Building confidence",
    prompt: "I struggle with self-doubt. What are some ways I can build more confidence?",
  },
  {
    title: "Staying motivated",
    prompt: "I keep losing motivation with my goals. How do I stay consistent?",
  },
]

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accenture/15">
        <span className="text-2xl font-bold text-accenture" aria-hidden="true">
          {">"}
        </span>
      </div>
      <h2 className="text-balance text-xl font-semibold text-foreground sm:text-2xl">
        How can I support you today?
      </h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        I&apos;m your AI mental coach. Ask me anything, or start with one of these.
      </p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
        {EXAMPLES.map((example) => (
          <button
            key={example.title}
            type="button"
            onClick={() => onPick(example.prompt)}
            className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-accenture/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accenture"
          >
            <span className="text-sm font-medium text-foreground">{example.title}</span>
            <span className="text-xs leading-relaxed text-muted-foreground">{example.prompt}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
