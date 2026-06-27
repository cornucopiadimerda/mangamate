'use client'

import { useState, useEffect } from 'react'
import { CollectionSeries } from '@/lib/types/manga.types'
import { CoverPlaceholder, MissingVolumePlaceholder } from '@/components/ui/CoverPlaceholder'
import { useCollectionStore } from '@/lib/store/collection'
import { Heart, X } from 'lucide-react'

interface VolumeShelfProps {
  series: CollectionSeries
}

async function fetchVolumeCover(title: string, volume: number, publisher: string): Promise<string | null> {
  try {
    const q = `${title} ${volume} ${publisher}`
    const res = await fetch(`/api/volume-cover?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    return data.coverUrl ?? null
  } catch {
    return null
  }
}

export function VolumeShelf({ series }: VolumeShelfProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useCollectionStore()
  const [toast, setToast] = useState<string | null>(null)
  const [volumeCovers, setVolumeCovers] = useState<Record<number, string>>({})

  // Fetch covers for owned volumes (cap at 30 to avoid too many requests)
  useEffect(() => {
    const toFetch = series.ownedVolumes.slice(0, 30)
    toFetch.forEach(async (vol) => {
      const url = await fetchVolumeCover(series.title, vol, series.publisher)
      if (url) setVolumeCovers(prev => ({ ...prev, [vol]: url }))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series.id])

  const total = series.totalVolumes ?? Math.max(...series.ownedVolumes, 0)
  const allVolumes = Array.from({ length: total }, (_, i) => i + 1)

  const handleMissingPress = (vol: number) => {
    const alreadyIn = isInWishlist(series.id, vol)
    if (alreadyIn) {
      const entry = wishlist.find(e => e.seriesId === series.id && e.volumeNumber === vol)
      if (entry) removeFromWishlist(entry.id)
      showToast(`Vol. ${vol} rimosso dalla wishlist`)
    } else {
      addToWishlist({
        id: `${series.id}-${vol}-${Date.now()}`,
        seriesId: series.id,
        seriesTitle: series.title,
        volumeNumber: vol,
        addedAt: Date.now(),
      })
      showToast(`Vol. ${vol} aggiunto alla wishlist ♥`)
    }
  }

  const handleMissingLongPress = (vol: number) => {
    const query = encodeURIComponent(`${series.title} volume ${vol} ${series.publisher}`)
    window.open(`https://www.amazon.it/s?k=${query}`, '_blank', 'noopener')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="relative">
      {/* Toast notification */}
      {toast && (
        <div
          className="absolute animate-fade-in"
          style={{
            top: -48, left: 16, right: 16, zIndex: 10,
            background: '#1C1C1E', border: '1px solid #2C2C2E',
            borderRadius: 12, padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{toast}</span>
          <button onClick={() => setToast(null)}><X size={14} color="#8E8E93" /></button>
        </div>
      )}

      {/* Shelf */}
      <div className="volume-shelf px-4">
        {allVolumes.map((vol) => {
          const owned = series.ownedVolumes.includes(vol)
          const inWishlist = isInWishlist(series.id, vol)
          const coverUrl = volumeCovers[vol]

          if (owned) {
            return (
              <div key={vol} className="flex-shrink-0 relative" style={{ width: 72, height: 108 }}>
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverUrl}
                    alt={`${series.title} vol. ${vol}`}
                    style={{ width: 72, height: 108, objectFit: 'cover', borderRadius: 6, display: 'block' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <CoverPlaceholder
                    seriesId={series.id}
                    title={series.title}
                    volume={vol}
                    width={72}
                    height={108}
                  />
                )}
                {/* Volume number badge */}
                <div style={{
                  position: 'absolute', bottom: 4, right: 4,
                  background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '1px 5px',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>{vol}</span>
                </div>
              </div>
            )
          }

          return (
            <div key={vol} className="flex-shrink-0 relative">
              <MissingVolumePlaceholder
                volume={vol}
                width={72}
                height={108}
                inWishlist={inWishlist}
                onPress={() => handleMissingPress(vol)}
                onAmazon={() => handleMissingLongPress(vol)}
              />
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#3d1a00' }} />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Posseduto</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1C1C1E', border: '1.5px dashed #3A3A3C' }} />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Tocca = wishlist</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 11, color: '#8E8E93' }}>🛒 = Amazon</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={10} color="#FF3B30" fill="#FF3B30" />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>In wishlist</span>
        </div>
      </div>
    </div>
  )
}
