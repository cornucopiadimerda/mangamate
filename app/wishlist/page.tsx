'use client'

import { useCollectionStore } from '@/lib/store/collection'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { SERIES_COLORS } from '@/lib/data/mock'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useCollectionStore()

  const groupedBySeriesId = wishlist.reduce<Record<string, typeof wishlist>>((acc, item) => {
    if (!acc[item.seriesId]) acc[item.seriesId] = []
    acc[item.seriesId].push(item)
    return acc
  }, {})

  return (
    <div style={{ background: '#080808', minHeight: '100dvh' }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', letterSpacing: -0.5 }}>
          Wishlist
        </h1>
        <p style={{ fontSize: 14, color: '#8E8E93', marginTop: 4 }}>
          {wishlist.length} {wishlist.length === 1 ? 'volume' : 'volumi'} da trovare
        </p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="px-5 flex flex-col gap-5">
          {Object.entries(groupedBySeriesId).map(([seriesId, items]) => {
            const colors = SERIES_COLORS[seriesId] ?? { from: '#1a1a2e', to: '#16213e', text: '#E94560' }
            const sorted = [...items].sort((a, b) => a.volumeNumber - b.volumeNumber)

            return (
              <div key={seriesId}>
                {/* Series header */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    style={{
                      width: 4,
                      height: 20,
                      borderRadius: 99,
                      background: colors.text,
                    }}
                  />
                  <Link href={`/collection/${seriesId}`}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                      {items[0].seriesTitle}
                    </h2>
                  </Link>
                  <span style={{ fontSize: 12, color: '#8E8E93' }}>
                    {items.length} {items.length === 1 ? 'volume' : 'volumi'}
                  </span>
                </div>

                {/* Volume items */}
                <div className="flex flex-col gap-2">
                  {sorted.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3.5 rounded-2xl"
                      style={{ background: '#1C1C1E', border: '1px solid #2C2C2E' }}
                    >
                      {/* Color dot */}
                      <div
                        className="flex-shrink-0 flex items-center justify-center rounded-xl"
                        style={{ width: 44, height: 44, background: `${colors.from}` }}
                      >
                        <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>
                          {item.volumeNumber}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
                          Volume {item.volumeNumber}
                        </p>
                        <p style={{ fontSize: 11, color: '#8E8E93', marginTop: 1 }}>
                          Aggiunto {new Date(item.addedAt).toLocaleDateString('it-IT')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          className="tap-scale flex items-center justify-center rounded-xl"
                          style={{ width: 36, height: 36, background: 'rgba(255,59,48,0.12)' }}
                          title="Cerca su Amazon"
                        >
                          <ShoppingCart size={16} color="#FF3B30" />
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="tap-scale flex items-center justify-center rounded-xl"
                          style={{ width: 36, height: 36, background: '#2C2C2E' }}
                        >
                          <Trash2 size={16} color="#8E8E93" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Footer tip */}
          <div
            className="flex items-start gap-3 p-4 rounded-2xl mb-4"
            style={{ background: '#1C1C1E', border: '1px solid #2C2C2E' }}
          >
            <ShoppingCart size={16} color="#8E8E93" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#8E8E93', lineHeight: 1.5 }}>
              Prossimamente: acquisto diretto dei volumi mancanti con link affiliati Amazon. Troverai il prezzo migliore senza cercare manualmente.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-8 text-center" style={{ paddingTop: 80 }}>
      <div
        className="flex items-center justify-center rounded-3xl mb-6"
        style={{ width: 80, height: 80, background: '#1C1C1E' }}
      >
        <Heart size={36} color="#48484A" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>Wishlist vuota</h2>
      <p style={{ fontSize: 14, color: '#8E8E93', marginTop: 8, lineHeight: 1.6 }}>
        I volumi mancanti dalla tua collezione appariranno qui automaticamente
      </p>
      <Link href="/collection" className="tap-scale mt-8 block">
        <div
          className="flex items-center gap-2 px-6 rounded-2xl"
          style={{ height: 52, background: '#1C1C1E', border: '1px solid #2C2C2E' }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>Vai alla collezione</span>
        </div>
      </Link>
    </div>
  )
}
