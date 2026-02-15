import { NextRequest, NextResponse } from "next/server"
import { cache_get, cache_set } from "@/lib/cache"
import { parse_feed } from "@/lib/feed_parser"
import { CACHE_TTL } from "@/lib/constants"
import type { FeedResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json(
      { error: "Missing ?url= parameter" },
      { status: 400 }
    )
  }

  try {
    new URL(url)
  } catch {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    )
  }

  const cache_key = `feed:${url}`
  const cached = cache_get<FeedResponse>(cache_key)

  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TTL / 1000}, stale-while-revalidate=60`,
        "X-Cache": "HIT",
      },
    })
  }

  try {
    const data = await parse_feed(url)
    cache_set(cache_key, data)

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TTL / 1000}, stale-while-revalidate=60`,
        "X-Cache": "MISS",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch feed"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
