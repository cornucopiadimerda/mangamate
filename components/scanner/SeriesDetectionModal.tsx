'use client'

import { X, Zap } from 'lucide-react'

interface SeriesDetectionModalProps {
  seriesName: string
  totalVolumes: number
  onChoice: (choice: 'single' | 'range-10' | 'all' | 'custom' | 'cancel') => void
}

export function SeriesDetectionModal({ seriesName, totalVolumes, onChoice }: SeriesDetectionModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={() => onChoice('cancel')}
    >
      <div
        className="w-full animate-fade-in"
        style={{
          background: '#1C1C1E',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div style={{ width: 36, height: 4, background: '#3A3A3C', borderRadius: 99 }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,214,10,0.15)' }}
                >
                  <Zap size={11} color="#FFD60A" fill="#FFD60A" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#FFD60A' }}>SERIE RILEVATA</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mt-2" style={{ color: '#FFFFFF' }}>
                {seriesName}
              </h3>
              <p style={{ fontSize: 14, color: '#8E8E93', marginTop: 4 }}>
                Questa serie ha{' '}
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{totalVolumes} volumi</span>.
                Vuoi aggiungerli alla collezione?
              </p>
            </div>
            <button
              onClick={() => onChoice('cancel')}
              className="ml-3 flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                background: '#2C2C2E',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} color="#8E8E93" />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="px-5 flex flex-col gap-2.5">
          <OptionButton
            title="Solo questo volume"
            subtitle="Aggiungi solo il volume appena scansionato"
            onClick={() => onChoice('single')}
            variant="ghost"
          />
          <OptionButton
            title={`Volumi 1 – 10`}
            subtitle="Ottimo punto di partenza"
            onClick={() => onChoice('range-10')}
            variant="ghost"
          />
          <OptionButton
            title={`Tutta la serie (${totalVolumes} volumi)`}
            subtitle="Aggiungi tutti i volumi alla tua collezione"
            onClick={() => onChoice('all')}
            variant="primary"
          />
        </div>
      </div>
    </div>
  )
}

function OptionButton({
  title,
  subtitle,
  onClick,
  variant = 'ghost',
}: {
  title: string
  subtitle: string
  onClick: () => void
  variant?: 'primary' | 'ghost'
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl tap-scale"
      style={{
        padding: '14px 16px',
        background: variant === 'primary' ? '#FF3B30' : '#2C2C2E',
        border: 'none',
      }}
    >
      <p style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{title}</p>
      <p style={{ fontSize: 12, color: variant === 'primary' ? 'rgba(255,255,255,0.7)' : '#8E8E93', marginTop: 2 }}>
        {subtitle}
      </p>
    </button>
  )
}
