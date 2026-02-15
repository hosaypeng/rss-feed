import { NextRequest, NextResponse } from "next/server"
import { discover_feeds } from "@/lib/feed_discoverer"

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

  try {
    const result = await discover_feeds(url)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Discovery failed"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
