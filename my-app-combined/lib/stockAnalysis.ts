// Client-side stock analysis utility for static export

import { config } from './config'

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

export async function analyzeStocks(stocks: string[]): Promise<AnalysisResult | null> {
  try {
    // Use Railway backend for stock analysis
    const apiUrl = config.railway.webhookUrl;
    console.log('Calling Railway stock analysis API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stocks }),
    });

    console.log('Railway response status:', response.status);
    
    if (response.ok) {
      const analysisResult = await response.json();
      console.log('Railway analysis result:', analysisResult);
      return {
        ...analysisResult,
        timestamp: new Date().toISOString(),
      };
    } else {
      const errorText = await response.text();
      console.error('Railway API error:', response.status, errorText);
      
      // If Railway is not available, use mock data immediately
      console.log('Railway not available, using mock data');
      return getMockAnalysisResult(stocks);
    }
  } catch (error) {
    console.log('Railway not available or failed, using mock data:', error);
    return getMockAnalysisResult(stocks);
  }
}

// Separate function for mock data
function getMockAnalysisResult(stocks: string[]): AnalysisResult {
  return {
    stocks: stocks.map((stock: string, index: number) => ({
      symbol: stock,
      analysis: {
        sentiment: ['positive', 'negative', 'neutral'][index % 3] as 'positive' | 'negative' | 'neutral',
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
    })),
    timestamp: new Date().toISOString(),
    note: 'Mock data - Railway workflow not active or not configured'
  };
} 