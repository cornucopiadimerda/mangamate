'use client'

import { useState, useEffect, useRef } from 'react'
import { useCollectionStore } from '@/lib/store/collection'
import { Heart, BookOpen, CheckCircle, Clock, TrendingUp, Share2, Edit3 } from 'lucide-react'
import { MOCK_SERIES } from '@/lib/data/mock'

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) return
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return value
}

export default function ProfilePage() {
  const {
    profile, updateProfile,
    getTotalVolumes, getTotalSeries, getTotalMissing, getEstimatedValue,
    getAllSeries, favorites, toggleFavorite,
  } = useCollectionStore()

  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(profile.tagname)

  const allSeries = getAllSeries()
  const completedSeries = allSeries.filter(s => s.completionPercent === 100)
  const inProgressSeries = allSeries.filter(s => s.completionPercent > 0 && s.completionPercent < 100)
  const totalVolumes = getTotalVolumes()
  const totalMissing = getTotalMissing()
  const estimatedValue = getEstimatedValue()

  const animatedValue = useCountUp(estimatedValue, 1400)

  const saveName = () => {
    updateProfile({ tagname: tempName })
    setEditingName(false)
  }

  const shareStats = async () => {
    const text = `🎌 La mia collezione manga su MangaMate\n\n📚 ${totalVolumes} volumi · ${getTotalSeries()} serie\n✅ ${completedSeries.length} complete · ⏳ ${inProgressSeries.length} in corso\n💰 Valore stimato: €${estimatedValue.toFixed(2)}\n\nScarica MangaMate → mangamate.vercel.app`
    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Statistiche copiate!')
    }
  }

  return (
    <div style={{ background: '#080808', minHeight: '100dvh', paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-start justify-between">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 68, height: 68, background: profile.avatarColor, fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}
            >
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{profile.displayName}</p>
              {editingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    autoFocus
                    style={{
                      background: '#1C1C1E', border: '1px solid #FF3B30', borderRadius: 8,
                      color: '#FFFFFF', fontSize: 13, padding: '4px 8px', outline: 'none', width: 160,
                    }}
                  />
                </div>
              ) : (
                <button onClick={() => setEditingName(true)} className="flex items-center gap-1 mt-1">
                  <span style={{ fontSize: 13, color: '#8E8E93' }}>{profile.tagname}</span>
                  <Edit3 size={11} color="#48484A" />
                </button>
              )}
              <p style={{ fontSize: 12, color: '#48484A', marginTop: 2 }}>{profile.bio}</p>
            </div>
          </div>
          <button onClick={shareStats} className="tap-scale flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: '#1C1C1E', border: '1px solid #2C2C2E' }}>
            <Share2 size={15} color="#FF3B30" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FF3B30' }}>Condividi</span>
          </button>
        </div>
      </div>

      {/* Patrimonio animated box */}
      <div className="px-5 pb-5">
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #1a1200, #2d1f00)', border: '1px solid rgba(255,214,10,0.25)' }}
        >
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,214,10,0.05)' }} />
          <div style={{ position: 'absolute', right: 20, bottom: -30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,214,10,0.04)' }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,214,10,0.6)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
            Valore collezione
          </p>
          <div className="flex items-baseline gap-1">
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FFD60A', marginBottom: 2 }}>€</span>
            <span style={{ fontSize: 44, fontWeight: 900, color: '#FFD60A', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {animatedValue.toFixed(2)}
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,214,10,0.4)', marginTop: 6 }}>
            {totalVolumes} vol · prezzi originali uscita mercato IT
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-5 pb-5">
        <h2 style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Statistiche collezione
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatBlock icon={<BookOpen size={18} color="#FF3B30" />} value={totalVolumes} label="Volumi totali" color="#FF3B30" />
          <StatBlock icon={<TrendingUp size={18} color="#FF9F0A" />} value={getTotalSeries()} label="Serie" color="#FF9F0A" />
          <StatBlock icon={<CheckCircle size={18} color="#30D158" />} value={completedSeries.length} label="Serie complete" color="#30D158" />
          <StatBlock icon={<Clock size={18} color="#64D2FF" />} value={inProgressSeries.length} label="In corso" color="#64D2FF" />
          <StatBlock icon={<span style={{ fontSize: 18 }}>📦</span>} value={totalMissing} label="Mancanti" color="#8E8E93" />
          <StatBlock icon={<span style={{ fontSize: 18 }}>📊</span>} value={`${allSeries.length > 0 ? Math.round(allSeries.reduce((s, x) => s + x.completionPercent, 0) / allSeries.length) : 0}%`} label="Completamento" color="#BF5AF2" />
        </div>
      </div>

      {/* Favorite series */}
      <div className="px-5 pb-5">
        <h2 style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Serie preferite
        </h2>
        <div className="flex flex-col gap-2">
          {MOCK_SERIES.map(series => {
            const isFav = favorites.includes(series.id)
            const collSeries = allSeries.find(s => s.id === series.id)
            return (
              <div key={series.id} className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{ background: '#1C1C1E', border: isFav ? '1px solid rgba(255,59,48,0.3)' : '1px solid #2C2C2E' }}>
                {/* Tiny cover */}
                <div className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 40, height: 56, background: '#111' }}>
                  {series.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={series.coverUrl} alt={series.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ fontSize: 20, fontWeight: 900, color: '#555' }}>
                      {series.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{series.title}</p>
                  <p style={{ fontSize: 11, color: '#8E8E93' }}>{series.author}</p>
                  {collSeries && (
                    <p style={{ fontSize: 11, color: isFav ? '#FF3B30' : '#48484A', marginTop: 2 }}>
                      {collSeries.ownedVolumes.length}/{series.totalVolumes} vol · {collSeries.completionPercent}%
                    </p>
                  )}
                </div>
                <button onClick={() => toggleFavorite(series.id)} className="tap-scale flex-shrink-0"
                  style={{ width: 36, height: 36, background: isFav ? 'rgba(255,59,48,0.15)' : '#2C2C2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={16} color="#FF3B30" fill={isFav ? '#FF3B30' : 'none'} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Future features placeholder */}
      <div className="px-5 pb-6">
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,214,10,0.06)', border: '1px solid rgba(255,214,10,0.15)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#FFD60A', marginBottom: 4 }}>Prossimamente</p>
          <p style={{ fontSize: 12, color: '#8E8E93', lineHeight: 1.5 }}>
            Profilo pubblico, amici, classifiche, badge collezione, storico acquisti e molto altro.
          </p>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: '#1C1C1E', border: '1px solid #2C2C2E' }}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, color: '#8E8E93', marginTop: 4 }}>{label}</p>
    </div>
  )
}
