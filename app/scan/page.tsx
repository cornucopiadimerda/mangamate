'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ConfirmationCard } from '@/components/scanner/ConfirmationCard'
import { SeriesDetectionModal } from '@/components/scanner/SeriesDetectionModal'
import { useCollectionStore } from '@/lib/store/collection'
import { MOCK_SERIES } from '@/lib/data/mock'
import { RecognitionResult, CollectionEntry } from '@/lib/types/manga.types'

type ScanState = 'camera' | 'analyzing' | 'confirming' | 'series-detection' | 'success' | 'error'

const SCAN_MESSAGES = [
  'Analizzando la copertina...',
  'Cercando nel database...',
  'Identificando edizione...',
  'Quasi pronto...',
]

export default function ScanPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [scanState, setScanState] = useState<ScanState>('camera')
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [loadingMessage, setLoadingMessage] = useState(SCAN_MESSAGES[0])
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [scanError, setScanError] = useState<string | null>(null)
  const { addVolume, addVolumes } = useCollectionStore()

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraPermission('granted')
    } catch {
      setCameraPermission('denied')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()) }
  }, [startCamera])

  useEffect(() => {
    if (scanState !== 'analyzing') return
    let msgIdx = 0
    let progress = 0
    setLoadingMessage(SCAN_MESSAGES[0])
    setLoadingProgress(0)

    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % SCAN_MESSAGES.length
      setLoadingMessage(SCAN_MESSAGES[msgIdx])
    }, 900)

    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 2, 95)
      setLoadingProgress(progress)
    }, 60)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
    }
  }, [scanState])

  const captureFrame = (): string | null => {
    if (!videoRef.current) return null
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 1280
    canvas.height = videoRef.current.videoHeight || 720
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.85)
  }

  const handleCapture = async () => {
    setScanState('analyzing')
    const imageBase64 = captureFrame()

    try {
      const res = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      })

      const data = await res.json()

      if (!res.ok) {
        const isKeyError = data.apiKeyInvalid || res.status === 403 || res.status === 400
        setScanError(
          isKeyError
            ? 'Chiave API Gemini non valida.\nVai su aistudio.google.com/app/apikey per generarne una nuova (inizia con "AIza").'
            : `Errore server ${res.status}: ${data.error ?? 'Risposta non valida'}`
        )
        setScanState('error')
        return
      }

      setLoadingProgress(100)
      await new Promise(r => setTimeout(r, 300))
      setRecognitionResult(data as RecognitionResult)
      setScanState('confirming')
    } catch (err) {
      console.error('Scan failed:', err)
      setScanError('Errore di rete. Controlla la connessione e riprova.')
      setScanState('error')
    }
  }

  const handleConfirm = () => {
    if (!recognitionResult) return
    const seriesData = MOCK_SERIES.find(s => s.title.toLowerCase() === recognitionResult.series.toLowerCase())
    if (seriesData) {
      setScanState('series-detection')
    } else {
      const seriesId = recognitionResult.series.toLowerCase().replace(/\s+/g, '-')
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
    const seriesData = MOCK_SERIES.find(s => s.title.toLowerCase() === recognitionResult.series.toLowerCase())
    const totalVolumes = seriesData?.totalVolumes ?? 1
    const makeEntry = (n: number): CollectionEntry => ({
      id: `${seriesId}-${n}-${Date.now()}`,
      seriesId,
      volumeNumber: n,
      addedAt: Date.now(),
      condition: 'mint',
    })
    if (choice === 'single') addVolume(makeEntry(recognitionResult.volumeNumber))
    else if (choice === 'range-10') addVolumes(Array.from({ length: Math.min(10, totalVolumes) }, (_, i) => makeEntry(i + 1)))
    else if (choice === 'all') addVolumes(Array.from({ length: totalVolumes }, (_, i) => makeEntry(i + 1)))
    if (choice !== 'cancel') showSuccess()
    else setScanState('camera')
  }

  const showSuccess = () => {
    setScanState('success')
    setTimeout(() => {
      setScanState('camera')
      setRecognitionResult(null)
    }, 1400)
  }

  const resetToCamera = () => {
    setScanState('camera')
    setRecognitionResult(null)
    setLoadingProgress(0)
    setScanError(null)
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#000', zIndex: 60 }}>
      <div className="absolute inset-0">
        {cameraPermission === 'denied' ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
            <div className="flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: '#141416' }}>
              <span style={{ fontSize: 32 }}>📷</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>Camera non disponibile</h2>
            <p style={{ fontSize: 14, color: '#8A8A8E', lineHeight: 1.6 }}>
              Abilita l&apos;accesso alla camera nelle impostazioni del browser.
            </p>
            <button onClick={startCamera} className="tap-scale"
              style={{ padding: '14px 32px', background: '#E91E8C', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
              Riprova
            </button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
      </div>

      {(scanState === 'camera' || scanState === 'analyzing' || scanState === 'success') && (
        <>
          <div className="relative z-10 flex items-center justify-between px-5"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: 12 }}>
            <button onClick={() => router.push('/')} className="tap-scale"
              style={{ width: 36, height: 36, background: 'rgba(20,20,22,0.85)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} color="#FFFFFF" />
            </button>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>Scansiona</p>
            <div style={{ width: 36 }} />
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            {scanState === 'analyzing' ? (
              <div className="flex flex-col items-center gap-6 px-8 w-full">
                <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
                  <div className="absolute inset-0 rounded-full scan-pulse"
                    style={{ border: '2px solid rgba(233,30,140,0.3)', borderRadius: '50%' }} />
                  <div className="absolute inset-0 rounded-full animate-spin"
                    style={{ border: '3px solid transparent', borderTopColor: '#E91E8C', borderRadius: '50%' }} />
                  <span style={{ fontSize: 36 }}>🔍</span>
                </div>
                <div style={{ width: '100%', maxWidth: 260 }}>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${loadingProgress}%`, background: '#E91E8C', borderRadius: 99, transition: 'width 0.1s linear' }} />
                  </div>
                </div>
                <div className="text-center">
                  <p style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }} className="animate-fade-in" key={loadingMessage}>
                    {loadingMessage}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Powered by Gemini AI</p>
                </div>
              </div>
            ) : scanState === 'success' ? (
              <div className="flex flex-col items-center gap-3 animate-fade-in">
                <div className="flex items-center justify-center rounded-full"
                  style={{ width: 80, height: 80, background: 'rgba(48,209,88,0.2)', border: '2px solid #30D158' }}>
                  <span style={{ fontSize: 40 }}>✓</span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#30D158' }}>Aggiunto!</p>
              </div>
            ) : (
              <div className="relative" style={{ width: 220, height: 300 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderTop: '3px solid white', borderLeft: '3px solid white', borderRadius: '2px 0 0 0' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: 28, height: 28, borderTop: '3px solid white', borderRight: '3px solid white', borderRadius: '0 2px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 28, height: 28, borderBottom: '3px solid white', borderLeft: '3px solid white', borderRadius: '0 0 0 2px' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderBottom: '3px solid white', borderRight: '3px solid white', borderRadius: '0 0 2px 0' }} />
                <div className="scan-pulse" style={{ position: 'absolute', left: 4, right: 4, top: '50%', height: 1, background: 'linear-gradient(90deg, transparent, #E91E8C, transparent)' }} />
              </div>
            )}
          </div>

          {scanState === 'camera' && (
            <div className="relative z-10 flex flex-col items-center gap-4"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 100px)', paddingTop: 20 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Punta la fotocamera sulla copertina</p>
              <button onClick={handleCapture} className="tap-scale"
                style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFFFFF', border: '4px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFFFFF', border: '2px solid #000' }} />
              </button>
            </div>
          )}
        </>
      )}

      {scanState === 'confirming' && recognitionResult && (
        <div className="absolute inset-0 z-20 flex flex-col" style={{ background: '#0C0C0E' }}>
          <div className="relative z-10 flex items-center px-5"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: 12, flexShrink: 0 }}>
            <button onClick={resetToCamera} className="tap-scale"
              style={{ width: 36, height: 36, background: '#141416', border: '1px solid #1E1E22', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} color="#FFFFFF" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConfirmationCard result={recognitionResult} onConfirm={handleConfirm} onRetry={resetToCamera} onManualSearch={() => router.push('/collection')} />
          </div>
        </div>
      )}

      {scanState === 'error' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
          style={{ background: '#0C0C0E' }}>
          <div className="flex items-center justify-center rounded-full mb-6"
            style={{ width: 80, height: 80, background: 'rgba(233,30,140,0.12)', border: '2px solid rgba(233,30,140,0.3)' }}>
            <span style={{ fontSize: 36 }}>⚠️</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>Scansione non riuscita</h2>
          <p style={{ fontSize: 14, color: '#8A8A8E', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: 32 }}>{scanError}</p>
          <button onClick={resetToCamera} className="tap-scale w-full rounded-2xl"
            style={{ height: 52, background: '#E91E8C', fontSize: 15, fontWeight: 700, color: '#FFFFFF', maxWidth: 280 }}>
            Riprova
          </button>
        </div>
      )}

      {scanState === 'series-detection' && recognitionResult && (
        <>
          <div className="absolute inset-0 z-20" style={{ background: '#0C0C0E' }}>
            <div className="relative z-10 flex items-center px-5"
              style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: 12 }}>
              <button onClick={resetToCamera} className="tap-scale"
                style={{ width: 36, height: 36, background: '#141416', border: '1px solid #1E1E22', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="#FFFFFF" />
              </button>
            </div>
            <ConfirmationCard result={recognitionResult} onConfirm={handleConfirm} onRetry={resetToCamera} onManualSearch={() => router.push('/collection')} />
          </div>
          <div className="absolute inset-0 z-30">
            <SeriesDetectionModal
              seriesName={recognitionResult.series}
              totalVolumes={MOCK_SERIES.find(s => s.title.toLowerCase() === recognitionResult.series.toLowerCase())?.totalVolumes ?? 1}
              onChoice={handleSeriesChoice}
            />
          </div>
        </>
      )}
    </div>
  )
}
