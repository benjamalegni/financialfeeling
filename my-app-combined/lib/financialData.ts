import { config } from './config'

export interface FinancialMetrics {
  symbol: string
  peRatio: number
  forwardPE: number
  pegRatio: number
  priceToBook: number
  debtToEquity: number
  currentRatio: number
  quickRatio: number
  returnOnEquity: number
  returnOnAssets: number
  profitMargin: number
  operatingMargin: number
  revenueGrowth: number
  earningsGrowth: number
  marketCap: string
  beta: number
  dividendYield: number
  payoutRatio: number
}

export async function getFinancialData(symbol: string): Promise<FinancialMetrics | null> {
  try {
    const apiKey = config.alphaVantage.apiKey
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    )

    if (!response.ok) {
      console.error('Alpha Vantage API error:', response.status)
      return null
    }

    const data = await response.json()

    // Check if we got valid data
    if (data['Error Message'] || data['Note']) {
      console.error('Alpha Vantage API error:', data['Error Message'] || data['Note'])
      return null
    }

    // Transform Alpha Vantage data to our format
    const metrics: FinancialMetrics = {
      symbol: data.Symbol || symbol,
      peRatio: parseFloat(data.PERatio) || 0,
      forwardPE: parseFloat(data.ForwardPE) || 0,
      pegRatio: parseFloat(data.PEGRatio) || 0,
      priceToBook: parseFloat(data.PriceToBookRatio) || 0,
      debtToEquity: parseFloat(data.DebtToEquityRatio) || 0,
      currentRatio: parseFloat(data.CurrentRatio) || 0,
      quickRatio: parseFloat(data.QuickRatio) || 0,
      returnOnEquity: parseFloat(data.ReturnOnEquityTTM) || 0,
      returnOnAssets: parseFloat(data.ReturnOnAssetsTTM) || 0,
      profitMargin: parseFloat(data.ProfitMarginTTM) || 0,
      operatingMargin: parseFloat(data.OperatingMarginTTM) || 0,
      revenueGrowth: parseFloat(data.RevenueGrowthTTM) || 0,
      earningsGrowth: parseFloat(data.EarningsGrowthTTM) || 0,
      marketCap: data.MarketCapitalization || '0',
      beta: parseFloat(data.Beta) || 0,
      dividendYield: parseFloat(data.DividendYield) || 0,
      payoutRatio: parseFloat(data.PayoutRatio) || 0
    }

    return metrics
  } catch (error) {
    console.error('Error fetching financial data:', error)
    return null
  }
}

export function calculateFundamentalScore(metrics: FinancialMetrics): number {
  let score = 50 // Base score

  // P/E Ratio analysis (lower is better, but not too low)
  if (metrics.peRatio > 0 && metrics.peRatio < 25) {
    score += 10
  } else if (metrics.peRatio >= 25) {
    score -= 5
  }

  // PEG Ratio analysis (lower is better)
  if (metrics.pegRatio > 0 && metrics.pegRatio < 1) {
    score += 15
  } else if (metrics.pegRatio >= 1 && metrics.pegRatio < 2) {
    score += 5
  } else if (metrics.pegRatio >= 2) {
    score -= 10
  }

  // Debt to Equity analysis (lower is better)
  if (metrics.debtToEquity > 0 && metrics.debtToEquity < 0.5) {
    score += 10
  } else if (metrics.debtToEquity >= 0.5 && metrics.debtToEquity < 1) {
    score += 5
  } else if (metrics.debtToEquity >= 1) {
    score -= 10
  }

  // Return on Equity analysis (higher is better)
  if (metrics.returnOnEquity > 15) {
    score += 10
  } else if (metrics.returnOnEquity > 10) {
    score += 5
  } else if (metrics.returnOnEquity < 5) {
    score -= 5
  }

  // Profit Margin analysis (higher is better)
  if (metrics.profitMargin > 20) {
    score += 10
  } else if (metrics.profitMargin > 10) {
    score += 5
  } else if (metrics.profitMargin < 5) {
    score -= 5
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score))
} 