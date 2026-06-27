'use client'

import { useCollectionStore } from '@/lib/store/collection'
import { Trash2, ShoppingCart, Plus } from 'lucide-react'
import Link from 'next/link'
import { SERIES_COLORS, MOCK_SERIES } from '@/lib/data/mock'
import { useState } from 'react'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToWishlist, getAllSeries } = useCollectionStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSeries, setSelectedSeries] = useState('')
  const [volumeInput, setVolumeInput] = useState('')

  const allSeries = getAllSeries()

  const groupedBySeriesId = wishlist.reduce<Record<string, typeof wishlist>>((acc, item) => {
    if (!acc[item.seriesId]) acc[item.seriesId] = []
    acc[item.seriesId].push(item)
    return acc
  }, {})

  const handleQuickAdd = () => {
    const vol = parseInt(volumeInput)
    if (!selectedSeries || !vol || vol < 1) return
    const series = MOCK_SERIES.find(s => s.id === selectedSeries)
    if (!series) return
    addToWishlist({
      id: `${selectedSeries}-${vol}-${Date.now()}`,
      seriesId: selectedSeries,
      seriesTitle: series.title,
      volumeNumber: vol,
      addedAt: Date.now(),
    })
    setVolumeInput('')
    setShowAddModal(false)
  }

  return (
    <div style={{ background: '#0C0C0E', minHeight: '100dvh', paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', letterSpacing: -0.5 }}>Wishlist</h1>
          <p style={{ fontSize: 14, color: '#8A8A8E', marginTop: 4 }}>
            {wishlist.length} {wishlist.length === 1 ? 'volume' : 'volumi'} da trovare
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="tap-scale flex items-center gap-1.5 px-3 py-2 rounded-xl"
          style={{ background: '#E91E8C' }}>
          <Plus size={16} color="#FFFFFF" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>Aggiungi</span>
        </button>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState onAdd={() => setShowAddModal(true)} />
      ) : (
        <div className="px-5 flex flex-col gap-5">
          {Object.entries(groupedBySeriesId).map(([seriesId, items]) => {
            const colors = SERIES_COLORS[seriesId] ?? { from: '#1a1a2e', to: '#16213e', text: '#E91E8C' }
            const sorted = [...items].sort((a, b) => a.volumeNumber - b.volumeNumber)
            return (
              <div key={seriesId}>
                <div className="flex items-center gap-3 mb-2.5">
                  <div style={{ width: 4, height: 20, borderRadius: 99, background: colors.text }} />
                  <Link href={`/collection/${seriesId}`}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{items[0].seriesTitle}</h2>
                  </Link>
                  <span style={{ fontSize: 12, color: '#8A8A8E' }}>{items.length} vol</span>
                </div>
                <div className="flex flex-col gap-2">
                  {sorted.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3.5 rounded-2xl"
                      style={{ background: '#141416', border: '1px solid #1E1E22' }}>
                      <div className="flex-shrink-0 flex items-center justify-center rounded-xl"
                        style={{ width: 44, height: 44, background: colors.from }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>{item.volumeNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Volume {item.volumeNumber}</p>
                        <p style={{ fontSize: 11, color: '#8A8A8E', marginTop: 1 }}>
                          Aggiunto {new Date(item.addedAt).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="tap-scale flex items-center justify-center rounded-xl"
                          style={{ width: 36, height: 36, background: 'rgba(233,30,140,0.12)' }} title="Cerca su Amazon">
                          <ShoppingCart size={16} color="#E91E8C" />
                        </button>
                        <button onClick={() => removeFromWishlist(item.id)}
                          className="tap-scale flex items-center justify-center rounded-xl"
                          style={{ width: 36, height: 36, background: '#1E1E22' }}>
                          <Trash2 size={16} color="#8A8A8E" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="flex items-start gap-3 p-4 rounded-2xl mb-4"
            style={{ background: '#141416', border: '1px solid #1E1E22' }}>
            <ShoppingCart size={16} color="#8A8A8E" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#8A8A8E', lineHeight: 1.5 }}>
              Premi il carrellino su un volume mancante per aprire le opzioni di acquisto.
            </p>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAddModal(false)}>
          <div className="w-full animate-fade-in"
            style={{ background: '#141416', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-4">
              <div style={{ width: 36, height: 4, background: '#282830', borderRadius: 99 }} />
            </div>
            <div className="px-5">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>Aggiungi alla wishlist</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <p style={{ fontSize: 12, color: '#8A8A8E', marginBottom: 8 }}>Serie</p>
                  <div className="flex flex-col gap-2">
                    {allSeries.map(s => (
                      <button key={s.id} onClick={() => setSelectedSeries(s.id)}
                        className="tap-scale flex items-center gap-3 p-3 rounded-xl text-left"
                        style={{ background: selectedSeries === s.id ? 'rgba(233,30,140,0.15)' : '#1E1E22', border: selectedSeries === s.id ? '1px solid rgba(233,30,140,0.5)' : '1px solid transparent' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: selectedSeries === s.id ? '#E91E8C' : '#FFFFFF' }}>{s.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#8A8A8E', marginBottom: 8 }}>Numero volume</p>
                  <input
                    type="number" min="1" value={volumeInput}
                    onChange={e => setVolumeInput(e.target.value)}
                    placeholder="Es. 8"
                    style={{ width: '100%', background: '#1E1E22', border: '1px solid #282830', borderRadius: 12, color: '#FFFFFF', fontSize: 16, padding: '14px 16px', outline: 'none' }}
                  />
                </div>
                <button onClick={handleQuickAdd} disabled={!selectedSeries || !volumeInput}
                  className="w-full tap-scale rounded-2xl"
                  style={{ height: 52, background: selectedSeries && volumeInput ? '#E91E8C' : '#1E1E22', fontSize: 15, fontWeight: 700, color: selectedSeries && volumeInput ? '#FFFFFF' : '#4A4A50', marginTop: 4 }}>
                  Aggiungi alla wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 text-center" style={{ paddingTop: 80 }}>
      <div className="flex items-center justify-center rounded-3xl mb-6" style={{ width: 80, height: 80, background: '#141416' }}>
        <span style={{ fontSize: 36 }}>❤️</span>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>Wishlist vuota</h2>
      <p style={{ fontSize: 14, color: '#8A8A8E', marginTop: 8, lineHeight: 1.6 }}>
        Aggiungi volumi manualmente oppure tocca un volume mancante nella shelf della serie
      </p>
      <button onClick={onAdd} className="tap-scale mt-8">
        <div className="flex items-center gap-2 px-6 rounded-2xl" style={{ height: 52, background: '#E91E8C' }}>
          <Plus size={20} color="#FFFFFF" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>Aggiungi volume</span>
        </div>
      </button>
    </div>
  )
}
