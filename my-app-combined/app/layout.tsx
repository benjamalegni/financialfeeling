import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { forceHTTPS } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
