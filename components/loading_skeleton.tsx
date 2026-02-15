export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="skeleton-pulse h-5 w-3/4 rounded bg-[var(--border)]" />
              <div className="skeleton-pulse h-4 w-1/3 rounded bg-[var(--border)]" />
              <div className="space-y-2">
                <div className="skeleton-pulse h-3 w-full rounded bg-[var(--border)]" />
                <div className="skeleton-pulse h-3 w-5/6 rounded bg-[var(--border)]" />
              </div>
            </div>
            <div className="skeleton-pulse h-5 w-5 rounded bg-[var(--border)]" />
          </div>
        </div>
      ))}
    </div>
  )
}
