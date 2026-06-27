'use client'

import { useState } from 'react'
import { CollectionSeries } from '@/lib/types/manga.types'
import { CoverPlaceholder, MissingVolumePlaceholder } from '@/components/ui/CoverPlaceholder'
import { useCollectionStore } from '@/lib/store/collection'
import { Heart, X } from 'lucide-react'

interface VolumeShelfProps {
  series: CollectionSeries
}

export function VolumeShelf({ series }: VolumeShelfProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useCollectionStore()
  const [toast, setToast] = useState<string | null>(null)

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

          if (owned) {
            return (
              <div key={vol} className="flex-shrink-0 relative">
                <CoverPlaceholder
                  seriesId={series.id}
                  title={series.title}
                  volume={vol}
                  width={72}
                  height={108}
                />
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
              />
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#3d1a00' }} />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Posseduto</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1C1C1E', border: '1.5px dashed #3A3A3C' }} />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Tocca per aggiungere alla wishlist</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={10} color="#FF3B30" fill="#FF3B30" />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>In wishlist</span>
        </div>
      </div>
    </div>
  )
}
