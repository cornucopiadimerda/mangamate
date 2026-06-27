import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const PROMPT = `Sei un esperto di manga fisici. Analizza questa copertina e rispondi SOLO con un oggetto JSON valido, senza testo extra, con questi campi esatti:
{
  "series": "nome della serie in italiano se disponibile",
  "volumeNumber": numero_intero,
  "language": "Italiano" oppure "Inglese" oppure "Giapponese",
  "publisher": "nome publisher (es: Panini Comics, Star Comics, Planet Manga, J-Pop, Edizioni BD)",
  "edition": "Standard" oppure "Deluxe" oppure "Omnibus" oppure "Perfect" oppure altra edizione visibile",
  "author": "cognome e nome del mangaka/autore",
  "isbn": "codice ISBN a 13 cifre se visibile sulla copertina, altrimenti null",
  "confidence": numero tra 0.0 e 1.0
}

Se non è un manga o non riesci a riconoscerlo, usa confidence: 0.1.`

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json()

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // Strip data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: PROMPT },
              { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
            ],
          }],
          generationConfig: { temperature: 0.1 },
        }),
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Gemini API error:', res.status, errorText)
      return NextResponse.json(
        { error: `Gemini error ${res.status}`, detail: errorText, apiKeyInvalid: res.status === 400 || res.status === 403 },
        { status: 502 }
      )
    }

    const geminiData = await res.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 502 })
    }

    // Extract JSON — Gemini sometimes wraps it in ```json ... ``` blocks
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/) || rawText.match(/(\{[\s\S]*\})/)
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawText
    const result = JSON.parse(jsonStr.trim())

    // Fetch cover from Open Library by ISBN (no auth needed)
    let coverUrl: string | null = null
    if (result.isbn) {
      const cleanIsbn = result.isbn.replace(/[^0-9X]/g, '')
      const testUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`
      try {
        const coverRes = await fetch(testUrl, { method: 'HEAD' })
        // Open Library returns a 1x1 gif when no cover found
        const contentLength = coverRes.headers.get('content-length')
        if (coverRes.ok && contentLength && parseInt(contentLength) > 1000) {
          coverUrl = testUrl
        }
      } catch {
        // Cover not available, no problem
      }
    }

    return NextResponse.json({ ...result, coverUrl })
  } catch (err) {
    console.error('Recognition route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
