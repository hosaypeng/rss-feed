export const STORAGE_KEYS = {
  FEEDS: "rss_feeds",
  BOOKMARKS: "rss_bookmarks",
  READ: "rss_read",
} as const

export const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const MAX_READ_IDS = 10_000

export const COMMON_FEED_PATHS = [
  "/feed",
  "/feed/",
  "/rss",
  "/rss/",
  "/rss.xml",
  "/atom.xml",
  "/feed.xml",
  "/index.xml",
  "/feeds/posts/default",
  "/?feed=rss2",
]

export const PLATFORM_PATTERNS: Record<string, (url: URL) => string[]> = {
  substack: (url) =>
    url.hostname.endsWith(".substack.com")
      ? [`${url.origin}/feed`]
      : [],
  medium: (url) =>
    url.hostname === "medium.com" || url.hostname.endsWith(".medium.com")
      ? [`${url.origin}/feed${url.pathname}`]
      : [],
  wordpress: () => ["/feed", "/feed/atom"],
  ghost: () => ["/rss/"],
  youtube: (url) => {
    const match = url.pathname.match(/\/(channel|c|@)(\/[^/]+|[^/]+)/)
    if (match) {
      const id = match[2].startsWith("/") ? match[2].slice(1) : match[2]
      return [`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`]
    }
    return []
  },
}

export const DEFAULT_CATEGORIES = [
  "Uncategorized",
  "Tech",
  "News",
  "Blog",
  "Podcast",
] as const

export const USER_AGENT =
  "Mozilla/5.0 (compatible; RSSReader/1.0; +https://rss-reader.vercel.app)"
