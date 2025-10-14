export const assetAnalysisTexts = [
  "What markets can I help you explore?",
  "Ready to discover your next profitable trade?",
  "Let's analyze the markets together",
  "Find hidden opportunities in any asset",
  "Transform your trading with AI insights",
  "Unlock the secrets of market movements",
  "Navigate the markets with confidence",
  "Discover patterns others can't see",
  "Turn market data into profits",
  "Your AI-powered trading companion",
  "Analyze any asset in seconds",
  "Find the perfect entry and exit points",
  "Master the art of market timing",
  "Get ahead of market trends",
  "Make data-driven trading decisions",
  "Explore stocks, crypto, and more",
  "Identify undervalued opportunities",
  "Track your portfolio performance",
  "Get real-time market insights",
  "Transform your trading strategy"
]

export const getRandomText = () => {
  const randomIndex = Math.floor(Math.random() * assetAnalysisTexts.length)
  return assetAnalysisTexts[randomIndex]
} 