"use client"

interface BookmarkIconProps {
  bookmarked: boolean
  onClick: () => void
}

export default function BookmarkIcon({ bookmarked, onClick }: BookmarkIconProps) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded p-1 transition-colors hover:bg-[var(--border)]"
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <svg
        className={`h-5 w-5 ${bookmarked ? "fill-[var(--accent)] text-[var(--accent)]" : "fill-none text-[var(--muted)]"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  )
}
