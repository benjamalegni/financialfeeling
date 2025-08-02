import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stocks } = body

    if (!stocks || !Array.isArray(stocks)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected stocks array.' },
        { status: 400 }
      )
    }

    // Call n8n webhook
    try {
      const n8nResponse = await fetch('http://localhost:5678/webhook-test/analyze-stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stocks }),
      })

      if (!n8nResponse.ok) {
        throw new Error(`n8n webhook failed: ${n8nResponse.statusText}`)
      }

      const analysisResult = await n8nResponse.json()
      return NextResponse.json({
        success: true,
        data: analysisResult,
        timestamp: new Date().toISOString(),
      })
    } catch (n8nError) {
      console.log('n8n not available, using mock data:', n8nError instanceof Error ? n8nError.message : 'Unknown error')
      
      // Mock data when n8n is not available
      const mockAnalysisResult = {
        stocks: stocks.map((stock: string, index: number) => ({
          symbol: stock,
          analysis: {
            sentiment: ['positive', 'negative', 'neutral'][index % 3],
            confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
            news: [
              'Strong earnings report exceeds expectations',
              'Regulatory concerns impact market sentiment',
              'Stable performance with moderate growth outlook'
            ][index % 3],
            recommendation: [
              'Buy - Strong fundamentals and growth potential',
              'Hold - Monitor regulatory developments',
              'Hold - Stable performance expected'
            ][index % 3]
          }
        }))
      }

      return NextResponse.json({
        success: true,
        data: mockAnalysisResult,
        timestamp: new Date().toISOString(),
        note: 'Mock data - n8n not available'
      })
    }

  } catch (error) {
    console.error('Error analyzing stocks:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze stocks',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stock analysis endpoint',
    usage: 'POST with {"stocks": ["AAPL", "TSLA", "MSFT"]}',
    example: {
      method: 'POST',
      body: {
        stocks: ['AAPL', 'TSLA', 'MSFT']
      }
    }
  })
} 