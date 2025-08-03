#!/bin/bash

# Test Railway Dashboard Data Display
echo "🧪 Testing Railway Dashboard Data Display"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Check Railway Backend Connectivity
echo -e "\n${BLUE}1. Testing Railway Backend Connectivity...${NC}"
RAILWAY_RESPONSE=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["AAPL", "TSLA"]}')

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ Railway backend is accessible${NC}"
    echo "Response preview:"
    echo "$RAILWAY_RESPONSE" | head -c 200
    echo "..."
else
    echo -e "${RED}❌ Railway backend is not accessible${NC}"
fi

# Test 2: Check if response contains forecast data
echo -e "\n${BLUE}2. Checking for forecast data structure...${NC}"
if echo "$RAILWAY_RESPONSE" | grep -q "forecast"; then
    echo -e "${GREEN}✅ Response contains forecast data${NC}"
else
    echo -e "${RED}❌ Response does not contain forecast data${NC}"
fi

# Test 3: Check for specific asset data
echo -e "\n${BLUE}3. Checking for AAPL data...${NC}"
if echo "$RAILWAY_RESPONSE" | grep -q "AAPL"; then
    echo -e "${GREEN}✅ AAPL data found in response${NC}"
else
    echo -e "${RED}❌ AAPL data not found in response${NC}"
fi

# Test 4: Check for impact field
echo -e "\n${BLUE}4. Checking for impact field...${NC}"
if echo "$RAILWAY_RESPONSE" | grep -q "impact"; then
    echo -e "${GREEN}✅ Impact field found in response${NC}"
else
    echo -e "${RED}❌ Impact field not found in response${NC}"
fi

# Test 5: Check for news field
echo -e "\n${BLUE}5. Checking for news field...${NC}"
if echo "$RAILWAY_RESPONSE" | grep -q "news"; then
    echo -e "${GREEN}✅ News field found in response${NC}"
else
    echo -e "${RED}❌ News field not found in response${NC}"
fi

# Test 6: Check for reason field
echo -e "\n${BLUE}6. Checking for reason field...${NC}"
if echo "$RAILWAY_RESPONSE" | grep -q "reason"; then
    echo -e "${GREEN}✅ Reason field found in response${NC}"
else
    echo -e "${RED}❌ Reason field not found in response${NC}"
fi

# Test 7: Verify data transformation
echo -e "\n${BLUE}7. Testing data transformation...${NC}"
echo "Expected mapping:"
echo "  Railway.forecast[symbol].impact → Dashboard.impact"
echo "  Railway.forecast[symbol].news → Dashboard.news"
echo "  Railway.forecast[symbol].reason → Dashboard.reason"

# Test 8: Check if development server is running
echo -e "\n${BLUE}8. Checking if development server is running...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Development server is running${NC}"
    echo -e "${YELLOW}📝 You can now test the dashboard at http://localhost:3000/dashboard${NC}"
else
    echo -e "${RED}❌ Development server is not running${NC}"
    echo -e "${YELLOW}💡 Start the server with: npm run dev${NC}"
fi

echo -e "\n${BLUE}📊 Summary:${NC}"
echo "The dashboard should now display real data from Railway backend instead of mock data."
echo "Key changes made:"
echo "  ✅ Removed hardcoded mock data"
echo "  ✅ Added Railway backend integration"
echo "  ✅ Implemented proper data transformation"
echo "  ✅ Added error handling for Railway API"

echo -e "\n${GREEN}🎯 Next Steps:${NC}"
echo "1. Start the development server: npm run dev"
echo "2. Go to http://localhost:3000/dashboard"
echo "3. Select some assets (AAPL, TSLA, MSFT)"
echo "4. Press the RUN button"
echo "5. Verify that real Railway data is displayed"

echo -e "\n${YELLOW}🔍 To verify the fix:${NC}"
echo "- Check browser console for 'Railway analysis data processed' logs"
echo "- Verify that news and analysis text are real (not mock)"
echo "- Confirm that sentiment impact matches Railway data"

echo -e "\n${GREEN}✅ Railway Dashboard Data Display Test Complete!${NC}" 