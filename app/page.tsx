'use client'

import Link from 'next/link'
import { Camera, TrendingUp, BookOpen, Heart, ChevronRight, Zap } from 'lucide-react'
import { useCollectionStore } from '@/lib/store/collection'
import { CoverPlaceholder } from '@/components/ui/CoverPlaceholder'

export default function HomePage() {
  const { getTotalVolumes, getTotalSeries, getCompletionRate, getAllSeries, wishlist } = useCollectionStore()

  const totalVolumes = getTotalVolumes()
  const totalSeries = getTotalSeries()
  const completionRate = getCompletionRate()
  const allSeries = getAllSeries()
  const incompleteSeries = allSeries.filter((s) => s.completionPercent < 100 && s.missingVolumes.length > 0)

  return (
    <div className="flex flex-col" style={{ background: '#080808', minHeight: '100dvh' }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <p style={{ fontSize: 13, fontWeight: 500, color: '#8E8E93', letterSpacing: 0.3 }}>
          {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', marginTop: 2, letterSpacing: -0.5 }}>
          La tua collezione
        </h1>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 px-5 pb-5">
        <StatCard value={totalVolumes} label="Volumi" color="#FF3B30" />
        <StatCard value={totalSeries} label="Serie" color="#FF9F0A" />
        <StatCard value={`${completionRate}%`} label="Completamento" color="#30D158" />
      </div>

      {/* Scan CTA */}
      <div className="px-5 pb-5">
        <Link href="/scan" className="block tap-scale">
          <div
            className="relative overflow-hidden rounded-2xl flex items-center gap-4 p-5"
            style={{
              background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B35 100%)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }}
            >
              <Camera size={26} color="#FFFFFF" />
            </div>
            <div>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>Scansiona un manga</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Punta la fotocamera sulla copertina
              </p>
            </div>
            <ChevronRight
              size={20}
              color="rgba(255,255,255,0.6)"
              style={{ marginLeft: 'auto', flexShrink: 0 }}
            />
            {/* Decorative circles */}
            <div
              style={{
                position: 'absolute', right: -20, top: -20,
                width: 100, height: 100, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            <div
              style={{
                position: 'absolute', right: 20, bottom: -30,
                width: 70, height: 70, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
              }}
            />
          </div>
        </Link>
      </div>

      {/* Continue Collecting */}
      {incompleteSeries.length > 0 && (
        <section className="pb-5">
          <SectionHeader title="Continua a collezionare" href="/collection" />
          <div className="flex flex-col gap-3 px-5">
            {incompleteSeries.slice(0, 3).map((series) => (
              <Link key={series.id} href={`/collection/${series.id}`} className="block tap-scale">
                <div
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: '#1C1C1E', border: '1px solid #2C2C2E' }}
                >
                  <CoverPlaceholder
                    seriesId={series.id}
                    title={series.title}
                    width={48}
                    height={68}
                  />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{series.title}</p>
                    <p style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>{series.publisher}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div style={{ flex: 1, height: 3, background: '#2C2C2E', borderRadius: 99 }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${series.completionPercent}%`,
                            background: '#FF3B30',
                            borderRadius: 99,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FF3B30', flexShrink: 0 }}>
                        {series.ownedVolumes.length}/{series.totalVolumes}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-xl"
                    style={{ width: 44, height: 44, background: '#2C2C2E' }}
                  >
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#FF3B30', textAlign: 'center' }}>
                        {series.missingVolumes.length}
                      </p>
                      <p style={{ fontSize: 9, color: '#8E8E93', textAlign: 'center' }}>mancanti</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Wishlist preview */}
      {wishlist.length > 0 && (
        <section className="pb-5">
          <SectionHeader title="Wishlist" href="/wishlist" />
          <div className="px-5 flex flex-col gap-2">
            {wishlist.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: '#1C1C1E' }}
              >
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 36, height: 36, background: 'rgba(255,59,48,0.15)' }}
                >
                  <Heart size={16} color="#FF3B30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
                    {item.seriesTitle}
                  </p>
                  <p style={{ fontSize: 11, color: '#8E8E93' }}>Volume {item.volumeNumber}</p>
                </div>
              </div>
            ))}
            {wishlist.length > 3 && (
              <Link href="/wishlist">
                <p style={{ fontSize: 13, color: '#FF3B30', fontWeight: 600, textAlign: 'center', padding: '8px 0' }}>
                  Vedi altri {wishlist.length - 3} →
                </p>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Quick tip */}
      <div className="px-5 pb-5">
        <div
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(255,214,10,0.08)', border: '1px solid rgba(255,214,10,0.2)' }}
        >
          <Zap size={18} color="#FFD60A" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#FFD60A' }}>Suggerimento</p>
            <p style={{ fontSize: 12, color: '#8E8E93', marginTop: 3, lineHeight: 1.5 }}>
              Scansiona un volume e MangaMate ti chiederà automaticamente se vuoi aggiungere tutta la serie in un colpo solo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div
      className="flex-1 rounded-2xl p-3.5"
      style={{ background: '#1C1C1E', border: '1px solid #2C2C2E' }}
    >
      <p style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, color: '#8E8E93', marginTop: 4, lineHeight: 1.3 }}>{label}</p>
    </div>
  )
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between px-5 mb-3">
      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{title}</h2>
      <Link href={href}>
        <span style={{ fontSize: 13, color: '#FF3B30', fontWeight: 600 }}>Vedi tutti</span>
      </Link>
    </div>
  )
}
