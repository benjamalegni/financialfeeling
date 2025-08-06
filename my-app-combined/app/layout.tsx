import type { Metadata } from 'next'
import './globals.css'
import { forceHTTPS } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Financial Feeling',
  description: 'AI-powered financial analysis and trading insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Forzar HTTPS en producción
  if (typeof window !== 'undefined') {
    forceHTTPS()
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
