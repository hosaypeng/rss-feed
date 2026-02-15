export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="mb-4 h-16 w-16 text-[var(--muted)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93v-2.83z"
        />
      </svg>
      <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
        No feeds yet
      </h2>
      <p className="mb-1 max-w-sm text-sm text-[var(--muted)]">
        Add your first RSS feed to start reading. Paste any website or feed URL
        and we will find the feed for you.
      </p>
      <p className="text-xs text-[var(--muted)]">
        Supports RSS, Atom, Substack, Medium, YouTube, and more.
      </p>
    </div>
  )
}
