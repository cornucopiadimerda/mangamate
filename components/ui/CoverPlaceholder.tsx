import { SERIES_COLORS } from '@/lib/data/mock'

interface CoverPlaceholderProps {
  seriesId: string
  title: string
  volume?: number
  width?: number
  height?: number
  className?: string
}

export function CoverPlaceholder({ seriesId, title, volume, width = 80, height = 120, className = '' }: CoverPlaceholderProps) {
  const colors = SERIES_COLORS[seriesId] ?? { from: '#1a1a2e', to: '#16213e', text: '#E94560' }
  const initial = title.charAt(0).toUpperCase()

  return (
    <div
      className={`relative flex flex-col items-center justify-between overflow-hidden select-none ${className}`}
      style={{
        width,
        height,
        minWidth: width,
        background: `linear-gradient(160deg, ${colors.from}, ${colors.to})`,
        borderRadius: 6,
        padding: 6,
      }}
    >
      {/* Spine line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: colors.text,
          opacity: 0.6,
        }}
      />
      {/* Initial letter */}
      <span
        style={{
          fontSize: Math.round(height * 0.38),
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
      {/* Volume number badge */}
      {volume !== undefined && (
        <div
          style={{
            position: 'absolute',
            bottom: 5,
            right: 5,
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 4,
            padding: '1px 5px',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>
            {volume}
          </span>
        </div>
      )}
    </div>
  )
}

export function MissingVolumePlaceholder({ volume, onPress, width = 80, height = 120 }: {
  volume: number
  onPress?: () => void
  width?: number
  height?: number
}) {
  return (
    <button
      onClick={onPress}
      className="tap-scale"
      style={{
        width,
        height,
        minWidth: width,
        background: '#1C1C1E',
        border: '1.5px dashed #3A3A3C',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 18, color: '#3A3A3C' }}>+</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#48484A' }}>{volume}</span>
    </button>
  )
}
