<img width="1905" height="941" alt="image" src="https://github.com/user-attachments/assets/10ac69be-b140-43e5-a5ad-5d0c73e3d28f" />
[Financial Feeling](https://benjamalegni.github.io/financialfeeling/)

# Financial Feeling - AI-Powered Investment Analysis Platform

> **Transform your investment decisions with AI-driven sentiment analysis and fundamental data insights**

Financial Feeling is a comprehensive investment analysis platform that combines real-time news sentiment analysis with fundamental financial data to provide intelligent investment recommendations. Our platform helps investors make informed decisions by analyzing both market sentiment and company fundamentals.

## 🌟 Key Features

### 🤖 **AI Sentiment Analysis**
- **Real-time News Analysis**: Powered by Railway backend for instant market sentiment evaluation
- **Sentiment Impact**: Positive, negative, or neutral sentiment classification
- **News Context**: Detailed analysis of market-moving news and events
- **Confidence Scoring**: AI-powered confidence levels for sentiment predictions

### 📊 **Fundamental Analysis**
- **Alpha Vantage Integration**: Real-time financial data from leading market data provider
- **Key Metrics**: P/E Ratio, Forward P/E, PEG Ratio, Cash Flow, Debt, Market Cap
- **Growth Analysis**: Revenue growth, profit margins, and company guidance
- **Fundamental Score**: 0-100 scoring system based on comprehensive financial metrics

### 💡 **Intelligent Recommendations**
- **Buy Opportunity Score**: Combines sentiment and fundamentals for optimal recommendations
- **Smart Logic**: When good fundamentals meet negative news = potential buying opportunity
- **Risk Assessment**: Clear Strong Buy, Buy, Hold, Sell, Strong Sell classifications
- **Detailed Reasoning**: Explanations for each recommendation

### 🎯 **Portfolio Management**
- **Asset Selection**: Easy-to-use interface for selecting stocks and assets
- **Real-time Sync**: Database synchronization for portfolio tracking
- **Search & Filter**: Advanced filtering by category and search functionality
- **Add/Remove Assets**: Seamless portfolio management with instant updates

### 📱 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Professional dark interface for extended viewing
- **Gradient Backgrounds**: Beautiful visual design with gradient effects
- **Interactive Elements**: Hover effects, animations, and smooth transitions

## 🛠 Technology Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### **Backend & APIs**
- **Railway**: News analysis and sentiment processing
- **Alpha Vantage**: Real-time financial data
- **Supabase**: Authentication and database management
- **Stripe**: Payment processing integration

### **Deployment**
- **Static Export**: Optimized for GitHub Pages deployment
- **Environment Variables**: Secure configuration management
- **Build Optimization**: Fast loading and minimal bundle size

## 📸 Screenshots

### Dashboard Overview
![Dashboard](screenshots/dashboard-overview.png)
*Main dashboard showing portfolio management and AI sentiment analysis*

### AI Sentiment Analysis
![Sentiment Analysis](screenshots/ai-sentiment-analysis.png)
*AI-powered sentiment analysis with fundamental scores and buy recommendations*

### Financial Data Modal
![Financial Modal](screenshots/financial-data-modal.png)
*Detailed financial metrics modal showing P/E ratios, cash flow, and growth data*

### Portfolio Management
![Portfolio](screenshots/portfolio-management.png)
*Asset selection interface with search and category filtering*

### Authentication
![Login](screenshots/login-screen.png)
*Secure authentication with Supabase integration*

> **📸 Screenshots Coming Soon**: High-quality screenshots of Financial Feeling in action will be added to showcase the platform's features and user interface. Follow the [Screenshots Guide](SCREENSHOTS_GUIDE.md) to capture and contribute screenshots.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Alpha Vantage API key
- Supabase project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/financial-feeling.git
cd financial-feeling
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Alpha Vantage API
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Railway Backend
NEXT_PUBLIC_RAILWAY_WEBHOOK_URL=https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use Financial Feeling

### 1. **Authentication**
- Sign up or log in to access your personalized dashboard
- Your portfolio and analysis history are securely stored

### 2. **Asset Selection**
- Browse available stocks and assets
- Use search and category filters to find specific assets
- Add assets to your portfolio with a single click

### 3. **AI Analysis**
- Select assets from your portfolio
- Click "RUN" to start AI sentiment analysis
- View real-time sentiment impact and news analysis

### 4. **Fundamental Analysis**
- Click the 📊 icon next to any stock symbol
- View detailed financial metrics and ratios
- Understand company fundamentals and growth prospects

### 5. **Investment Decisions**
- Review AI recommendations (Strong Buy, Buy, Hold, Sell, Strong Sell)
- Consider both sentiment and fundamental factors
- Make informed investment decisions

## 📊 Key Metrics Explained

### **Sentiment Analysis**
- **Positive**: Favorable market sentiment, potential upside
- **Negative**: Unfavorable sentiment, exercise caution
- **Neutral**: Mixed signals, consider fundamentals

### **Fundamental Score (0-100)**
- **80-100**: Excellent fundamentals, strong buy opportunity
- **60-79**: Good fundamentals, consider buying
- **40-59**: Mixed fundamentals, monitor closely
- **20-39**: Poor fundamentals, consider selling
- **0-19**: Very poor fundamentals, strong sell

### **Buy Opportunity Logic**
- **Strong Buy**: High fundamental score with positive sentiment
- **Buy**: Good fundamentals, potential opportunity
- **Hold**: Mixed signals, wait for better conditions
- **Sell**: Poor fundamentals, consider exiting
- **Strong Sell**: Very poor fundamentals, exit immediately

## 🔧 Advanced Features

### **Real-time Data Integration**
- **Alpha Vantage**: Live financial data updates
- **Railway Backend**: Instant news sentiment analysis
- **Supabase**: Real-time portfolio synchronization

### **Smart Combination Logic**
```typescript
// Good fundamentals + Bad news = Buying opportunity
if (fundamentalScore >= 70 && sentiment === 'negative') {
  buyScore += 15;
  recommendation = 'Strong fundamentals despite negative news';
}
```

### **Responsive Design**
- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Easy navigation on mobile devices
- **Fast loading**: Optimized for performance

## 🎨 Design Philosophy

Financial Feeling emphasizes **user experience** and **data clarity**:

- **Dark Theme**: Reduces eye strain during extended analysis sessions
- **Color Coding**: Semantic colors for quick data interpretation
- **Gradient Effects**: Modern, professional aesthetic
- **Interactive Elements**: Engaging user interface with smooth animations

## 🔒 Security & Privacy

- **Supabase Auth**: Secure user authentication
- **Environment Variables**: Protected API keys
- **HTTPS**: Secure data transmission
- **No Data Storage**: Financial data is not permanently stored

## 📈 Performance Optimization

- **Static Export**: Fast loading times
- **Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Compressed screenshots and assets
- **Caching**: Efficient data caching strategies

## 🤝 Contributing

We welcome contributions to Financial Feeling! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Alpha Vantage**: For providing comprehensive financial data
- **Railway**: For hosting our sentiment analysis backend
- **Supabase**: For authentication and database services
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

If you have questions or need support:

- **GitHub Issues**: [Create an issue](https://github.com/your-username/financial-feeling/issues)
- **Documentation**: Check our [Wiki](https://github.com/your-username/financial-feeling/wiki)
- **Email**: support@financialfeeling.com

## 🚀 Roadmap

### **Phase 1** ✅
- [x] AI Sentiment Analysis
- [x] Fundamental Data Integration
- [x] Portfolio Management
- [x] Responsive UI

### **Phase 2** 🔄
- [ ] Advanced Charting
- [ ] Portfolio Performance Tracking
- [ ] Alert System
- [ ] Mobile App

### **Phase 3** 📋
- [ ] Social Features
- [ ] Advanced Analytics
- [ ] API for Developers
- [ ] Enterprise Features

---

**Financial Feeling** - Where AI meets investment intelligence. Make smarter investment decisions with the power of artificial intelligence and comprehensive financial analysis.

*Built with ❤️ for investors who want to feel confident about their financial decisions.*
# Deployment trigger - Sun Aug  3 03:29:22 PM -03 2025
