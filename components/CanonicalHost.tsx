'use client'

import { useEffect } from 'react'

export default function CanonicalHost() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    if (isLocalhost) return

    const targetHost = 'www.financialfeeling.com'

    const currentHost = window.location.hostname
    const currentProtocol = window.location.protocol

    // Force HTTPS and canonical host in production
    if (currentHost !== targetHost || currentProtocol !== 'https:') {
      const url = new URL(window.location.href)
      url.protocol = 'https:'
      url.hostname = targetHost
      window.location.replace(url.toString())
    }
  }, [])

  return null
} 