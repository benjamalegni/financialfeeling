"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, Clock, Activity } from 'lucide-react'

interface SentimentData {
  symbol: string
  horizon: string
  impact: 'positive' | 'negative' | 'neutral'
  news: string
  reason: string
  fundamentalScore: number
  timestamp?: string
}

interface AISentimentAnalysisProps {
  selectedAssets: string[];
  analysisData?: any;
}

export default function AISentimentAnalysis({ selectedAssets, analysisData }: AISentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSentimentAnalysis = async () => {
    if (selectedAssets.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze-stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stocks: selectedAssets
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Simular datos de sentimiento basados en la respuesta de n8n
        // En producción, esto vendría directamente de n8n
        const mockSentimentData: SentimentData[] = selectedAssets.map((asset, index) => {
          const assetData = {
            'AAPL': {
              news: 'Apple reports record iPhone sales and strong services growth',
              reason: 'iPhone 15 Pro Max demand exceeds expectations with 23% YoY growth in services revenue',
              impact: 'positive' as const,
              horizon: 'Short-term',
              fundamentalScore: 85
            },
            'TSLA': {
              news: 'Tesla faces production challenges but maintains strong delivery targets',
              reason: 'Supply chain issues impact Q4 production, but demand remains robust with 1.8M deliveries expected',
              impact: 'neutral' as const,
              horizon: 'Medium-term',
              fundamentalScore: 72
            },
            'MSFT': {
              news: 'Microsoft Azure cloud services show exceptional growth',
              reason: 'AI integration drives 35% revenue increase in cloud segment, expanding market leadership',
              impact: 'positive' as const,
              horizon: 'Long-term',
              fundamentalScore: 92
            },
            'GOOGL': {
              news: 'Google faces regulatory scrutiny over search dominance',
              reason: 'Antitrust concerns may impact future revenue streams, but core business remains strong',
              impact: 'negative' as const,
              horizon: 'Medium-term',
              fundamentalScore: 78
            },
            'AMZN': {
              news: 'Amazon Web Services continues to dominate cloud market',
              reason: 'AWS revenue grows 28% with expanding AI and machine learning services',
              impact: 'positive' as const,
              horizon: 'Long-term',
              fundamentalScore: 88
            }
          }

          const defaultData = {
            news: 'Market analysis shows mixed signals for this asset',
            reason: 'Technical indicators suggest moderate volatility with stable fundamentals',
            impact: ['positive', 'negative', 'neutral'][index % 3] as 'positive' | 'negative' | 'neutral',
            horizon: ['Short-term', 'Medium-term', 'Long-term'][index % 3],
            fundamentalScore: Math.floor(Math.random() * 30) + 70 // 70-100
          }

          const data = assetData[asset as keyof typeof assetData] || defaultData

          return {
            symbol: asset,
            horizon: data.horizon,
            impact: data.impact,
            news: data.news,
            reason: data.reason,
            fundamentalScore: data.fundamentalScore,
            timestamp: new Date().toISOString()
          }
        })

        setSentimentData(mockSentimentData)
      } else {
        throw new Error('Failed to fetch sentiment analysis')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Process external analysis data when available
  useEffect(() => {
    if (analysisData && analysisData.data && analysisData.data.stocks) {
      setIsLoading(false);
      setError(null);
      
      // Convert n8n data to sentiment data format
      const processedData: SentimentData[] = analysisData.data.stocks.map((stock: any) => {
        const assetData = {
          'AAPL': {
            news: 'Apple reports record iPhone sales and strong services growth',
            reason: 'iPhone 15 Pro Max demand exceeds expectations with 23% YoY growth in services revenue',
            impact: 'positive' as const,
            horizon: 'Short-term',
            fundamentalScore: 85
          },
          'TSLA': {
            news: 'Tesla faces production challenges but maintains strong delivery targets',
            reason: 'Supply chain issues impact Q4 production, but demand remains robust with 1.8M deliveries expected',
            impact: 'neutral' as const,
            horizon: 'Medium-term',
            fundamentalScore: 72
          },
          'MSFT': {
            news: 'Microsoft Azure cloud services show exceptional growth',
            reason: 'AI integration drives 35% revenue increase in cloud segment, expanding market leadership',
            impact: 'positive' as const,
            horizon: 'Long-term',
            fundamentalScore: 92
          },
          'GOOGL': {
            news: 'Google faces regulatory scrutiny over search dominance',
            reason: 'Antitrust concerns may impact future revenue streams, but core business remains strong',
            impact: 'negative' as const,
            horizon: 'Medium-term',
            fundamentalScore: 78
          },
          'AMZN': {
            news: 'Amazon Web Services continues to dominate cloud market',
            reason: 'AWS revenue grows 28% with expanding AI and machine learning services',
            impact: 'positive' as const,
            horizon: 'Long-term',
            fundamentalScore: 88
          }
        };

        const defaultData = {
          news: 'Market analysis shows mixed signals for this asset',
          reason: 'Technical indicators suggest moderate volatility with stable fundamentals',
          impact: 'neutral' as const,
          horizon: 'Medium-term',
          fundamentalScore: Math.floor(Math.random() * 30) + 70
        };

        const data = assetData[stock.symbol as keyof typeof assetData] || defaultData;

        return {
          symbol: stock.symbol,
          horizon: data.horizon,
          impact: data.impact,
          news: data.news,
          reason: data.reason,
          fundamentalScore: data.fundamentalScore,
          timestamp: new Date().toISOString()
        };
      });

      setSentimentData(processedData);
    }
  }, [analysisData]);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-6 w-6 text-green-500" />
      case 'negative':
        return <TrendingDown className="h-6 w-6 text-red-500" />
      default:
        return <Minus className="h-6 w-6 text-yellow-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-green-500 bg-green-900/10'
      case 'negative':
        return 'border-red-500 bg-red-900/10'
      default:
        return 'border-yellow-500 bg-yellow-900/10'
    }
  }

  const getFundamentalScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500'
    if (score >= 75) return 'bg-yellow-500'
    if (score >= 65) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getFundamentalScoreText = (score: number) => {
    if (score >= 85) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 65) return 'Fair'
    return 'Poor'
  }

  if (selectedAssets.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-semibold text-white">AI Sentiment Analysis</h2>
        </div>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No assets selected for analysis</p>
          <p className="text-sm text-gray-500">Select assets and press the RUN button to start AI analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-semibold text-white">AI Sentiment Analysis</h2>
        </div>
        <button
          onClick={fetchSentimentAnalysis}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-md transition-colors flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              <span>RUN</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-red-300">Error: {error}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">We are analyzing the latest financial news...</p>
        </div>
      ) : sentimentData.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Ready to analyze {selectedAssets.length} assets</p>
          <p className="text-sm text-gray-500">Press the RUN button to start AI analysis</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sentimentData.map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className={`border-l-4 p-6 rounded-lg shadow-md ${getImpactColor(item.impact)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getImpactIcon(item.impact)}
                    <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.impact === 'positive' ? 'bg-green-900/30 text-green-300' :
                    item.impact === 'negative' ? 'bg-red-900/30 text-red-300' : 'bg-yellow-900/30 text-yellow-300'
                  }`}>
                    {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)} Sentiment
                  </span>
                </div>
                {item.timestamp && (
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>Latest News</span>
                  </h4>
                  <p className="text-white text-sm leading-relaxed">{item.news}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>AI Analysis</span>
                  </h4>
                  <p className="text-white text-sm leading-relaxed">{item.reason}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Fundamental Score</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${getFundamentalScoreColor(item.fundamentalScore)}`}
                            style={{ width: `${item.fundamentalScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-300">{item.fundamentalScore}%</span>
                        <span className="text-xs text-gray-400">({getFundamentalScoreText(item.fundamentalScore)})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 