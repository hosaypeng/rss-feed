"use client"

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93v-2.83z" />
          </svg>
          <h1 className="text-lg font-semibold">RSS Reader</h1>
        </div>
      </div>
    </header>
  )
}
