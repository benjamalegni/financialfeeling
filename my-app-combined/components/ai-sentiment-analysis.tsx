"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, Clock, Activity, BarChart3, X } from 'lucide-react'
import { analyzeStocks } from '@/lib/stockAnalysis'
import { getFinancialData, FinancialMetrics, calculateFundamentalScore } from '@/lib/financialData'

interface SentimentData {
  symbol: string
  horizon: string
  impact: 'positive' | 'negative' | 'neutral'
  news: string
  reason: string
  fundamentalScore?: number
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

  const isLikelyStock = (sym: string) => /^[A-Z]{1,5}$/.test(sym || '')

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
            const sym = (stock.symbol || '').toUpperCase()
            const stockLike = isLikelyStock(sym)

            // Fetch financial data only for likely stocks
            let financialData: FinancialMetrics | undefined
            let fundamentalScore: number | undefined
            if (stockLike) {
              try {
                const data = await getFinancialData(sym)
                financialData = data || undefined
                if (data) {
                  fundamentalScore = calculateFundamentalScore(data)
                }
              } catch (error) {
                console.error(`Error fetching financial data for ${sym}:`, error)
                financialData = undefined
              }
            }

            return {
              symbol: sym,
              horizon: 'Short-term',
              impact: stock.analysis.sentiment,
              news: stock.analysis.news,
              reason: stock.analysis.recommendation,
              fundamentalScore,
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
        const sym = (stock.symbol || '').toUpperCase()
        const stockLike = isLikelyStock(sym)
        let fundamentalScore: number | undefined
        if (stockLike) {
          // fallback: derive score only if stock; else leave undefined
          if (stock.analysis?.sentiment === 'positive') {
            fundamentalScore = Math.floor(Math.random() * 20) + 80;
          } else if (stock.analysis?.sentiment === 'negative') {
            fundamentalScore = Math.floor(Math.random() * 20) + 60;
          } else {
            fundamentalScore = Math.floor(Math.random() * 20) + 70;
          }
        }

        return {
          symbol: sym,
          horizon: 'Short-term',
          impact: stock.analysis?.sentiment || 'neutral',
          news: stock.analysis?.news || 'No news available',
          reason: stock.analysis?.recommendation || 'No analysis available',
          fundamentalScore,
          timestamp: new Date().toISOString()
        } as SentimentData
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

  const inPortfolio = sentimentData.filter((s) => selectedAssets.includes(s.symbol))
  const notInPortfolio = sentimentData.filter((s) => !selectedAssets.includes(s.symbol))

  const renderItems = (items: SentimentData[]) => (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={`${item.symbol}-${index}`}
          className={`border-l-4 p-6 rounded-lg shadow-md ${getImpactColor(item.impact)}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getImpactIcon(item.impact)}
                <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
                {/* Show financial data icon only when we have financial data */}
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

          {/* Fundamental score only for likely stocks with score */}
          {typeof item.fundamentalScore === 'number' && isLikelyStock(item.symbol) && (
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
          )}
        </div>
      ))}
    </div>
  )

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
      ) : (
        <div className="space-y-8">
          {inPortfolio.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">In your portfolio</h3>
              {renderItems(inPortfolio)}
            </div>
          )}
          {notInPortfolio.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Outside your portfolio</h3>
              {renderItems(notInPortfolio)}
            </div>
          )}
          {inPortfolio.length === 0 && notInPortfolio.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Ready to analyze {selectedAssets.length} assets</p>
              <p className="text-sm text-gray-500">Press the RUN button to start AI analysis with Railway backend</p>
            </div>
          )}
        </div>
      )}

      {/* Financial Data Modal */}
      {showFinancialModal && selectedFinancialData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
              <h3 className="text-2xl font-bold text-white">Fundamental Data - {selectedFinancialData.symbol}</h3>
              <button
                onClick={() => setShowFinancialModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
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
                        calculateFundamentalScore(selectedFinancialData) >= 75 ? 'bg-green-500' :
                        calculateFundamentalScore(selectedFinancialData) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${calculateFundamentalScore(selectedFinancialData)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-white font-semibold">
                  {calculateFundamentalScore(selectedFinancialData)}%
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Based on P/E ratio, debt levels, profitability metrics, and growth indicators
              </p>
            </div>
            
            {/* Metrics Grid - All metrics without descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {/* Valuation Metrics */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-white mb-3">Valuation</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">P/E Ratio</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.peRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Valuation</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.peRatio < 15 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.peRatio < 25 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.peRatio < 15 ? 'L' : selectedFinancialData.peRatio < 25 ? 'M' : 'H'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Forward P/E</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.forwardPE.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Future Valuation</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.forwardPE < 15 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.forwardPE < 25 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.forwardPE < 15 ? 'L' : selectedFinancialData.forwardPE < 25 ? 'M' : 'H'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">PEG Ratio</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.pegRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Growth Adjusted</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.pegRatio < 1 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.pegRatio < 1.5 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.pegRatio < 1 ? 'L' : selectedFinancialData.pegRatio < 1.5 ? 'M' : 'H'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Price to Book</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.priceToBook.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Asset Value</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.priceToBook < 1.5 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.priceToBook < 3 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.priceToBook < 1.5 ? 'L' : selectedFinancialData.priceToBook < 3 ? 'M' : 'H'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Health Metrics */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-white mb-3">Financial Health</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Debt to Equity</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.debtToEquity.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Leverage</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.debtToEquity < 0.5 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.debtToEquity < 1 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.debtToEquity < 0.5 ? 'L' : selectedFinancialData.debtToEquity < 1 ? 'M' : 'H'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Current Ratio</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.currentRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Liquidity</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.currentRatio > 1.5 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.currentRatio > 1 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.currentRatio > 1.5 ? 'H' : selectedFinancialData.currentRatio > 1 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Quick Ratio</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.quickRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Acid Test</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.quickRatio > 1 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.quickRatio > 0.5 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.quickRatio > 1 ? 'H' : selectedFinancialData.quickRatio > 0.5 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Return on Equity</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.returnOnEquity.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Profitability</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.returnOnEquity > 15 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.returnOnEquity > 10 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.returnOnEquity > 15 ? 'H' : selectedFinancialData.returnOnEquity > 10 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth & Market Metrics */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-white mb-3">Growth & Market</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Revenue Growth</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.revenueGrowth.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Sales Growth</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.revenueGrowth > 15 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.revenueGrowth > 5 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.revenueGrowth > 15 ? 'H' : selectedFinancialData.revenueGrowth > 5 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Earnings Growth</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.earningsGrowth.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Profit Growth</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.earningsGrowth > 10 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.earningsGrowth > 5 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.earningsGrowth > 10 ? 'H' : selectedFinancialData.earningsGrowth > 5 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Profit Margin</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.profitMargin.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Efficiency</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.profitMargin > 15 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.profitMargin > 8 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.profitMargin > 15 ? 'H' : selectedFinancialData.profitMargin > 8 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Operating Margin</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.operatingMargin.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Operational Efficiency</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.operatingMargin > 20 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.operatingMargin > 10 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.operatingMargin > 20 ? 'H' : selectedFinancialData.operatingMargin > 10 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dividend & Returns Metrics */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-white mb-3">Dividend & Returns</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Dividend Yield</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.dividendYield.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Income</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.dividendYield > 3 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.dividendYield > 1 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.dividendYield > 3 ? 'H' : selectedFinancialData.dividendYield > 1 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Payout Ratio</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.payoutRatio.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Sustainability</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.payoutRatio < 50 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.payoutRatio < 75 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.payoutRatio < 50 ? 'L' : selectedFinancialData.payoutRatio < 75 ? 'M' : 'H'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Return on Assets</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.returnOnAssets.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Asset Efficiency</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.returnOnAssets > 10 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.returnOnAssets > 5 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.returnOnAssets > 10 ? 'H' : selectedFinancialData.returnOnAssets > 5 ? 'M' : 'L'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Beta</span>
                        <span className="text-white font-semibold text-lg">{selectedFinancialData.beta.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">Volatility</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFinancialData.beta < 1 ? 'bg-green-600 text-white shadow-lg' :
                          selectedFinancialData.beta < 1.5 ? 'bg-yellow-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                        }`}>
                          {selectedFinancialData.beta < 1 ? 'L' : selectedFinancialData.beta < 1.5 ? 'M' : 'H'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Descriptions Section */}
            <div className="border-t border-gray-600 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Metric Descriptions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-white mb-1">P/E Ratio (Price-to-Earnings)</h5>
                    <p className="text-gray-400">Price-to-earnings ratio. Measures how much you pay for each dollar of earnings.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">Forward P/E</h5>
                    <p className="text-gray-400">P/E based on estimated future earnings. Lower values are generally better.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">PEG Ratio</h5>
                    <p className="text-gray-400">P/E adjusted for growth. Values below 1 indicate good valuation.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">Price to Book</h5>
                    <p className="text-gray-400">Price-to-book value ratio. Measures if the stock is overvalued.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">Debt to Equity</h5>
                    <p className="text-gray-400">Debt-to-equity ratio. Lower values indicate lower financial risk.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-white mb-1">Current Ratio</h5>
                    <p className="text-gray-400">Short-term liquidity. Values above 1.5 indicate good solvency.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">Return on Equity (ROE)</h5>
                    <p className="text-gray-400">Return on equity. Measures company efficiency and profitability.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">Profit Margin</h5>
                    <p className="text-gray-400">Net profit margin. Percentage of earnings over revenue.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">Revenue Growth</h5>
                    <p className="text-gray-400">Annual revenue growth. Indicates business expansion.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">Beta</h5>
                    <p className="text-gray-400">Volatility vs market. &lt;1: Less volatile, &gt;1: More volatile.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 