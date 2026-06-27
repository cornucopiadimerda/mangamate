'use client'

// Affiliate revenue: register at https://programma-affiliazione.amazon.it/
// then set NEXT_PUBLIC_AMAZON_TAG in .env.local (e.g. mangamate-21)
const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? ''

function buildShopOptions(title: string, volume: number, publisher: string) {
  const q = encodeURIComponent(`${title} ${volume}`)
  const amazonTag = AMAZON_TAG ? `&tag=${AMAZON_TAG}` : ''
  const pub = publisher.toLowerCase()

  let publisherOpt: { name: string; emoji: string; url: string } | null = null
  if (pub.includes('star')) {
    publisherOpt = { name: 'Star Comics', emoji: '⭐', url: `https://www.starcomics.com/?s=${encodeURIComponent(title)}` }
  } else if (pub.includes('panini') || pub.includes('planet')) {
    publisherOpt = { name: 'Planet Manga', emoji: '🪐', url: `https://www.paninicomics.it/?s=${encodeURIComponent(title)}` }
  } else if (pub.includes('j-pop') || pub.includes('jpop')) {
    publisherOpt = { name: 'J-Pop', emoji: '🎌', url: `https://www.jpopmanga.it/?s=${encodeURIComponent(title)}` }
  } else if (pub.includes('edizioni bd') || pub.includes('bd')) {
    publisherOpt = { name: 'Edizioni BD', emoji: '📚', url: `https://www.edizionibd.it/ricerca/?q=${encodeURIComponent(title)}` }
  }

  return [
    {
      name: 'Amazon.it',
      emoji: '🛒',
      subtitle: 'Spedizione veloce',
      url: `https://www.amazon.it/s?k=${q}&rh=n%3A411664031${amazonTag}`,
      primary: true,
    },
    {
      name: 'MangaYo',
      emoji: '📱',
      subtitle: 'Leggi e acquista online',
      url: `https://www.mangayo.com/collections/all?q=${q}`,
      primary: false,
    },
    ...(publisherOpt ? [{
      name: publisherOpt.name,
      emoji: publisherOpt.emoji,
      subtitle: 'Sito ufficiale publisher',
      url: publisherOpt.url,
      primary: false,
    }] : []),
  ]
}

interface ShopModalProps {
  title: string
  volume: number
  publisher: string
  onClose: () => void
}

export function ShopModal({ title, volume, publisher, onClose }: ShopModalProps) {
  const options = buildShopOptions(title, volume, publisher)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full animate-fade-in"
        style={{ background: '#1C1C1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-4">
          <div style={{ width: 36, height: 4, background: '#3A3A3C', borderRadius: 99 }} />
        </div>
        <div className="px-5 pb-2">
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>Dove acquistare</h3>
          <p style={{ fontSize: 13, color: '#8E8E93', marginBottom: 20 }}>{title} — Vol. {volume}</p>
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <a
                key={opt.name}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-scale flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: opt.primary ? '#FF3B30' : '#2C2C2E', textDecoration: 'none' }}
                onClick={onClose}
              >
                <span style={{ fontSize: 26 }}>{opt.emoji}</span>
                <div className="flex-1">
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{opt.name}</p>
                  <p style={{ fontSize: 11, color: opt.primary ? 'rgba(255,255,255,0.7)' : '#8E8E93' }}>{opt.subtitle}</p>
                </div>
                <span style={{ fontSize: 18, color: opt.primary ? 'rgba(255,255,255,0.6)' : '#48484A' }}>›</span>
              </a>
            ))}
          </div>
          {!AMAZON_TAG && (
            <p style={{ fontSize: 10, color: '#3A3A3C', marginTop: 16, textAlign: 'center', lineHeight: 1.5 }}>
              Link senza affiliazione · Registrati su Amazon Associates IT per guadagnare commissioni
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
