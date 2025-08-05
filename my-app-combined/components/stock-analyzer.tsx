'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react'
import { config } from '@/lib/config'

interface StockAnalysis {
  symbol: string
  price: number
  change: number
  changePercent: number
  recommendation: string
  confidence: number
}

export default function StockAnalyzer() {
  const [stocks, setStocks] = useState('')
  const [analysis, setAnalysis] = useState<StockAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!stocks.trim()) {
      setError('Please enter stock symbols')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Parse stock symbols (comma-separated)
      const stockArray = stocks
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0)

      if (stockArray.length === 0) {
        setError('Please enter valid stock symbols')
        return
      }

      // RESTRICCIÓN: Máximo 2 stocks por análisis
      if (stockArray.length > 2) {
        setError('Maximum 2 stocks allowed per analysis. Please select only 2 stocks.')
        setLoading(false)
        return
      }

      // Use the Railway webhook URL directly instead of API route
      const webhookUrl = config.railway.webhookUrl
      console.log('Calling Railway webhook:', webhookUrl)

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stocks: stockArray }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze stocks')
      }

      const result = await response.json()
      console.log('Railway response:', result)
      
      // Handle different response formats from Railway
      let analysisData = []
      
      if (Array.isArray(result)) {
        // Handle array format: [{"forecast":{}}]
        analysisData = result.map((item, index) => {
          const symbol = stockArray[index] || `STOCK${index + 1}`
          return {
            symbol,
            price: 0,
            change: 0,
            changePercent: 0,
            recommendation: 'Analysis in progress',
            confidence: 50
          }
        })
      } else if (result.data) {
        analysisData = result.data
      } else if (result.analysis) {
        analysisData = result.analysis
      } else if (result.forecast) {
        // Handle forecast format
        analysisData = stockArray.map((symbol, index) => ({
          symbol,
          price: 0,
          change: 0,
          changePercent: 0,
          recommendation: 'Analysis completed',
          confidence: 75
        }))
      } else {
        analysisData = result
      }
      
      setAnalysis(analysisData)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'No analysis data available from backend. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  // Función para contar stocks en el input
  const getStockCount = () => {
    if (!stocks.trim()) return 0
    return stocks
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0).length
  }

  const stockCount = getStockCount()
  const isOverLimit = stockCount > 2

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Stock Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Stock Symbols (comma-separated) - Max 2 stocks
            </label>
            <Input
              value={stocks}
              onChange={(e) => setStocks(e.target.value)}
              placeholder="AAPL, TSLA (max 2 stocks)"
              className={`bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                isOverLimit ? 'border-red-500' : ''
              }`}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Enter stock symbols separated by commas
              </p>
              <div className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-gray-400'}`}>
                {stockCount}/2 stocks
              </div>
            </div>
            
            {/* Warning message for over limit */}
            {isOverLimit && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/20 p-2 rounded-md border border-red-800">
                <AlertCircle className="h-4 w-4" />
                Maximum 2 stocks allowed per analysis
              </div>
            )}
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={loading || !stocks.trim() || isOverLimit}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Stocks'
            )}
          </Button>

          {error && (
            <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md border border-red-800">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {analysis.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.map((stock, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{stock.symbol}</h4>
                    {getChangeIcon(stock.change)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white">${stock.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Change:</span>
                      <span className={getChangeColor(stock.change)}>
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recommendation:</span>
                      <span className="text-white font-medium">{stock.recommendation}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-white">{stock.confidence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 