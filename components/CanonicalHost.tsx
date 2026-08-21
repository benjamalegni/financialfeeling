'use client'

import { useEffect } from 'react'

export default function CanonicalHost() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const targetHost = process.env.NEXT_PUBLIC_CANONICAL_HOST
    if (!targetHost) return

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    if (isLocalhost) return

    const currentHost = window.location.hostname
    const currentProtocol = window.location.protocol

    // Force HTTPS and canonical host only if explicitly configured
    if (currentHost !== targetHost || currentProtocol !== 'https:') {
      const url = new URL(window.location.href)
      url.protocol = 'https:'
      url.hostname = targetHost
      window.location.replace(url.toString())
    }
  }, [])

  return null
} 