'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCollectionStore } from '@/lib/store/collection'
import { VolumeShelf } from '@/components/collection/VolumeShelf'
import { ChevronLeft, Camera, Heart } from 'lucide-react'
import { SERIES_COLORS } from '@/lib/data/mock'
import Link from 'next/link'

export default function SeriesDetailPage() {
  const params = useParams()
  const router = useRouter()
  const seriesId = params.seriesId as string
  const { getSeriesCollection } = useCollectionStore()
  const series = getSeriesCollection(seriesId)

  if (!series) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#0C0C0E' }}>
        <p style={{ color: '#8A8A8E' }}>Serie non trovata</p>
      </div>
    )
  }

  const colors = SERIES_COLORS[seriesId] ?? { from: '#1a1a2e', to: '#16213e', text: '#E91E8C' }
  const isComplete = series.completionPercent === 100

  const statusLabel: Record<string, string> = { ongoing: 'In corso', completed: 'Completata', hiatus: 'In pausa' }
  const statusColor: Record<string, string> = { ongoing: '#30D158', completed: '#FF9F0A', hiatus: '#8A8A8E' }

  return (
    <div style={{ background: '#0C0C0E', minHeight: '100dvh' }}>
      {/* Hero header */}
      <div className="relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colors.from}, ${colors.to})`, paddingBottom: 32 }}>
        <div className="flex items-center px-5"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: 12 }}>
          <button onClick={() => router.back()} className="tap-scale flex items-center gap-1" style={{ color: colors.text }}>
            <ChevronLeft size={20} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>Collezione</span>
          </button>
        </div>

        <div style={{ position: 'absolute', right: -10, top: 0, bottom: 0, fontSize: 200, fontWeight: 900, color: colors.text, opacity: 0.06, lineHeight: 1, userSelect: 'none' }}>
          {series.title.charAt(0)}
        </div>

        <div className="relative px-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
              style={{ width: 90, height: 130, background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.text}33` }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: colors.text, opacity: 0.5 }}>{series.title.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', letterSpacing: -0.5, lineHeight: 1.1 }}>{series.title}</h1>
              <p style={{ fontSize: 14, color: colors.text, marginTop: 4, fontWeight: 600 }}>{series.author}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{series.publisher}</p>
              <div className="flex items-center gap-2 mt-3">
                <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[series.status], background: `${statusColor[series.status]}22`, padding: '3px 8px', borderRadius: 99 }}>
                  {statusLabel[series.status]}
                </span>
                {series.genres.slice(0, 2).map((g) => (
                  <span key={g} style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 99 }}>{g}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>{series.ownedVolumes.length}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>/{series.totalVolumes} volumi</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: isComplete ? '#30D158' : colors.text }}>{series.completionPercent}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${series.completionPercent}%`, background: isComplete ? '#30D158' : colors.text, borderRadius: 99, transition: 'width 0.8s ease' }} />
            </div>
            {series.missingVolumes.length > 0 && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                Mancanti: {series.missingVolumes.slice(0, 8).join(', ')}
                {series.missingVolumes.length > 8 && ` e altri ${series.missingVolumes.length - 8}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {series.description && (
        <div className="px-5 py-4">
          <p style={{ fontSize: 13, color: '#8A8A8E', lineHeight: 1.6 }}>{series.description}</p>
        </div>
      )}

      <div className="pt-2 pb-4">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>Volumi</h2>
          {series.missingVolumes.length > 0 && (
            <Link href={`/wishlist?series=${seriesId}`}>
              <span style={{ fontSize: 13, color: '#E91E8C', fontWeight: 600 }}>{series.missingVolumes.length} mancanti</span>
            </Link>
          )}
        </div>
        <VolumeShelf series={series} />
      </div>

      <div className="px-5 pt-2 pb-4 flex gap-3">
        <Link href="/scan" className="flex-1 tap-scale">
          <div className="flex items-center justify-center gap-2 rounded-2xl" style={{ height: 50, background: '#E91E8C' }}>
            <Camera size={18} color="#FFFFFF" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Scansiona volume</span>
          </div>
        </Link>
        <Link href={`/wishlist?series=${seriesId}`} className="tap-scale">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 50, height: 50, background: '#141416', border: '1px solid #1E1E22' }}>
            <Heart size={20} color="#E91E8C" />
          </div>
        </Link>
      </div>
    </div>
  )
}
