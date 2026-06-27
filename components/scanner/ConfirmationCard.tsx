'use client'

import { RecognitionResult } from '@/lib/types/manga.types'
import { CheckCircle, RefreshCw, Search, Star } from 'lucide-react'

interface ConfirmationCardProps {
  result: RecognitionResult
  onConfirm: () => void
  onRetry: () => void
  onManualSearch: () => void
}

export function ConfirmationCard({ result, onConfirm, onRetry, onManualSearch }: ConfirmationCardProps) {
  return (
    <div className="animate-fade-in flex flex-col overflow-y-auto" style={{ background: '#0C0C0E', minHeight: '100%', paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
      <div className="px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(48,209,88,0.15)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30D158' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#30D158' }}>
              RICONOSCIUTO · {Math.round(result.confidence * 100)}% sicuro
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-3" style={{ color: '#FFFFFF' }}>Abbiamo trovato:</h2>
      </div>

      <div className="mx-5 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: '#141416', border: '1px solid #1E1E22' }}>
        <div className="flex items-start gap-4 p-4" style={{ borderBottom: '1px solid #1E1E22' }}>
          <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 80, height: 112, background: '#0E0E11', position: 'relative' }}>
            {result.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result.coverUrl} alt={`${result.series} Vol. ${result.volumeNumber}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1a0a00, #3d1a00)' }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: '#C8860A', opacity: 0.4 }}>{result.series.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>{result.series}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#E91E8C', marginTop: 4 }}>Volume {result.volumeNumber}</p>
            {result.edition && result.edition !== 'Standard' && (
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(233,30,140,0.12)' }}>
                <Star size={10} color="#E91E8C" fill="#E91E8C" />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#E91E8C' }}>{result.edition}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {result.author && <Detail label="Autore" value={result.author} />}
          <div className="grid grid-cols-2 gap-3">
            <Detail label="Publisher" value={result.publisher} />
            <Detail label="Lingua" value={result.language} />
          </div>
          {result.isbn && (
            <div>
              <p style={{ fontSize: 10, color: '#282830', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>ISBN</p>
              <p style={{ fontSize: 11, fontWeight: 400, color: '#4A4A50', marginTop: 2, letterSpacing: 0.5, fontVariantNumeric: 'tabular-nums' }}>{result.isbn}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-3 flex-shrink-0">
        <button onClick={onConfirm} className="w-full flex items-center justify-center gap-2 rounded-2xl tap-scale"
          style={{ height: 56, background: '#E91E8C', fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
          <CheckCircle size={20} />
          Conferma e aggiungi
        </button>
        <div className="flex gap-3">
          <button onClick={onRetry} className="flex-1 flex items-center justify-center gap-2 rounded-2xl tap-scale"
            style={{ height: 50, background: '#141416', border: '1px solid #1E1E22', fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
            <RefreshCw size={16} />
            Riprova
          </button>
          <button onClick={onManualSearch} className="flex-1 flex items-center justify-center gap-2 rounded-2xl tap-scale"
            style={{ height: 50, background: '#141416', border: '1px solid #1E1E22', fontSize: 14, fontWeight: 600, color: '#8A8A8E' }}>
            <Search size={16} />
            Cerca
          </button>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: '#4A4A50', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>{value}</p>
    </div>
  )
}
