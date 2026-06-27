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
    <div className="animate-fade-in flex flex-col h-full" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(48,209,88,0.15)' }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30D158' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#30D158' }}>
              RICONOSCIUTO • {Math.round(result.confidence * 100)}% sicuro
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-3" style={{ color: '#FFFFFF' }}>Abbiamo trovato:</h2>
      </div>

      {/* Result card */}
      <div className="mx-5 rounded-2xl overflow-hidden" style={{ background: '#1C1C1E', border: '1px solid #2C2C2E' }}>
        {/* Cover area */}
        <div
          className="flex items-center gap-4 p-4"
          style={{ borderBottom: '1px solid #2C2C2E' }}
        >
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 72,
              height: 100,
              background: 'linear-gradient(160deg, #1a0a00, #3d1a00)',
              border: '1px solid #3d2000',
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 900, color: '#C8860A', opacity: 0.4 }}>B</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
              {result.series}
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#FF3B30', marginTop: 4 }}>
              Volume {result.volumeNumber}
            </p>
            {result.edition && result.edition !== 'Standard' && (
              <div
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,59,48,0.12)' }}
              >
                <Star size={10} color="#FF3B30" fill="#FF3B30" />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#FF3B30' }}>
                  {result.edition}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <Detail label="Publisher" value={result.publisher} />
          <Detail label="Lingua" value={result.language} />
          {result.isbn && <Detail label="ISBN" value={result.isbn} />}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 mt-auto pb-6 flex flex-col gap-3">
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 rounded-2xl tap-scale"
          style={{
            height: 56,
            background: '#FF3B30',
            fontSize: 16,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          <CheckCircle size={20} />
          Conferma e aggiungi
        </button>

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl tap-scale"
            style={{
              height: 48,
              background: '#1C1C1E',
              border: '1px solid #2C2C2E',
              fontSize: 14,
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            <RefreshCw size={16} />
            Riprova
          </button>
          <button
            onClick={onManualSearch}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl tap-scale"
            style={{
              height: 48,
              background: '#1C1C1E',
              border: '1px solid #2C2C2E',
              fontSize: 14,
              fontWeight: 600,
              color: '#8E8E93',
            }}
          >
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
      <p style={{ fontSize: 11, color: '#48484A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </p>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>{value}</p>
    </div>
  )
}
