import * as cheerio from "cheerio"
import { COMMON_FEED_PATHS, PLATFORM_PATTERNS, USER_AGENT } from "./constants"
import type { DiscoverResponse, DiscoveredFeed } from "./types"

const FETCH_OPTS: RequestInit = {
  headers: { "User-Agent": USER_AGENT },
  signal: AbortSignal.timeout(8_000),
}

async function is_feed_url(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { ...FETCH_OPTS, method: "HEAD" })
    const ct = res.headers.get("content-type") || ""
    return (
      res.ok &&
      (ct.includes("xml") ||
        ct.includes("rss") ||
        ct.includes("atom") ||
        ct.includes("json"))
    )
  } catch {
    return false
  }
}

function feed_type(type: string): DiscoveredFeed["type"] {
  if (type.includes("atom")) return "atom"
  if (type.includes("rss")) return "rss"
  return "unknown"
}

// Phase 1: Parse <link> tags from HTML
async function discover_link_tags(url: string): Promise<DiscoveredFeed[]> {
  try {
    const res = await fetch(url, FETCH_OPTS)
    if (!res.ok) return []
    const html = await res.text()
    const $ = cheerio.load(html)
    const feeds: DiscoveredFeed[] = []

    $('link[type="application/rss+xml"], link[type="application/atom+xml"]').each(
      (_, el) => {
        const href = $(el).attr("href")
        if (!href) return
        const resolved = new URL(href, url).href
        feeds.push({
          url: resolved,
          title: $(el).attr("title") || resolved,
          type: feed_type($(el).attr("type") || ""),
        })
      }
    )

    return feeds
  } catch {
    return []
  }
}

// Phase 2: Try common feed paths with HEAD requests
async function discover_common_paths(
  base_url: string
): Promise<DiscoveredFeed[]> {
  const origin = new URL(base_url).origin
  const results = await Promise.allSettled(
    COMMON_FEED_PATHS.map(async (path): Promise<DiscoveredFeed | null> => {
      const candidate = `${origin}${path}`
      const valid = await is_feed_url(candidate)
      return valid
        ? { url: candidate, title: candidate, type: "unknown" }
        : null
    })
  )

  return results
    .filter(
      (r): r is PromiseFulfilledResult<DiscoveredFeed> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value)
}

// Phase 3: Platform-specific patterns
async function discover_platform(url: string): Promise<DiscoveredFeed[]> {
  const parsed = new URL(url)
  const candidates: string[] = []

  for (const detect of Object.values(PLATFORM_PATTERNS)) {
    candidates.push(...detect(parsed))
  }

  const results = await Promise.allSettled(
    candidates.map(async (candidate): Promise<DiscoveredFeed | null> => {
      const resolved = new URL(candidate, url).href
      const valid = await is_feed_url(resolved)
      return valid
        ? { url: resolved, title: resolved, type: "unknown" }
        : null
    })
  )

  return results
    .filter(
      (r): r is PromiseFulfilledResult<DiscoveredFeed> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value)
}

function dedupe(feeds: DiscoveredFeed[]): DiscoveredFeed[] {
  const seen = new Set<string>()
  return feeds.filter((f) => {
    if (seen.has(f.url)) return false
    seen.add(f.url)
    return true
  })
}

export async function discover_feeds(
  url: string
): Promise<DiscoverResponse> {
  // First check if the URL itself is a feed
  if (await is_feed_url(url)) {
    return {
      feeds: [{ url, title: url, type: "unknown" }],
      is_direct_feed: true,
    }
  }

  // Run all three phases
  const [link_tags, common, platform] = await Promise.all([
    discover_link_tags(url),
    discover_common_paths(url),
    discover_platform(url),
  ])

  return {
    feeds: dedupe([...link_tags, ...common, ...platform]),
    is_direct_feed: false,
  }
}
