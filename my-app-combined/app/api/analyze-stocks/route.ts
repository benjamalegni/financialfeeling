import { NextRequest, NextResponse } from 'next/server'

// Import ffback pipeline orchestrator - using dynamic import to avoid build issues
let pipelineOrchestrator: any = null

// Initialize ffback pipeline on first request
let isInitialized = false
let dataInitialized = false

async function ensureInitialized() {
  if (!isInitialized) {
    console.log('Initializing ffback pipeline...')
    
    // Dynamic import to avoid build issues
    try {
      const ffbackModule = await import('ffback/dist/services/pipeline-orchestrator.js')
      pipelineOrchestrator = ffbackModule.pipelineOrchestrator
      
      if (!pipelineOrchestrator) {
        throw new Error('Pipeline orchestrator not found in ffback module')
      }
    } catch (error) {
      console.error('Failed to import ffback pipeline:', error)
      throw new Error('Failed to initialize ffback pipeline')
    }
    
    await pipelineOrchestrator.initialize()
    
    // Add RSS feeds programmatically
    const feeds = [
      'https://feeds.finance.yahoo.com/rss/2.0/headline',
      'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      'https://www.marketwatch.com/rss/topstories',
      'https://feeds.bloomberg.com/markets/news.rss'
    ]
    
    // Access the rssFetcher and add feeds
    const rssFetcher = (pipelineOrchestrator as any).rssFetcher
    if (rssFetcher) {
      feeds.forEach(feedUrl => {
        rssFetcher.addFeed(feedUrl)
      })
      console.log(`Added ${feeds.length} RSS feeds to pipeline`)
    }
    
    isInitialized = true
    console.log('ffback pipeline initialized successfully')
  }
  
  // Execute initial data pipeline if not done yet
  if (!dataInitialized) {
    console.log('Starting initial data fetch...')
    dataInitialized = true // Set immediately to prevent multiple calls
    
    try {
      await pipelineOrchestrator.executeDataPipeline(true)
      const status = pipelineOrchestrator.getStatus()
      console.log('Initial data fetch completed. Articles available:', pipelineOrchestrator.getArticles().length)
      console.log('Pipeline status:', { hasData: status.hasData, feeds: status.feeds.length })
    } catch (error) {
      console.error('Initial pipeline execution failed:', error)
      dataInitialized = false // Reset on error so it can retry
    }
  }
}

// CORS headers helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stocks } = body

    if (!stocks || (Array.isArray(stocks) && stocks.length === 0)) {
      return NextResponse.json(
        { error: 'No assets selected to analyze' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Ensure ffback is initialized
    await ensureInitialized()

    // Normalize stocks to array and uppercase
    const stockList = Array.isArray(stocks) ? stocks : [stocks]
    const tickers = stockList.map(s => s.toUpperCase())

    console.log('Analyzing tickers with ffback:', tickers)

    // Analyze with ffback
    const analysisResult = await pipelineOrchestrator.analyzeTickers({
      tickers,
      timeRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        end: new Date()
      }
    })

    console.log('ffback analysis result:', {
      tickersCount: analysisResult.tickers.length,
      articlesAnalyzed: analysisResult.metadata.totalArticlesAnalyzed
    })

    // Transform ffback response to frontend format
    const forecast: Record<string, any> = {}
    
    for (const tickerSentiment of analysisResult.tickers) {
      const { ticker, aggregatedSentiment, relatedArticles } = tickerSentiment
      
      // Get the most relevant article for news
      const topArticle = relatedArticles[0]
      const newsText = topArticle 
        ? `${topArticle.title} - ${topArticle.source}`
        : `Analysis based on ${relatedArticles.length} articles`

      // Build recommendation reason
      const reason = aggregatedSentiment.overall === 'positive'
        ? `Positive sentiment detected across ${aggregatedSentiment.positiveCount} articles (confidence: ${Math.round(aggregatedSentiment.confidence * 100)}%)`
        : aggregatedSentiment.overall === 'negative'
        ? `Negative sentiment detected across ${aggregatedSentiment.negativeCount} articles (confidence: ${Math.round(aggregatedSentiment.confidence * 100)}%)`
        : `Neutral sentiment detected across articles (confidence: ${Math.round(aggregatedSentiment.confidence * 100)}%)`

      forecast[ticker] = {
        impact: aggregatedSentiment.overall,
        news: newsText,
        reason,
        horizon: 'short' // ffback focuses on short-term news sentiment
      }
    }

    // If no analysis found for some tickers, add neutral entries
    for (const ticker of tickers) {
      if (!forecast[ticker]) {
        forecast[ticker] = {
          impact: 'neutral',
          news: `No recent news found for ${ticker}`,
          reason: 'Insufficient data for sentiment analysis',
          horizon: 'short'
        }
      }
    }

    return NextResponse.json({ 
      forecast,
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'ffback',
        articlesAnalyzed: analysisResult.metadata.totalArticlesAnalyzed,
        processingTime: analysisResult.metadata.processingTime
      }
    }, { headers: corsHeaders() })

  } catch (error) {
    console.error('Error analyzing stocks with ffback:', error)
    return NextResponse.json(
      { 
        error: 'analyze_stocks_failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500, headers: corsHeaders() }
    )
  }
}