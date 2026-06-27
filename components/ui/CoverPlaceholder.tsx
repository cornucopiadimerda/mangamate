import { Heart, ShoppingCart } from 'lucide-react'
import { SERIES_COLORS } from '@/lib/data/mock'

interface CoverPlaceholderProps {
  seriesId: string
  title: string
  volume?: number
  width?: number | string
  height?: number | string
  className?: string
}

export function CoverPlaceholder({ seriesId, title, volume, width = 80, height = 120, className = '' }: CoverPlaceholderProps) {
  const colors = SERIES_COLORS[seriesId] ?? { from: '#1a1a2e', to: '#16213e', text: '#E94560' }
  const initial = title.charAt(0).toUpperCase()
  const numericHeight = typeof height === 'number' ? height : 120

  return (
    <div
      className={`relative flex flex-col items-center justify-between overflow-hidden select-none ${className}`}
      style={{
        width,
        height,
        minWidth: typeof width === 'number' ? width : undefined,
        background: `linear-gradient(160deg, ${colors.from}, ${colors.to})`,
        borderRadius: 6,
        padding: 6,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: colors.text, opacity: 0.6 }} />
      <span
        style={{
          fontSize: Math.round(numericHeight * 0.38),
          fontWeight: 900,
          color: colors.text,
          opacity: 0.25,
          lineHeight: 1,
          letterSpacing: -2,
          marginTop: 'auto',
          marginBottom: 'auto',
          userSelect: 'none',
        }}
      >
        {initial}
      </span>
      {volume !== undefined && (
        <div style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '1px 5px' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>{volume}</span>
        </div>
      )}
    </div>
  )
}

export function MissingVolumePlaceholder({ volume, onPress, onAmazon, width = 80, height = 120, inWishlist = false }: {
  volume: number
  onPress?: () => void
  onAmazon?: () => void
  width?: number
  height?: number
  inWishlist?: boolean
}) {
  return (
    <div style={{ position: 'relative', width, height }}>
      <button
        onClick={onPress}
        className="tap-scale"
        style={{
          width,
          height,
          minWidth: width,
          background: inWishlist ? 'rgba(255,59,48,0.08)' : '#1C1C1E',
          border: inWishlist ? '1.5px solid rgba(255,59,48,0.4)' : '1.5px dashed #3A3A3C',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          cursor: 'pointer',
        }}
      >
        {inWishlist ? (
          <Heart size={16} color="#FF3B30" fill="#FF3B30" />
        ) : (
          <span style={{ fontSize: 18, color: '#3A3A3C' }}>+</span>
        )}
        <span style={{ fontSize: 10, fontWeight: 600, color: inWishlist ? '#FF3B30' : '#48484A' }}>{volume}</span>
      </button>

      {/* Amazon button — small icon in bottom-right corner */}
      {onAmazon && (
        <button
          onClick={(e) => { e.stopPropagation(); onAmazon() }}
          style={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            width: 20,
            height: 20,
            background: 'rgba(255,153,0,0.9)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
          title="Cerca su Amazon"
        >
          <ShoppingCart size={11} color="#000" />
        </button>
      )}
    </div>
  )
}
