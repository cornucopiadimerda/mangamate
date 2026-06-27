import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')
  if (!q) return NextResponse.json({ coverUrl: null })

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=5`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return NextResponse.json({ coverUrl: null })

    const data = await res.json()
    const items: Array<{ volumeInfo?: { imageLinks?: { thumbnail?: string; smallThumbnail?: string } } }> = data.items ?? []

    for (const item of items) {
      const links = item.volumeInfo?.imageLinks
      const raw = links?.thumbnail || links?.smallThumbnail
      if (raw) {
        // Upgrade quality and force HTTPS
        const coverUrl = raw
          .replace('http://', 'https://')
          .replace('zoom=1', 'zoom=3')
          .replace('&edge=curl', '')
        return NextResponse.json({ coverUrl })
      }
    }
    return NextResponse.json({ coverUrl: null })
  } catch {
    return NextResponse.json({ coverUrl: null })
  }
}
