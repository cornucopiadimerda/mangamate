'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Zap, FlashlightIcon as Flashlight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ConfirmationCard } from '@/components/scanner/ConfirmationCard'
import { SeriesDetectionModal } from '@/components/scanner/SeriesDetectionModal'
import { useCollectionStore } from '@/lib/store/collection'
import { MOCK_SCAN_RESULT, MOCK_SERIES } from '@/lib/data/mock'
import { RecognitionResult, CollectionEntry } from '@/lib/types/manga.types'

type ScanState = 'camera' | 'analyzing' | 'confirming' | 'series-detection' | 'success'

export default function ScanPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [scanState, setScanState] = useState<ScanState>('camera')
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const { addVolume, addVolumes } = useCollectionStore()

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraPermission('granted')
    } catch {
      setCameraPermission('denied')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startCamera])

  const handleCapture = () => {
    setScanState('analyzing')
    // Simulate AI recognition (1.8s delay for realism)
    setTimeout(() => {
      setRecognitionResult(MOCK_SCAN_RESULT)
      setScanState('confirming')
    }, 1800)
  }

  const handleConfirm = () => {
    if (!recognitionResult) return
    const seriesId = recognitionResult.series.toLowerCase().replace(/\s+/g, '-')
    const seriesData = MOCK_SERIES.find(
      (s) => s.title.toLowerCase() === recognitionResult.series.toLowerCase()
    )
    if (seriesData) {
      setScanState('series-detection')
    } else {
      // Add single volume and go back to camera
      addVolume({
        id: `${seriesId}-${recognitionResult.volumeNumber}-${Date.now()}`,
        seriesId,
        volumeNumber: recognitionResult.volumeNumber,
        addedAt: Date.now(),
        condition: 'mint',
      })
      showSuccess()
    }
  }

  const handleSeriesChoice = (choice: 'single' | 'range-10' | 'all' | 'custom' | 'cancel') => {
    if (!recognitionResult) return
    const seriesId = recognitionResult.series.toLowerCase().replace(/\s+/g, '-')
    const seriesData = MOCK_SERIES.find(
      (s) => s.title.toLowerCase() === recognitionResult.series.toLowerCase()
    )
    const totalVolumes = seriesData?.totalVolumes ?? 1

    const makeEntry = (n: number): CollectionEntry => ({
      id: `${seriesId}-${n}-${Date.now()}`,
      seriesId,
      volumeNumber: n,
      addedAt: Date.now(),
      condition: 'mint',
    })

    if (choice === 'single') {
      addVolume(makeEntry(recognitionResult.volumeNumber))
    } else if (choice === 'range-10') {
      addVolumes(Array.from({ length: Math.min(10, totalVolumes) }, (_, i) => makeEntry(i + 1)))
    } else if (choice === 'all') {
      addVolumes(Array.from({ length: totalVolumes }, (_, i) => makeEntry(i + 1)))
    }

    if (choice !== 'cancel') showSuccess()
    else setScanState('camera')
  }

  const showSuccess = () => {
    setScanState('success')
    setTimeout(() => {
      setScanState('camera')
      setRecognitionResult(null)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#000000', zIndex: 10 }}>
      {/* Camera view — always mounted */}
      <div className="absolute inset-0">
        {cameraPermission === 'denied' ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 72, height: 72, background: '#1C1C1E' }}
            >
              <span style={{ fontSize: 32 }}>📷</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>Camera non disponibile</h2>
            <p style={{ fontSize: 14, color: '#8E8E93', lineHeight: 1.6 }}>
              Abilita l&apos;accesso alla camera nelle impostazioni del browser per scansionare i tuoi manga.
            </p>
            <button
              onClick={startCamera}
              className="tap-scale"
              style={{
                padding: '14px 32px',
                background: '#FF3B30',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              Riprova
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Camera UI overlay */}
      {(scanState === 'camera' || scanState === 'analyzing' || scanState === 'success') && (
        <>
          {/* Top bar */}
          <div
            className="relative z-10 flex items-center justify-between px-5"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: 12 }}
          >
            <button
              onClick={() => router.push('/')}
              className="tap-scale"
              style={{
                width: 36,
                height: 36,
                background: 'rgba(30,30,30,0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} color="#FFFFFF" />
            </button>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>Scansiona</p>
            <div style={{ width: 36 }} />
          </div>

          {/* Viewfinder */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            {scanState === 'analyzing' ? (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 72,
                    height: 72,
                    background: 'rgba(255,59,48,0.2)',
                    border: '2px solid #FF3B30',
                  }}
                >
                  <Zap size={32} color="#FF3B30" className="scan-pulse" />
                </div>
                <div className="text-center">
                  <p style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>Analizzando...</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                    L&apos;AI sta riconoscendo il volume
                  </p>
                </div>
              </div>
            ) : scanState === 'success' ? (
              <div className="flex flex-col items-center gap-3 animate-fade-in">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 72, height: 72, background: 'rgba(48,209,88,0.2)' }}
                >
                  <span style={{ fontSize: 36 }}>✓</span>
                </div>
                <p style={{ fontSize: 17, fontWeight: 700, color: '#30D158' }}>Aggiunto!</p>
              </div>
            ) : (
              /* Viewfinder brackets */
              <div className="relative" style={{ width: 220, height: 300 }}>
                {/* Top-left */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderTop: '3px solid white', borderLeft: '3px solid white', borderRadius: '2px 0 0 0' }} />
                {/* Top-right */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 28, height: 28, borderTop: '3px solid white', borderRight: '3px solid white', borderRadius: '0 2px 0 0' }} />
                {/* Bottom-left */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 28, height: 28, borderBottom: '3px solid white', borderLeft: '3px solid white', borderRadius: '0 0 0 2px' }} />
                {/* Bottom-right */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderBottom: '3px solid white', borderRight: '3px solid white', borderRadius: '0 0 2px 0' }} />

                {/* Scan line animation */}
                <div
                  className="scan-pulse"
                  style={{
                    position: 'absolute',
                    left: 4,
                    right: 4,
                    top: '50%',
                    height: 1,
                    background: 'linear-gradient(90deg, transparent, #FF3B30, transparent)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Bottom area */}
          {scanState === 'camera' && (
            <div
              className="relative z-10 flex flex-col items-center gap-4"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 100px)', paddingTop: 20 }}
            >
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                Punta la fotocamera sulla copertina del manga
              </p>
              {/* Shutter button */}
              <button
                onClick={handleCapture}
                className="tap-scale"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '4px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFFFFF', border: '2px solid #000' }} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Confirmation overlay */}
      {scanState === 'confirming' && recognitionResult && (
        <div className="relative z-20 flex flex-col h-full animate-fade-in" style={{ background: '#080808' }}>
          <ConfirmationCard
            result={recognitionResult}
            onConfirm={handleConfirm}
            onRetry={() => { setScanState('camera'); setRecognitionResult(null) }}
            onManualSearch={() => router.push('/collection')}
          />
        </div>
      )}

      {/* Series detection modal */}
      {scanState === 'series-detection' && recognitionResult && (
        <>
          <div className="relative z-20 flex flex-col h-full" style={{ background: '#080808' }}>
            <ConfirmationCard
              result={recognitionResult}
              onConfirm={handleConfirm}
              onRetry={() => { setScanState('camera'); setRecognitionResult(null) }}
              onManualSearch={() => router.push('/collection')}
            />
          </div>
          <SeriesDetectionModal
            seriesName={recognitionResult.series}
            totalVolumes={MOCK_SERIES.find(s => s.title === recognitionResult.series)?.totalVolumes ?? 1}
            onChoice={handleSeriesChoice}
          />
        </>
      )}
    </div>
  )
}
