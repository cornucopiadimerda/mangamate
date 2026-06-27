import { NextRequest, NextResponse } from 'next/server'

// Returns all volume covers for a manga from MangaDex — one request per series
export async function GET(req: NextRequest) {
  const title = new URL(req.url).searchParams.get('title')
  if (!title) return NextResponse.json({ covers: {} })

  try {
    // Search manga by title
    const searchRes = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5&contentRating[]=safe&contentRating[]=suggestive`,
      { next: { revalidate: 86400 } }
    )
    if (!searchRes.ok) return NextResponse.json({ covers: {} })

    const searchData = await searchRes.json()
    const mangaId: string | undefined = searchData.data?.[0]?.id
    if (!mangaId) return NextResponse.json({ covers: {} })

    // Get all covers ordered by volume
    const coversRes = await fetch(
      `https://api.mangadex.org/cover?manga[]=${mangaId}&limit=100&order[volume]=asc`,
      { next: { revalidate: 86400 } }
    )
    if (!coversRes.ok) return NextResponse.json({ covers: {} })

    const coversData = await coversRes.json()
    const covers: Record<string, string> = {}

    for (const item of coversData.data ?? []) {
      const volume: string | null = item.attributes?.volume
      const filename: string | null = item.attributes?.fileName
      if (volume && filename) {
        covers[volume] = `https://uploads.mangadex.org/covers/${mangaId}/${filename}.512.jpg`
      }
    }

    return NextResponse.json({ covers, mangaId }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    })
  } catch {
    return NextResponse.json({ covers: {} })
  }
}
