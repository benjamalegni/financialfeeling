// Client-side stock analysis utility

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

// Interface for Railway backend response
export interface RailwayAnalysisResponse {
  forecast: {
    [symbol: string]: {
      impact: 'positive' | 'negative' | 'neutral';
      news: string;
      reason: string;
      horizon: string;
    };
  };
}

export async function analyzeStocks(stocks: string[]): Promise<AnalysisResult | null> {
  try {
    // Use Railway backend for stock analysis
    const apiUrl = 'https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks';
    console.log('Calling Railway stock analysis API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stocks }),
    });

    console.log('API response status:', response.status);
    
    if (response.ok) {
      const railwayData: RailwayAnalysisResponse[] = await response.json();
      console.log('Railway analysis result:', railwayData);
      
      // Transform Railway response to our format
      if (railwayData && railwayData.length > 0 && railwayData[0].forecast) {
        const forecast = railwayData[0].forecast;
        const analysisResults: StockAnalysis[] = [];
        
        for (const symbol of stocks) {
          const stockData = forecast[symbol];
          if (stockData) {
            // Use exact data from Railway without modification
            analysisResults.push({
              symbol: symbol.toUpperCase(),
              analysis: {
                sentiment: stockData.impact, // Use exact impact as sentiment
                confidence: 75, // Default confidence since Railway doesn't provide it
                news: stockData.news, // Use exact news from Railway
                recommendation: `Based on ${stockData.impact} impact: ${stockData.reason}` // Use reason as recommendation
              }
            });
          }
        }
        
        const result: AnalysisResult = {
          stocks: analysisResults,
          timestamp: new Date().toISOString(),
          note: 'Analysis from Railway backend - News-based forecasting'
        };
        
        return result;
      } else {
        console.log('No forecast data available from Railway');
        return null;
      }
    } else {
      const errorText = await response.text();
      console.error('Railway API error:', response.status, errorText);
      
      // If Railway API fails, return null instead of mock data
      console.log('Railway API not available, no data to show');
      return null;
    }
  } catch (error) {
    console.log('Railway API call failed, no data to show:', error);
    return null;
  }
} 