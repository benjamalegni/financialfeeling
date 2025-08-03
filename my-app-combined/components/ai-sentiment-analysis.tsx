"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, Clock, Activity, BarChart3, X } from 'lucide-react'
import { analyzeStocks } from '@/lib/stockAnalysis'
import { getFinancialData, calculateFundamentalScore, combineSentimentAndFundamentals, FinancialMetrics } from '@/lib/financialData'

interface SentimentData {
  symbol: string
  horizon: string
  impact: 'positive' | 'negative' | 'neutral'
  news: string
  reason: string
  confidence: number
  timestamp?: string
  fundamentalScore?: number
  buyScore?: number
  buyRecommendation?: string
  financialData?: FinancialMetrics
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
      // Use the Railway backend directly
      const result = await analyzeStocks(selectedAssets)
      
      if (result && result.stocks) {
        // Transform Railway data to sentiment data format with financial analysis
        const processedData: SentimentData[] = await Promise.all(
          result.stocks.map(async (stock: any) => {
            // Get financial data for fundamental analysis
            const financialData = await getFinancialData(stock.symbol);
            let fundamentalScore = 75; // Default fallback
            let buyScore = 75;
            let buyRecommendation = 'Consider based on news analysis';

            if (financialData) {
              const fundamentalAnalysis = calculateFundamentalScore(financialData);
              fundamentalScore = fundamentalAnalysis.score;
              
              // Combine sentiment and fundamentals
              const combinedAnalysis = combineSentimentAndFundamentals(
                stock.analysis.sentiment,
                fundamentalScore
              );
              buyScore = combinedAnalysis.buyScore;
              buyRecommendation = combinedAnalysis.recommendation;
            }

            return {
              symbol: stock.symbol,
              horizon: 'Short-term', // Railway doesn't provide horizon, using default
              impact: stock.analysis.sentiment,
              news: stock.analysis.news,
              reason: stock.analysis.recommendation,
              confidence: stock.analysis.confidence,
              timestamp: result.timestamp,
              fundamentalScore,
              buyScore,
              buyRecommendation,
              financialData: financialData || undefined
            }
          })
        )

        setSentimentData(processedData)
        console.log('Railway analysis with financial data processed:', processedData)
      } else {
        setError('No analysis data available from Railway backend')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Process external analysis data when available
  useEffect(() => {
    if (analysisData && analysisData.stocks) {
      setIsLoading(false);
      setError(null);
      
      // Convert Railway data to sentiment data format
      const processedData: SentimentData[] = analysisData.stocks.map((stock: any) => {
        return {
          symbol: stock.symbol,
          horizon: 'Short-term', // Railway doesn't provide horizon, using default
          impact: stock.analysis.sentiment,
          news: stock.analysis.news,
          reason: stock.analysis.recommendation,
          confidence: stock.analysis.confidence,
          timestamp: analysisData.timestamp || new Date().toISOString()
        };
      });

      setSentimentData(processedData);
      console.log('External analysis data processed:', processedData);
    }
  }, [analysisData]);

  const handleShowFinancialData = (financialData: FinancialMetrics) => {
    setSelectedFinancialData(financialData);
    setShowFinancialModal(true);
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Minus className="h-5 w-5 text-gray-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-green-500 bg-green-900/10'
      case 'negative':
        return 'border-red-500 bg-red-900/10'
      default:
        return 'border-gray-500 bg-gray-900/10'
    }
  }

  const getHorizonColor = (horizon: string) => {
    switch (horizon) {
      case 'Short-term':
        return 'bg-blue-900/30 text-blue-300'
      case 'Medium-term':
        return 'bg-yellow-900/30 text-yellow-300'
      case 'Long-term':
        return 'bg-purple-900/30 text-purple-300'
      default:
        return 'bg-gray-900/30 text-gray-300'
    }
  }

  const getFundamentalScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getBuyScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-900/30 text-green-300'
    if (score >= 60) return 'bg-yellow-900/30 text-yellow-300'
    if (score >= 40) return 'bg-orange-900/30 text-orange-300'
    return 'bg-red-900/30 text-red-300'
  }

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  if (selectedAssets.length === 0) {
    return (
      <div className="bg-black rounded-lg border border-gray-700 p-6 shadow-lg">
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
    <div className="bg-black rounded-lg border border-gray-700 p-6 shadow-lg">
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
          <p className="text-gray-400">Analyzing market sentiment and fundamentals...</p>
        </div>
      ) : sentimentData.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Ready to analyze {selectedAssets.length} assets</p>
          <p className="text-sm text-gray-500">Press the RUN button to start AI analysis with Railway backend and financial data</p>
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
                    {item.financialData && (
                      <button
                        onClick={() => handleShowFinancialData(item.financialData!)}
                        className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-all duration-200 group"
                        title="Ver datos financieros fundamentales"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span className="sr-only">Ver datos financieros</span>
                      </button>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHorizonColor(item.horizon)}`}>
                    {item.horizon}
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
                      <span className="text-xs text-gray-400">Sentiment Impact</span>
                      <div className="flex items-center space-x-2">
                        {getImpactIcon(item.impact)}
                        <span className={`text-sm font-medium ${
                          item.impact === 'positive' ? 'text-green-400' :
                          item.impact === 'negative' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Fundamental Score</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${getFundamentalScoreColor(item.fundamentalScore || 75)}`}
                            style={{ width: `${item.fundamentalScore || 75}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-300">{item.fundamentalScore || 75}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Buy Opportunity</span>
                      <div className="flex items-center space-x-1">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getBuyScoreColor(item.buyScore || 75)}`}>
                          {item.buyScore && item.buyScore >= 80 ? 'Strong Buy' :
                           item.buyScore && item.buyScore >= 60 ? 'Buy' :
                           item.buyScore && item.buyScore >= 40 ? 'Hold' :
                           item.buyScore && item.buyScore >= 20 ? 'Sell' : 'Strong Sell'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {item.buyRecommendation && (
                  <div className="mt-2 text-xs text-gray-400">
                    {item.buyRecommendation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Data Modal */}
      {showFinancialModal && selectedFinancialData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span>Datos Financieros Fundamentales - {selectedFinancialData.symbol}</span>
              </h3>
              <button
                onClick={() => setShowFinancialModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valuation Metrics */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-blue-400 border-b border-blue-800 pb-1">Métricas de Valuación</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">P/E Ratio:</span>
                    <span className="text-white font-medium">{selectedFinancialData.per.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Forward P/E:</span>
                    <span className="text-white font-medium">{selectedFinancialData.forwardPer.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">PEG Ratio:</span>
                    <span className="text-white font-medium">{selectedFinancialData.peg.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Financial Health */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-green-400 border-b border-green-800 pb-1">Salud Financiera</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Cash Flow:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedFinancialData.cashFlow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Total Debt:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedFinancialData.debt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Market Cap:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedFinancialData.marketCap)}</span>
                  </div>
                </div>
              </div>

              {/* Growth Metrics */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-yellow-400 border-b border-yellow-800 pb-1">Métricas de Crecimiento</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Revenue Growth:</span>
                    <span className={`font-medium ${selectedFinancialData.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(selectedFinancialData.revenueGrowth)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Profit Margin:</span>
                    <span className="text-white font-medium">{formatPercentage(selectedFinancialData.profitMargin)}</span>
                  </div>
                </div>
              </div>

              {/* Company Guidance */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-purple-400 border-b border-purple-800 pb-1">Orientación de la Empresa</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Guidance:</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${
                      selectedFinancialData.guidance === 'positive' ? 'bg-green-900/30 text-green-300' :
                      selectedFinancialData.guidance === 'negative' ? 'bg-red-900/30 text-red-300' :
                      'bg-gray-900/30 text-gray-300'
                    }`}>
                      {selectedFinancialData.guidance.charAt(0).toUpperCase() + selectedFinancialData.guidance.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Interpretación de Datos</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• <strong>P/E Ratio:</strong> {selectedFinancialData.per < 15 ? 'Subvaluado' : selectedFinancialData.per < 25 ? 'Justo' : 'Sobrevaluado'}</p>
                <p>• <strong>PEG Ratio:</strong> {selectedFinancialData.peg < 1 ? 'Excelente' : selectedFinancialData.peg < 2 ? 'Bueno' : 'Alto'}</p>
                <p>• <strong>Cash Flow:</strong> {selectedFinancialData.cashFlow > 0 ? 'Positivo' : 'Negativo'}</p>
                <p>• <strong>Revenue Growth:</strong> {selectedFinancialData.revenueGrowth > 10 ? 'Alto crecimiento' : selectedFinancialData.revenueGrowth > 0 ? 'Crecimiento positivo' : 'Crecimiento negativo'}</p>
                <p>• <strong>Profit Margin:</strong> {selectedFinancialData.profitMargin > 15 ? 'Alta rentabilidad' : selectedFinancialData.profitMargin > 5 ? 'Rentabilidad moderada' : 'Baja rentabilidad'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}