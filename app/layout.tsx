import type { Metadata, Viewport } from 'next'
import './globals.css'
import { TabBar } from '@/components/layout/TabBar'

export const metadata: Metadata = {
  title: 'MangaMate',
  description: 'La tua collezione manga, sempre con te',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MangaMate',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0C0C0E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <main className="pb-tab-safe min-h-dvh">
          {children}
        </main>
        <TabBar />
      </body>
    </html>
  )
}
