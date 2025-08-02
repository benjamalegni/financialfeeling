import StockAnalyzer from '@/components/stock-analyzer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react'

export default function StockAnalysisPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Stock Analysis</h1>
          <p className="text-gray-400 text-lg">
            Analyze stocks using AI-powered insights and market data
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <h3 className="text-xl font-semibold">Real-time Data</h3>
              </div>
              <p className="text-gray-400">
                Get the latest stock prices, trends, and market movements
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <h3 className="text-xl font-semibold">AI Analysis</h3>
              </div>
              <p className="text-gray-400">
                Advanced AI algorithms provide trading recommendations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-purple-400" />
                <h3 className="text-xl font-semibold">Confidence Scores</h3>
              </div>
              <p className="text-gray-400">
                Understand the confidence level of each recommendation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Analyzer Component */}
        <StockAnalyzer />

        {/* Instructions */}
        <Card className="bg-gray-900 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">1. Enter Stock Symbols</h4>
                <p className="text-gray-400 text-sm">
                  Type the stock symbols you want to analyze, separated by commas.
                  Example: AAPL, TSLA, MSFT, GOOGL
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">2. Get AI Analysis</h4>
                <p className="text-gray-400 text-sm">
                  Our AI will analyze market data, trends, and provide trading recommendations
                  with confidence scores for each stock.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">3. Review Results</h4>
                <p className="text-gray-400 text-sm">
                  View detailed analysis including price changes, recommendations,
                  and confidence levels for informed decision making.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">4. Make Decisions</h4>
                <p className="text-gray-400 text-sm">
                  Use the insights to make informed trading decisions based on
                  AI-powered analysis and market trends.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 