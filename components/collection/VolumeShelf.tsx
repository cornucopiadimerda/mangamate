'use client'

import { useState, useEffect } from 'react'
import { CollectionSeries } from '@/lib/types/manga.types'
import { CoverPlaceholder, MissingVolumePlaceholder } from '@/components/ui/CoverPlaceholder'
import { ShopModal } from '@/components/ui/ShopModal'
import { useCollectionStore } from '@/lib/store/collection'
import { X } from 'lucide-react'

interface ShopTarget { title: string; volume: number; publisher: string }

export function VolumeShelf({ series }: { series: CollectionSeries }) {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useCollectionStore()
  const [toast, setToast] = useState<string | null>(null)
  const [shopTarget, setShopTarget] = useState<ShopTarget | null>(null)
  const [volumeCovers, setVolumeCovers] = useState<Record<number, string>>({})

  // ONE request per series — MangaDex returns all volume covers at once
  useEffect(() => {
    fetch(`/api/manga-covers?title=${encodeURIComponent(series.title)}`)
      .then(r => r.json())
      .then(d => {
        const mapped: Record<number, string> = {}
        Object.entries(d.covers ?? {}).forEach(([vol, url]) => {
          const n = parseFloat(vol)
          if (!isNaN(n)) mapped[Math.round(n)] = url as string
        })
        setVolumeCovers(mapped)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series.id])

  const total = series.totalVolumes ?? Math.max(...series.ownedVolumes, 0)
  const allVolumes = Array.from({ length: total }, (_, i) => i + 1)

  const handleMissingPress = (vol: number) => {
    const alreadyIn = isInWishlist(series.id, vol)
    if (alreadyIn) {
      const entry = wishlist.find(e => e.seriesId === series.id && e.volumeNumber === vol)
      if (entry) removeFromWishlist(entry.id)
      setToast(`Vol. ${vol} rimosso dalla wishlist`)
    } else {
      addToWishlist({ id: `${series.id}-${vol}-${Date.now()}`, seriesId: series.id, seriesTitle: series.title, volumeNumber: vol, addedAt: Date.now() })
      setToast(`Vol. ${vol} aggiunto alla wishlist ♥`)
    }
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="relative">
      {toast && (
        <div className="absolute animate-fade-in"
          style={{ top: -48, left: 16, right: 16, zIndex: 10, background: '#1C1C1E', border: '1px solid #2C2C2E', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{toast}</span>
          <button onClick={() => setToast(null)}><X size={14} color="#8E8E93" /></button>
        </div>
      )}

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
                  <img src={coverUrl} alt={`${series.title} vol. ${vol}`}
                    style={{ width: 72, height: 108, objectFit: 'cover', borderRadius: 6, display: 'block' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <CoverPlaceholder seriesId={series.id} title={series.title} volume={vol} width={72} height={108} />
                )}
                <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '1px 5px' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>{vol}</span>
                </div>
              </div>
            )
          }

          return (
            <div key={vol} className="flex-shrink-0">
              <MissingVolumePlaceholder
                volume={vol} width={72} height={108} inWishlist={inWishlist}
                onPress={() => handleMissingPress(vol)}
                onAmazon={() => setShopTarget({ title: series.title, volume: vol, publisher: series.publisher })}
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 px-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#3A3A3C', border: '1px solid #555' }} />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Posseduto</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1C1C1E', border: '1.5px dashed #3A3A3C' }} />
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Tap = wishlist</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 11, color: '#8E8E93' }}>🛒 = acquista</span>
        </div>
      </div>

      {shopTarget && (
        <ShopModal title={shopTarget.title} volume={shopTarget.volume} publisher={shopTarget.publisher} onClose={() => setShopTarget(null)} />
      )}
    </div>
  )
}
