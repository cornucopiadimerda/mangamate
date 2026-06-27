'use client'

import { useCollectionStore } from '@/lib/store/collection'
import { SeriesCard } from '@/components/collection/SeriesCard'
import { Camera, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function CollectionPage() {
  const { getAllSeries, getTotalVolumes, getTotalSeries } = useCollectionStore()
  const allSeries = getAllSeries()
  const totalVolumes = getTotalVolumes()
  const totalSeries = getTotalSeries()

  return (
    <div style={{ background: '#080808', minHeight: '100dvh' }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', letterSpacing: -0.5 }}>
          Collezione
        </h1>
        <p style={{ fontSize: 14, color: '#8E8E93', marginTop: 4 }}>
          {totalSeries} serie · {totalVolumes} volumi
        </p>
      </div>

      {allSeries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="px-5 grid grid-cols-2 gap-3 pb-4">
          {allSeries.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
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
        <BookOpen size={36} color="#48484A" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>Collezione vuota</h2>
      <p style={{ fontSize: 14, color: '#8E8E93', marginTop: 8, lineHeight: 1.6 }}>
        Scansiona il tuo primo manga per iniziare a costruire la tua collezione
      </p>
      <Link href="/scan" className="tap-scale mt-8 block">
        <div
          className="flex items-center gap-2 px-6 rounded-2xl"
          style={{ height: 52, background: '#FF3B30' }}
        >
          <Camera size={20} color="#FFFFFF" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>Scansiona ora</span>
        </div>
      </Link>
    </div>
  )
}
