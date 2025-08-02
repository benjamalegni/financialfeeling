# N8N Integration for Stock Analysis

## Overview

This application integrates with n8n workflows for AI-powered stock analysis. The integration allows users to analyze stocks through a web interface that communicates with n8n webhooks.

## API Endpoint

### `/api/analyze-stocks`

**Method:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "stocks": ["AAPL", "TSLA", "MSFT"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "price": 150.25,
      "change": 2.50,
      "changePercent": 1.69,
      "recommendation": "BUY",
      "confidence": 85
    }
  ],
  "timestamp": "2025-08-02T03:58:58.000Z"
}
```

## N8N Webhook Configuration

### Webhook URL
```
http://localhost:5678/webhook-test/analyze-stocks
```

### Expected Request Format
The n8n workflow should expect a POST request with the following structure:
```json
{
  "stocks": ["AAPL", "TSLA", "MSFT"]
}
```

### Expected Response Format
The n8n workflow should return a JSON response with the following structure:
```json
[
  {
    "symbol": "AAPL",
    "price": 150.25,
    "change": 2.50,
    "changePercent": 1.69,
    "recommendation": "BUY",
    "confidence": 85
  },
  {
    "symbol": "TSLA",
    "price": 245.80,
    "change": -5.20,
    "changePercent": -2.07,
    "recommendation": "HOLD",
    "confidence": 72
  }
]
```

## Testing the Integration

### 1. Using curl
```bash
curl -X POST http://localhost:3000/api/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["AAPL", "TSLA", "MSFT"]}'
```

### 2. Using the Web Interface
1. Navigate to `/stock-analysis`
2. Enter stock symbols separated by commas
3. Click "Analyze Stocks"
4. View the results

## Error Handling

The API handles the following error scenarios:

- **Invalid Request**: Missing or invalid stocks array
- **N8N Connection Error**: When n8n webhook is not available
- **N8N Response Error**: When n8n returns an error

## Environment Variables

Make sure your n8n instance is running on `http://localhost:5678` or update the webhook URL in `/api/analyze-stocks/route.ts`.

## Features

- ✅ Real-time stock analysis
- ✅ AI-powered recommendations
- ✅ Confidence scores
- ✅ Price and change tracking
- ✅ User-friendly web interface
- ✅ Error handling and validation

## Next Steps

1. Set up your n8n workflow to handle the webhook
2. Configure stock data sources in n8n
3. Implement AI analysis logic
4. Test the integration with real stock data
5. Deploy to production with proper error handling 