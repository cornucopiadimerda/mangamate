import { NextRequest, NextResponse } from 'next/server'

// Returns series cover URL from MyAnimeList via Jikan API (cached 7 days)
export async function GET(req: NextRequest) {
  const malId = new URL(req.url).searchParams.get('malId')
  if (!malId) return NextResponse.json({ coverUrl: null })

  try {
    const res = await fetch(`https://api.jikan.moe/v4/manga/${malId}`, {
      next: { revalidate: 604800 },
    })
    if (!res.ok) return NextResponse.json({ coverUrl: null })

    const data = await res.json()
    const coverUrl =
      data.data?.images?.jpg?.large_image_url ??
      data.data?.images?.jpg?.image_url ??
      null

    return NextResponse.json({ coverUrl }, {
      headers: { 'Cache-Control': 'public, s-maxage=604800' },
    })
  } catch {
    return NextResponse.json({ coverUrl: null })
  }
}
