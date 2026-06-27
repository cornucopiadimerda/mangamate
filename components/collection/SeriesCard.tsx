import Link from 'next/link'
import { CollectionSeries } from '@/lib/types/manga.types'
import { CoverPlaceholder } from '@/components/ui/CoverPlaceholder'
import { CheckCircle } from 'lucide-react'

interface SeriesCardProps {
  series: CollectionSeries
}

export function SeriesCard({ series }: SeriesCardProps) {
  const isComplete = series.completionPercent === 100

  return (
    <Link href={`/collection/${series.id}`} className="block tap-scale">
      <div style={{ background: '#1C1C1E', borderRadius: 12, overflow: 'hidden', border: isComplete ? '1px solid rgba(48,209,88,0.3)' : '1px solid #2C2C2E' }}>
        {/* Cover */}
        <div className="relative" style={{ height: 160, overflow: 'hidden', background: '#111' }}>
          {series.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={series.coverUrl}
              alt={series.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <CoverPlaceholder seriesId={series.id} title={series.title} width="100%" height={160} className="w-full" />
          )}
          {/* Gradient overlay for text legibility */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

          {isComplete && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(48,209,88,0.25)', backdropFilter: 'blur(4px)' }}>
              <CheckCircle size={10} color="#30D158" />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#30D158' }}>COMPLETA</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="font-semibold text-sm truncate" style={{ color: '#FFFFFF' }}>{series.title}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: '#8E8E93' }}>{series.publisher}</p>
          <div className="mt-2.5">
            <div className="flex justify-between items-center mb-1">
              <span style={{ fontSize: 10, color: '#8E8E93' }}>{series.ownedVolumes.length}/{series.totalVolumes ?? '?'}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: isComplete ? '#30D158' : '#FF3B30' }}>
                {series.completionPercent}%
              </span>
            </div>
            <div style={{ height: 3, background: '#2C2C2E', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${series.completionPercent}%`, background: isComplete ? '#30D158' : '#FF3B30', borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
