"use client"

import BookmarkIcon from "@/components/bookmark_icon"
import CategoryBadge from "@/components/category_badge"
import type { Article } from "@/lib/types"

function relative_time(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(days / 365)
  return `${years}y ago`
}

function strip_html(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").trim()
}

interface FeedItemProps {
  article: Article
  bookmarked: boolean
  read: boolean
  onToggleBookmark: () => void
  onMarkRead: () => void
}

export default function FeedItem({
  article,
  bookmarked,
  read,
  onToggleBookmark,
  onMarkRead,
}: FeedItemProps) {
  const description = strip_html(article.description || article.content)
  const truncated = description.length > 200 ? description.slice(0, 200) + "..." : description

  return (
    <article
      className={`rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 transition-colors ${
        read ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onMarkRead}
            className="line-clamp-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            {article.title}
          </a>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            {article.feed_title && (
              <CategoryBadge category={article.feed_title} />
            )}
            <span>{relative_time(article.pub_date)}</span>
            {article.author && (
              <>
                <span>·</span>
                <span>{article.author}</span>
              </>
            )}
          </div>
          {truncated && (
            <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
              {truncated}
            </p>
          )}
        </div>
        <BookmarkIcon bookmarked={bookmarked} onClick={onToggleBookmark} />
      </div>
    </article>
  )
}
