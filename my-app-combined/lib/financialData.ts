// Financial data integration for fundamental analysis

export interface FinancialMetrics {
  symbol: string;
  per: number;
  forwardPer: number;
  peg: number;
  cashFlow: number;
  debt: number;
  guidance: 'positive' | 'negative' | 'neutral';
  marketCap: number;
  revenueGrowth: number;
  profitMargin: number;
}

export interface FundamentalScore {
  score: number; // 0-100
  breakdown: {
    valuation: number; // 0-25
    growth: number; // 0-25
    financials: number; // 0-25
    guidance: number; // 0-25
  };
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  reasoning: string;
}

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export async function getFinancialData(symbol: string): Promise<FinancialMetrics | null> {
  try {
    // Get company overview
    const overviewResponse = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!overviewResponse.ok) {
      console.error(`Error fetching overview for ${symbol}:`, overviewResponse.status);
      return null;
    }

    const overviewData = await overviewResponse.json();
    
    // Get income statement for recent data
    const incomeResponse = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!incomeResponse.ok) {
      console.error(`Error fetching income statement for ${symbol}:`, incomeResponse.status);
      return null;
    }

    const incomeData = await incomeResponse.json();

    // Parse and calculate metrics
    const per = parseFloat(overviewData['PERatio']) || 0;
    const forwardPer = parseFloat(overviewData['ForwardPE']) || per;
    const peg = parseFloat(overviewData['PEGRatio']) || 0;
    const cashFlow = parseFloat(overviewData['OperatingCashflowTTM']) || 0;
    const debt = parseFloat(overviewData['TotalDebt']) || 0;
    const marketCap = parseFloat(overviewData['MarketCapitalization']) || 0;
    
    // Calculate revenue growth from income statement
    const annualReports = incomeData.annualReports || [];
    let revenueGrowth = 0;
    if (annualReports.length >= 2) {
      const currentRevenue = parseFloat(annualReports[0].totalRevenue) || 0;
      const previousRevenue = parseFloat(annualReports[1].totalRevenue) || 0;
      revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    }

    // Calculate profit margin
    const netIncome = parseFloat(annualReports[0]?.netIncome) || 0;
    const totalRevenue = parseFloat(annualReports[0]?.totalRevenue) || 0;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    // Determine guidance based on recent performance
    let guidance: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (revenueGrowth > 10 && profitMargin > 15) {
      guidance = 'positive';
    } else if (revenueGrowth < -5 || profitMargin < 5) {
      guidance = 'negative';
    }

    return {
      symbol,
      per,
      forwardPer,
      peg,
      cashFlow,
      debt,
      guidance,
      marketCap,
      revenueGrowth,
      profitMargin
    };

  } catch (error) {
    console.error(`Error fetching financial data for ${symbol}:`, error);
    return null;
  }
}

export function calculateFundamentalScore(metrics: FinancialMetrics): FundamentalScore {
  let valuationScore = 0;
  let growthScore = 0;
  let financialsScore = 0;
  let guidanceScore = 0;

  // Valuation Score (0-25)
  // P/E Ratio analysis
  if (metrics.per > 0 && metrics.per < 15) {
    valuationScore += 10; // Good P/E
  } else if (metrics.per >= 15 && metrics.per < 25) {
    valuationScore += 5; // Moderate P/E
  } else if (metrics.per >= 25) {
    valuationScore += 0; // High P/E
  }

  // Forward P/E analysis
  if (metrics.forwardPer > 0 && metrics.forwardPer < metrics.per) {
    valuationScore += 10; // Improving forward P/E
  } else if (metrics.forwardPer > 0 && metrics.forwardPer <= metrics.per * 1.1) {
    valuationScore += 5; // Stable forward P/E
  } else {
    valuationScore += 0; // Deteriorating forward P/E
  }

  // PEG Ratio analysis
  if (metrics.peg > 0 && metrics.peg < 1) {
    valuationScore += 5; // Good PEG
  } else if (metrics.peg >= 1 && metrics.peg < 2) {
    valuationScore += 2; // Moderate PEG
  } else {
    valuationScore += 0; // Poor PEG
  }

  // Growth Score (0-25)
  if (metrics.revenueGrowth > 20) {
    growthScore += 15; // High growth
  } else if (metrics.revenueGrowth > 10) {
    growthScore += 10; // Good growth
  } else if (metrics.revenueGrowth > 0) {
    growthScore += 5; // Positive growth
  } else {
    growthScore += 0; // Negative growth
  }

  if (metrics.profitMargin > 20) {
    growthScore += 10; // High profitability
  } else if (metrics.profitMargin > 10) {
    growthScore += 5; // Good profitability
  } else if (metrics.profitMargin > 0) {
    growthScore += 2; // Positive profitability
  } else {
    growthScore += 0; // Negative profitability
  }

  // Financials Score (0-25)
  // Cash flow analysis
  if (metrics.cashFlow > 0) {
    financialsScore += 10; // Positive cash flow
  } else {
    financialsScore += 0; // Negative cash flow
  }

  // Debt analysis
  const debtToMarketCap = metrics.marketCap > 0 ? (metrics.debt / metrics.marketCap) * 100 : 0;
  if (debtToMarketCap < 20) {
    financialsScore += 10; // Low debt
  } else if (debtToMarketCap < 50) {
    financialsScore += 5; // Moderate debt
  } else {
    financialsScore += 0; // High debt
  }

  // Profit margin analysis
  if (metrics.profitMargin > 15) {
    financialsScore += 5; // High profit margin
  } else if (metrics.profitMargin > 5) {
    financialsScore += 2; // Moderate profit margin
  } else {
    financialsScore += 0; // Low profit margin
  }

  // Guidance Score (0-25)
  switch (metrics.guidance) {
    case 'positive':
      guidanceScore = 25;
      break;
    case 'neutral':
      guidanceScore = 12;
      break;
    case 'negative':
      guidanceScore = 0;
      break;
  }

  const totalScore = Math.round(valuationScore + growthScore + financialsScore + guidanceScore);
  
  // Determine recommendation
  let recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  let reasoning = '';

  if (totalScore >= 80) {
    recommendation = 'Strong Buy';
    reasoning = 'Excellent fundamentals with strong valuation, growth, and financial health';
  } else if (totalScore >= 60) {
    recommendation = 'Buy';
    reasoning = 'Good fundamentals with positive outlook';
  } else if (totalScore >= 40) {
    recommendation = 'Hold';
    reasoning = 'Mixed fundamentals, monitor for improvement';
  } else if (totalScore >= 20) {
    recommendation = 'Sell';
    reasoning = 'Poor fundamentals with concerning metrics';
  } else {
    recommendation = 'Strong Sell';
    reasoning = 'Very poor fundamentals, high risk';
  }

  return {
    score: totalScore,
    breakdown: {
      valuation: Math.round(valuationScore),
      growth: Math.round(growthScore),
      financials: Math.round(financialsScore),
      guidance: Math.round(guidanceScore)
    },
    recommendation,
    reasoning
  };
}

export function combineSentimentAndFundamentals(
  sentimentImpact: 'positive' | 'negative' | 'neutral',
  fundamentalScore: number
): { buyScore: number; recommendation: string } {
  let buyScore = fundamentalScore;
  let recommendation = '';

  // Adjust buy score based on sentiment vs fundamentals
  if (sentimentImpact === 'negative' && fundamentalScore >= 70) {
    // Good fundamentals but bad news - potential buying opportunity
    buyScore = Math.min(100, fundamentalScore + 15);
    recommendation = 'Strong fundamentals despite negative news - potential buying opportunity';
  } else if (sentimentImpact === 'positive' && fundamentalScore <= 30) {
    // Bad fundamentals but good news - be cautious
    buyScore = Math.max(0, fundamentalScore - 10);
    recommendation = 'Positive news but weak fundamentals - exercise caution';
  } else if (sentimentImpact === 'positive' && fundamentalScore >= 70) {
    // Good fundamentals and good news
    buyScore = Math.min(100, fundamentalScore + 5);
    recommendation = 'Strong fundamentals with positive news - excellent opportunity';
  } else if (sentimentImpact === 'negative' && fundamentalScore <= 30) {
    // Bad fundamentals and bad news
    buyScore = Math.max(0, fundamentalScore - 5);
    recommendation = 'Weak fundamentals with negative news - avoid';
  } else {
    // Neutral sentiment or mixed signals
    buyScore = fundamentalScore;
    recommendation = 'Mixed signals - consider fundamentals and news together';
  }

  return { buyScore: Math.round(buyScore), recommendation };
} 