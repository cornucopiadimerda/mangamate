'use client'

import { CollectionSeries } from '@/lib/types/manga.types'
import { CoverPlaceholder, MissingVolumePlaceholder } from '@/components/ui/CoverPlaceholder'
import { useRouter } from 'next/navigation'

interface VolumeShelfProps {
  series: CollectionSeries
}

export function VolumeShelf({ series }: VolumeShelfProps) {
  const router = useRouter()
  const total = series.totalVolumes ?? Math.max(...series.ownedVolumes, 0)
  const allVolumes = Array.from({ length: total }, (_, i) => i + 1)

  const handleMissingPress = (vol: number) => {
    router.push(`/wishlist?add=${series.id}&vol=${vol}`)
  }

  return (
    <div>
      <div className="volume-shelf px-4">
        {allVolumes.map((vol) => {
          const owned = series.ownedVolumes.includes(vol)
          if (owned) {
            return (
              <CoverPlaceholder
                key={vol}
                seriesId={series.id}
                title={series.title}
                volume={vol}
                width={72}
                height={108}
                className="flex-shrink-0"
              />
            )
          }
          return (
            <MissingVolumePlaceholder
              key={vol}
              volume={vol}
              width={72}
              height={108}
              onPress={() => handleMissingPress(vol)}
            />
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
          <span style={{ fontSize: 11, color: '#8E8E93' }}>Mancante — tocca per aggiungere alla wishlist</span>
        </div>
      </div>
    </div>
  )
}
