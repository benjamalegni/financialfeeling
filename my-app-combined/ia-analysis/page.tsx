'use client'

import { useState, FormEvent } from 'react'

// Tipos para la respuesta del análisis de IA
interface AnalysisDetail {
  impact: string
  news: string
  reason: string
  horizon: string
}

interface Forecast {
  [assetName: string]: AnalysisDetail
}

interface AnalysisResponse {
  forecast: Forecast
}

export default function IaAnalysisPage() {
  const [assetsInput, setAssetsInput] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setAnalysisResult(null)

    const assetsToAnalyze = assetsInput.split(',').map(asset => asset.trim()).filter(asset => asset.length > 0)

    if (assetsToAnalyze.length === 0) {
      setError('Please enter at least one asset to analyze.')
      setIsLoading(false)
      return
    }

    // TODO: Reemplazar con datos de usuario reales cuando el sistema de autenticación/suscripción esté listo
    const requestBody = {
      userData: {
        userId: 'test-user-123', // Ejemplo
        tier: 'premium', // Asumimos premium para acceso completo por ahora
      },
      assetsToAnalyze: assetsToAnalyze,
    }

    try {
      const response = await fetch('http://localhost:5678/webhook-test/88371509-3d66-45d6-9482-5999eb94bc42', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data: AnalysisResponse[] = await response.json()
      setAnalysisResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analysis. Make sure your n8n webhook is running and accessible.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-n8n-dark text-n8n-text-primary font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-n8n-surface p-6 md:p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-n8n-accent mb-6 text-center">AI Financial Analysis</h1>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label htmlFor="assets" className="block text-sm font-medium text-n8n-text-secondary mb-1">
              Assets to Analyze (comma-separated)
            </label>
            <input
              id="assets"
              name="assets"
              type="text"
              value={assetsInput}
              onChange={(e) => setAssetsInput(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-n8n-dark border border-n8n-border rounded-md shadow-sm placeholder-n8n-text-secondary focus:outline-none focus:ring-n8n-accent focus:border-n8n-accent sm:text-sm text-n8n-text-primary"
              placeholder="e.g., NASDAQ:AAPL, US_Employment_Market, BTC-USD"
              required
            />
            <p className="mt-1 text-xs text-n8n-text-secondary">Enter asset symbols or economic indicators.</p>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-n8n-accent hover:bg-n8n-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-n8n-surface focus:ring-n8n-accent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Get Analysis'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-n8n-error/20 border border-n8n-error text-n8n-error px-4 py-3 rounded-md mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {analysisResult && analysisResult.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-n8n-accent mb-4">Analysis Results</h2>
            {analysisResult.map((resultItem, index) => (
              <div key={index} className="bg-n8n-dark p-4 rounded-md shadow-lg">
                {Object.entries(resultItem.forecast).map(([assetName, details]) => (
                  <div key={assetName} className="mb-6 pb-6 border-b border-n8n-border last:border-b-0 last:mb-0 last:pb-0">
                    <h3 className="text-xl font-semibold text-n8n-accent-hover mb-2">{assetName}</h3>
                    <p className={`text-lg font-medium ${details.impact === 'negative' ? 'text-n8n-error' : details.impact === 'positive' ? 'text-n8n-success' : 'text-n8n-text-primary'}`}>
                      Impact: <span className="font-bold">{details.impact}</span>
                    </p>
                    <p className="text-sm text-n8n-text-secondary mt-1">Horizon: {details.horizon}</p>
                    <div className="mt-3 bg-n8n-surface p-3 rounded">
                       <p className="text-md text-n8n-text-primary mb-1"> <span className="font-semibold">News:</span> {details.news}</p>
                       <p className="text-md text-n8n-text-primary"> <span className="font-semibold">Reason:</span> {details.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
         {analysisResult && analysisResult.length === 0 && !isLoading && (
          <div className="text-center text-n8n-text-secondary py-4">
            No analysis results to display.
          </div>
        )}
      </div>
    </div>
  )
}
