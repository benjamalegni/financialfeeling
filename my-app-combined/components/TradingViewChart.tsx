"use client"

import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    TradingView?: any
  }
}

export interface TradingViewChartProps {
  symbol: string
  height?: number
  theme?: 'light' | 'dark'
  interval?: string // e.g., 'D', '60'
  studies?: string[]
}

let tvScriptPromise: Promise<void> | null = null
function loadTradingViewScript(): Promise<void> {
  if (tvScriptPromise) return tvScriptPromise
  tvScriptPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }
    if (document.getElementById('tradingview-widget-script')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = 'tradingview-widget-script'
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://s3.tradingview.com/tv.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load TradingView script'))
    document.body.appendChild(script)
  })
  return tvScriptPromise
}

export default function TradingViewChart({
  symbol,
  height = 360,
  theme = 'dark',
  interval = 'D',
  studies = [],
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const observedRef = useRef<boolean>(false)
  const lastSymbolRef = useRef<string>('')
  const containerIdRef = useRef<string>(`tv-container-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    if (!containerRef.current || observedRef.current) return

    const el = containerRef.current
    const observer = new IntersectionObserver(async (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        observer.disconnect()
        observedRef.current = true
        await loadTradingViewScript()
        if (!window.TradingView || !el) return
        const tvSymbol = symbol.trim().toUpperCase()
        lastSymbolRef.current = tvSymbol
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval,
          timezone: 'Etc/UTC',
          theme,
          style: '1',
          locale: 'en',
          enable_publishing: false,
          withdateranges: true,
          range: '3M',
          hide_side_toolbar: true,
          hide_legend: true,
          allow_symbol_change: false,
          container_id: containerIdRef.current,
          studies,
        })
      }
    }, { rootMargin: '200px' })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // If widget already created and symbol changed, re-create only then
    const maybeUpdate = async () => {
      if (!observedRef.current) return
      const next = symbol.trim().toUpperCase()
      if (next === lastSymbolRef.current) return
      await loadTradingViewScript()
      if (!window.TradingView) return
      // Destroy old content
      const el = containerRef.current
      if (el) el.innerHTML = ''
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: next,
        interval,
        timezone: 'Etc/UTC',
        theme,
        style: '1',
        locale: 'en',
        enable_publishing: false,
        withdateranges: true,
        range: '3M',
        hide_side_toolbar: true,
        hide_legend: true,
        allow_symbol_change: false,
        container_id: containerIdRef.current,
        studies,
      })
      lastSymbolRef.current = next
    }
    maybeUpdate()
  }, [symbol])

  return (
    <div style={{ width: '100%', height }}>
      <div id={containerIdRef.current} ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
} 