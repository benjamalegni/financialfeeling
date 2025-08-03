import { NextRequest, NextResponse } from 'next/server'

export interface StockAnalysis {
  symbol: string;
  analysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    news: string;
    recommendation: string;
  };
}

export interface AnalysisResult {
  stocks: StockAnalysis[];
  timestamp: string;
  note?: string;
}

// Mock stock data for demonstration - only for known stocks
const mockStockData = {
  'AAPL': {
    sentiment: 'positive' as const,
    confidence: 85,
    news: 'Strong earnings report exceeds expectations with iPhone sales up 15%',
    recommendation: 'BUY - Strong fundamentals and growth potential'
  },
  'TSLA': {
    sentiment: 'negative' as const,
    confidence: 72,
    news: 'Regulatory concerns impact market sentiment',
    recommendation: 'HOLD - Monitor regulatory developments'
  },
  'MSFT': {
    sentiment: 'neutral' as const,
    confidence: 78,
    news: 'Stable performance with moderate growth outlook',
    recommendation: 'HOLD - Stable performance expected'
  },
  'GOOGL': {
    sentiment: 'positive' as const,
    confidence: 82,
    news: 'AI advancements drive revenue growth',
    recommendation: 'BUY - Strong AI positioning'
  },
  'AMZN': {
    sentiment: 'neutral' as const,
    confidence: 75,
    news: 'E-commerce growth stabilizes',
    recommendation: 'HOLD - Wait for clearer direction'
  },
  'NVDA': {
    sentiment: 'positive' as const,
    confidence: 88,
    news: 'AI chip demand continues to surge',
    recommendation: 'BUY - Strong AI market position'
  },
  'META': {
    sentiment: 'negative' as const,
    confidence: 68,
    news: 'Privacy concerns impact ad revenue',
    recommendation: 'HOLD - Monitor privacy regulations'
  },
  'NFLX': {
    sentiment: 'positive' as const,
    confidence: 80,
    news: 'Subscriber growth exceeds expectations',
    recommendation: 'BUY - Strong content strategy'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stocks } = body

    if (!stocks || !Array.isArray(stocks)) {
      return NextResponse.json(
        { error: 'Invalid request: stocks array is required' },
        { status: 400 }
      )
    }

    const validStocks = stocks.filter((stock: string) => 
      typeof stock === 'string' && stock.trim().length > 0
    )

    if (validStocks.length === 0) {
      return NextResponse.json(
        { error: 'No valid stock symbols provided' },
        { status: 400 }
      )
    }

    // Only analyze stocks that have known data
    const analysisResults: StockAnalysis[] = []
    
    validStocks.forEach((symbol: string) => {
      const upperSymbol = symbol.toUpperCase()
      const mockData = mockStockData[upperSymbol as keyof typeof mockStockData]
      
      if (mockData) {
        analysisResults.push({
          symbol: upperSymbol,
          analysis: {
            sentiment: mockData.sentiment,
            confidence: mockData.confidence,
            news: mockData.news,
            recommendation: mockData.recommendation
          }
        })
      }
      // If stock is not in our known data, we skip it (no mock data generated)
    })

    // If no stocks have known data, return null
    if (analysisResults.length === 0) {
      return NextResponse.json(null, { status: 200 })
    }

    const result: AnalysisResult = {
      stocks: analysisResults,
      timestamp: new Date().toISOString(),
      note: 'Analysis only for stocks with available data'
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in analyze-stocks API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 