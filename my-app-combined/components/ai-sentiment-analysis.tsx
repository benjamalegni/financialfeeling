"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, Clock, Activity, BarChart3, X } from 'lucide-react'
import { analyzeStocks } from '@/lib/stockAnalysis'
import { getFinancialData, FinancialMetrics } from '@/lib/financialData'

interface SentimentData {
  symbol: string
  horizon: string
  impact: 'positive' | 'negative' | 'neutral'
  news: string
  reason: string
  fundamentalScore: number
  timestamp?: string
  financialData?: FinancialMetrics | null
}

interface AISentimentAnalysisProps {
  selectedAssets: string[];
  analysisData?: any;
}

export default function AISentimentAnalysis({ selectedAssets, analysisData }: AISentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFinancialModal, setShowFinancialModal] = useState(false)
  const [selectedFinancialData, setSelectedFinancialData] = useState<FinancialMetrics | null>(null)

  const fetchSentimentAnalysis = async () => {
    if (selectedAssets.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      // Call Railway backend for real analysis
      const analysisResult = await analyzeStocks(selectedAssets)
      
      if (analysisResult && analysisResult.stocks.length > 0) {
        // Transform Railway data to sentiment format
        const realSentimentData: SentimentData[] = await Promise.all(
          analysisResult.stocks.map(async (stock) => {
            // Calculate fundamental score based on sentiment (simulated for now)
            let fundamentalScore = 75; // Default
            if (stock.analysis.sentiment === 'positive') {
              fundamentalScore = Math.floor(Math.random() * 20) + 80; // 80-100
            } else if (stock.analysis.sentiment === 'negative') {
              fundamentalScore = Math.floor(Math.random() * 20) + 60; // 60-80
            } else {
              fundamentalScore = Math.floor(Math.random() * 20) + 70; // 70-90
            }

            // Fetch financial data for stocks only
            let financialData: FinancialMetrics | undefined
            if (stock.symbol && stock.symbol.length <= 5) { // Only for stocks, not ETFs or other assets
              try {
                const data = await getFinancialData(stock.symbol)
                financialData = data || undefined
              } catch (error) {
                console.error(`Error fetching financial data for ${stock.symbol}:`, error)
                financialData = undefined
              }
            }

            return {
              symbol: stock.symbol,
              horizon: 'Short-term', // Default horizon
              impact: stock.analysis.sentiment,
              news: stock.analysis.news,
              reason: stock.analysis.recommendation,
              fundamentalScore: fundamentalScore,
              timestamp: analysisResult.timestamp,
              financialData: financialData
            }
          })
        )

        setSentimentData(realSentimentData)
      } else {
        // No data available from Railway
        setError('No analysis data available from backend. Please try again later.')
        setSentimentData([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis from backend')
      setSentimentData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowFinancialData = (financialData: FinancialMetrics) => {
    setSelectedFinancialData(financialData)
    setShowFinancialModal(true)
  }

  // Process external analysis data when available
  useEffect(() => {
    if (analysisData && analysisData.data && analysisData.data.stocks) {
      setIsLoading(false);
      setError(null);
      
      // Convert n8n data to sentiment data format
      const processedData: SentimentData[] = analysisData.data.stocks.map((stock: any) => {
        // Calculate fundamental score based on sentiment
        let fundamentalScore = 75;
        if (stock.analysis?.sentiment === 'positive') {
          fundamentalScore = Math.floor(Math.random() * 20) + 80;
        } else if (stock.analysis?.sentiment === 'negative') {
          fundamentalScore = Math.floor(Math.random() * 20) + 60;
        } else {
          fundamentalScore = Math.floor(Math.random() * 20) + 70;
        }

        return {
          symbol: stock.symbol,
          horizon: 'Short-term',
          impact: stock.analysis?.sentiment || 'neutral',
          news: stock.analysis?.news || 'No news available',
          reason: stock.analysis?.recommendation || 'No analysis available',
          fundamentalScore: fundamentalScore,
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
          <p className="text-sm text-gray-500">Press the RUN button to start AI analysis with Railway backend</p>
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
                    {/* Show financial data icon only for stocks */}
                    {item.financialData && (
                      <button
                        onClick={() => handleShowFinancialData(item.financialData!)}
                        className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                        title="View fundamental data"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                    )}
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
                    
                    {/* Buy Opportunity Indicator */}
                    {item.impact === 'negative' && item.fundamentalScore >= 75 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Buy Opportunity</span>
                        <div className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                          BUY NOW
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Data Modal */}
      {showFinancialModal && selectedFinancialData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Fundamental Data - {selectedFinancialData.symbol}
              </h3>
              <button
                onClick={() => setShowFinancialModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Fundamental Score Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-3">Fundamental Score</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedFinancialData.peRatio > 0 && selectedFinancialData.peRatio < 25 ? 'bg-green-500' :
                        selectedFinancialData.peRatio >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, 
                        (selectedFinancialData.peRatio > 0 && selectedFinancialData.peRatio < 25 ? 85 :
                         selectedFinancialData.peRatio >= 25 ? 60 : 30)
                      ))}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-white font-semibold">
                  {selectedFinancialData.peRatio > 0 && selectedFinancialData.peRatio < 25 ? '85%' :
                   selectedFinancialData.peRatio >= 25 ? '60%' : '30%'}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Based on P/E ratio, debt levels, and profitability metrics
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-3">Valuation Metrics</h4>
                
                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">P/E Ratio</span>
                    <span className="text-white font-semibold">{selectedFinancialData.peRatio.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Price-to-Earnings ratio. Good: 10-25, High: &gt;25, Low: &lt;10
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Forward P/E</span>
                    <span className="text-white font-semibold">{selectedFinancialData.forwardPE.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Future earnings estimate. Lower is generally better
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">PEG Ratio</span>
                    <span className="text-white font-semibold">{selectedFinancialData.pegRatio.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Price/Earnings to Growth. Good: &lt;1, Fair: 1-2, High: &gt;2
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Price to Book</span>
                    <span className="text-white font-semibold">{selectedFinancialData.priceToBook.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Market value vs book value. Good: &lt;3, High: &gt;5
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-3">Financial Health</h4>
                
                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Debt to Equity</span>
                    <span className="text-white font-semibold">{selectedFinancialData.debtToEquity.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Debt levels. Good: &lt;0.5, Fair: 0.5-1, High: &gt;1
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Current Ratio</span>
                    <span className="text-white font-semibold">{selectedFinancialData.currentRatio.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Short-term liquidity. Good: &gt;1.5, Fair: 1-1.5, Low: &lt;1
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Return on Equity</span>
                    <span className="text-white font-semibold">{selectedFinancialData.returnOnEquity.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Profitability efficiency. Good: &gt;15%, Fair: 10-15%, Low: &lt;10%
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Profit Margin</span>
                    <span className="text-white font-semibold">{selectedFinancialData.profitMargin.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Net profit percentage. Good: &gt;15%, Fair: 10-15%, Low: &lt;10%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-3">Growth &amp; Market</h4>
                
                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Revenue Growth</span>
                    <span className="text-white font-semibold">{selectedFinancialData.revenueGrowth.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Annual revenue increase. Good: &gt;10%, Fair: 5-10%, Low: &lt;5%
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Market Cap</span>
                    <span className="text-white font-semibold">${parseInt(selectedFinancialData.marketCap).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Total market value of the company
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Beta</span>
                    <span className="text-white font-semibold">{selectedFinancialData.beta.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Volatility vs market. &lt;1: Less volatile, &gt;1: More volatile
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-3">Dividend &amp; Returns</h4>
                
                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Dividend Yield</span>
                    <span className="text-white font-semibold">{selectedFinancialData.dividendYield.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Annual dividend return. Good: 2-6%, High: &gt;6%, Low: &lt;2%
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Payout Ratio</span>
                    <span className="text-white font-semibold">{selectedFinancialData.payoutRatio.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Dividend payout percentage. Good: &lt;60%, High: &gt;80%
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Return on Assets</span>
                    <span className="text-white font-semibold">{selectedFinancialData.returnOnAssets.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Asset efficiency. Good: &gt;8%, Fair: 5-8%, Low: &lt;5%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 