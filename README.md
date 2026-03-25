# Financial Feeling

Financial Feeling is a web application for tracking personal market watchlists and generating AI-assisted insights for financial assets based on RSS feeds.

The app lets users:
- create an account and sign in with Supabase Auth
- build a personal portfolio/watchlist
- run AI sentiment analysis on selected assets
- inspect fundamental metrics from a selected list of tickers
- view recent analysis history

The frontend is built with **Next.js 15**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Supabase**.  
The sentiment workflow connects to an external/backend analysis service, while fundamental data is fetched from **Alpha Vantage**.

---

## Features

### Authentication
- Email/password sign up and sign in
- Google OAuth sign in
- GitHub OAuth sign up
- Password reset flow
- PKCE-based Supabase session handling

### Portfolio Management
- Add and remove assets from a personal portfolio
- Search assets by ticker or name
- Support for multiple asset classes:
  - Stocks
  - Crypto
  - ETFs
  - Commodities
  - Forex

### AI Sentiment Analysis
- Runs analysis for selected assets
- Returns:
  - sentiment
  - news summary
  - recommendation
  - timestamp
- Saves historical analyses in Supabase

### Fundamental Analysis
For stock-like symbols, the app fetches and displays:
- P/E ratio
- Forward P/E
- PEG ratio
- Price to book
- Debt to equity
- Current ratio
- Quick ratio
- ROE / ROA
- Profit margin
- Operating margin
- Revenue growth
- Earnings growth
- Beta
- Dividend yield
- Payout ratio

It also computes a simplified **fundamental score** from those metrics.

---

## Tech Stack

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React
- Recharts / ApexCharts
- TradingView chart component
- Framer Motion
- Three.js / React Three Fiber

### Backend / Services
- Supabase Auth + Database
- External analysis backend (`NEXT_PUBLIC_SERVER_URL`)
- Alpha Vantage API
- Optional Financial Modeling Prep / Twelve Data configuration placeholders

### Deployment
- Vercel for production
- Legacy GitHub Pages export scripts are still present in `package.json`

---

## Project Structure

```bash
financialfeeling/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── dashboard/
│   │   ├── page.tsx              # Protected dashboard
│   │   └── ai-sentiment-analysis.tsx
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── components/
│   ├── dashboard-content.tsx
│   ├── header.tsx
│   ├── TradingViewChart.tsx
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── config.ts
│   ├── supabaseClient.ts
│   ├── stockAnalysis.ts
│   ├── financialData.ts
│   └── utils.ts
├── public/
├── package.json
└── README.md
