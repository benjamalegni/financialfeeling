#!/bin/bash

# Test Financial Data Integration with Alpha Vantage
echo "🧪 Testing Financial Data Integration with Alpha Vantage"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test Alpha Vantage API directly
echo -e "${BLUE}📊 Testing Alpha Vantage API...${NC}"

# Test AAPL overview
echo -e "${YELLOW}Testing AAPL overview...${NC}"
curl -s "https://www.alphavantage.co/query?function=OVERVIEW&symbol=AAPL&apikey=UVJUR5P1SEQ00P2P" | jq '.Symbol, .PERatio, .ForwardPE, .PEGRatio, .OperatingCashflowTTM, .TotalDebt' 2>/dev/null || echo "jq not available, showing raw response"

echo ""

# Test TSLA overview
echo -e "${YELLOW}Testing TSLA overview...${NC}"
curl -s "https://www.alphavantage.co/query?function=OVERVIEW&symbol=TSLA&apikey=UVJUR5P1SEQ00P2P" | jq '.Symbol, .PERatio, .ForwardPE, .PEGRatio, .OperatingCashflowTTM, .TotalDebt' 2>/dev/null || echo "jq not available, showing raw response"

echo ""

# Test MSFT overview
echo -e "${YELLOW}Testing MSFT overview...${NC}"
curl -s "https://www.alphavantage.co/query?function=OVERVIEW&symbol=MSFT&apikey=UVJUR5P1SEQ00P2P" | jq '.Symbol, .PERatio, .ForwardPE, .PEGRatio, .OperatingCashflowTTM, .TotalDebt' 2>/dev/null || echo "jq not available, showing raw response"

echo ""
echo -e "${BLUE}📊 Testing Income Statement...${NC}"

# Test AAPL income statement
echo -e "${YELLOW}Testing AAPL income statement...${NC}"
curl -s "https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=AAPL&apikey=UVJUR5P1SEQ00P2P" | jq '.annualReports[0] | {totalRevenue, netIncome}' 2>/dev/null || echo "jq not available, showing raw response"

echo ""
echo -e "${GREEN}✅ Financial Data Integration Test Complete${NC}"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Go to the dashboard"
echo "3. Select assets (AAPL, TSLA, MSFT)"
echo "4. Press the 'RUN' button"
echo "5. Verify that 'Fundamental Score' appears"
echo "6. Verify that 'Buy Opportunity' considers both sentiment and fundamentals"
echo ""
echo -e "${YELLOW}📝 Note: Alpha Vantage free tier has 25 requests per day limit${NC}" 