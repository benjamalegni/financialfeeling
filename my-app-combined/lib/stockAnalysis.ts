// Client-side stock analysis utility that calls the Express server in /server

import { config } from './config'

export interface StockAnalysis {
  symbol: string
  analysis: {
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number
    news: string
    recommendation: string
  }
}

export interface AnalysisResult {
  stocks: StockAnalysis[]
  timestamp: string
  note?: string
}

// Extract ticker if key looks like "Company Name (TICKER)"
function extractTicker(key: string): string {
  const m = key.match(/\(([^)]+)\)\s*$/)
  return (m ? m[1] : key).toUpperCase()
}

export async function analyzeStocks(stocks: string[]): Promise<AnalysisResult | null> {
  try {
    if (!Array.isArray(stocks) || stocks.length === 0) {
      throw new Error('No assets selected to analyze')
    }
    const baseUrl = config.server.baseUrl
    const url = `${baseUrl.replace(/\/$/, '')}/analyze-stocks`
    const payload = { stocks }
    console.log('Calling Server stock analysis API:', url, 'payload=', payload)

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })

    console.log('Server response status:', response.status)

    const text = await response.text()
    let respPayload: any = null
    try {
      respPayload = text ? JSON.parse(text) : null
    } catch (e) {
      console.error('Failed to parse server JSON:', e, '\nRaw:', text)
      return null
    }

    if (!response.ok) {
      // Surface server error details to the UI to aid debugging
      const errMsg = (respPayload && respPayload.error) || (typeof respPayload === 'string' ? respPayload : '')
      const detail = respPayload && typeof respPayload === 'object' ? JSON.stringify(respPayload) : errMsg
      throw new Error(`Backend error (${response.status}): ${detail || 'unknown_error'}`)
    }

    // Expected shape from server: { forecast: { [asset]: { impact, news, reason, horizon } } }
    const forecast = respPayload?.forecast as Record<string, { impact: string; news: string; reason: string; horizon: string }>
    if (!forecast || typeof forecast !== 'object') {
      console.warn('Unexpected server response shape. Missing forecast.')
      return null
    }

    // Map to StockAnalysis[] prioritizing requested stocks; else include all returned
    const requested = (stocks || []).map((s) => s.toUpperCase())
    const byKey = Object.entries(forecast)

    const matchForSymbol = (upper: string) => {
      // direct
      let found = forecast[upper]
      if (found) return { key: upper, entry: found }
      // search by extracted ticker or case-insensitive match
      for (const [k, v] of byKey) {
        const t = extractTicker(k)
        if (t === upper || k.toUpperCase() === upper) return { key: k, entry: v }
      }
      return null
    }

    const results: StockAnalysis[] = []
    for (const sym of requested) {
      const match = matchForSymbol(sym)
      if (match) {
        results.push({
          symbol: extractTicker(match.key),
          analysis: {
            sentiment: (match.entry.impact as any) || 'neutral',
            confidence: 75,
            news: match.entry.news || `Analysis completed for ${sym}`,
            recommendation: match.entry.reason || `Based on ${(match.entry.impact as any) || 'neutral'} impact`,
          },
        })
      }
    }

    // If none matched, include all from forecast
    if (results.length === 0) {
      for (const [k, v] of byKey) {
        const sym = extractTicker(k)
        results.push({
          symbol: sym,
          analysis: {
            sentiment: (v.impact as any) || 'neutral',
            confidence: 75,
            news: v.news || `Analysis completed for ${sym}`,
            recommendation: v.reason || `Based on ${(v.impact as any) || 'neutral'} impact`,
          },
        })
      }
    }

    if (results.length === 0) {
      console.log('No analysis results generated')
      return null
    }

    return {
      stocks: results,
      timestamp: new Date().toISOString(),
      note: 'Analysis from local server backend - News-based forecasting',
    }
  } catch (error) {
    console.log('Server API call failed, no data to show:', error)
    return null
  }
}
