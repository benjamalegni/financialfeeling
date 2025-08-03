"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, X, Search, Star, Filter } from 'lucide-react'
import AISentimentAnalysis from './ai-sentiment-analysis'
import { createBrowserClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { getRoute } from '@/lib/utils'

interface DashboardContentProps {
  selectedAssets: any[];
  session: any;
}

// Financial assets data (same as in main page)
const financialAssets = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Technology', category: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Automotive', category: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Technology', category: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Technology', category: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'E-commerce', category: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Technology', category: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Technology', category: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Entertainment', category: 'Technology' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Banking', category: 'Finance' },
  { symbol: 'BAC', name: 'Bank of America Corp.', type: 'Banking', category: 'Finance' },
  { symbol: 'WFC', name: 'Wells Fargo & Co.', type: 'Banking', category: 'Finance' },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.', type: 'Investment Banking', category: 'Finance' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Healthcare', category: 'Healthcare' },
  { symbol: 'PFE', name: 'Pfizer Inc.', type: 'Pharmaceuticals', category: 'Healthcare' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', type: 'Healthcare', category: 'Healthcare' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', type: 'Pharmaceuticals', category: 'Healthcare' },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', type: 'Oil & Gas', category: 'Energy' },
  { symbol: 'CVX', name: 'Chevron Corporation', type: 'Oil & Gas', category: 'Energy' },
  { symbol: 'COP', name: 'ConocoPhillips', type: 'Oil & Gas', category: 'Energy' },
  { symbol: 'EOG', name: 'EOG Resources Inc.', type: 'Oil & Gas', category: 'Energy' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'Cryptocurrency', category: 'Cryptocurrency' },
  { symbol: 'ETH', name: 'Ethereum', type: 'Cryptocurrency', category: 'Cryptocurrency' },
  { symbol: 'ADA', name: 'Cardano', type: 'Cryptocurrency', category: 'Cryptocurrency' },
  { symbol: 'DOT', name: 'Polkadot', type: 'Cryptocurrency', category: 'Cryptocurrency' },
  { symbol: 'LINK', name: 'Chainlink', type: 'Cryptocurrency', category: 'Cryptocurrency' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF', category: 'Index' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', category: 'Index' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', category: 'Index' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', category: 'International' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'ETF', category: 'International' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'Commodity ETF', category: 'Commodity' },
  { symbol: 'SLV', name: 'iShares Silver Trust', type: 'Commodity ETF', category: 'Commodity' },
  { symbol: 'USO', name: 'United States Oil Fund LP', type: 'Commodity ETF', category: 'Commodity' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'Forex', category: 'Currency' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', type: 'Forex', category: 'Currency' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: 'Forex', category: 'Currency' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', type: 'Forex', category: 'Currency' }
]

export default function DashboardContent({ 
  selectedAssets, 
  session
}: DashboardContentProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentAssets, setCurrentAssets] = useState<any[]>(selectedAssets || []);

  // Update current assets when selectedAssets prop changes
  useEffect(() => {
    setCurrentAssets(selectedAssets || []);
  }, [selectedAssets]);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
  };

  // Add asset to portfolio
  const handleAddAsset = async (asset: any) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      const { error } = await supabase
        .from('user_selected_assets')
        .upsert({
          user_id: session.user.id,
          asset_identifier: asset.symbol,
          asset_type: asset.type || null,
          asset_name: asset.name || null,
          selected_at: new Date().toISOString()
        }, { onConflict: 'user_id,asset_identifier' });

      if (error) {
        console.error('Error adding asset to database:', error);
        alert('Error adding asset to portfolio. Please try again.');
        return;
      }

      console.log('Asset added to database:', asset.symbol);
      
      // Update local state
      const newAssets = [...currentAssets, {
        id: Date.now().toString(), // Temporary ID
        asset_identifier: asset.symbol,
        asset_type: asset.type,
        asset_name: asset.name,
        selected_at: new Date().toISOString()
      }];
      setCurrentAssets(newAssets);
      
    } catch (error) {
      console.error('Error adding asset to database:', error);
      alert('Error adding asset to portfolio. Please try again.');
    }
  };

  // Remove asset from portfolio
  const handleRemoveAsset = async (assetId: string, assetSymbol: string) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      const { error } = await supabase
        .from('user_selected_assets')
        .delete()
        .eq('user_id', session.user.id)
        .eq('asset_identifier', assetSymbol);

      if (error) {
        console.error('Error removing asset from database:', error);
        alert('Error removing asset from portfolio. Please try again.');
        return;
      }

      console.log('Asset removed from database:', assetSymbol);
      
      // Update local state
      const newAssets = currentAssets.filter(asset => asset.id !== assetId);
      setCurrentAssets(newAssets);
      
    } catch (error) {
      console.error('Error removing asset from database:', error);
      alert('Error removing asset from portfolio. Please try again.');
    }
  };

  // Filter assets based on search term and category
  const filteredAssets = financialAssets.filter(asset => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      asset.symbol.toLowerCase().includes(searchLower) ||
      asset.name.toLowerCase().includes(searchLower) ||
      asset.category.toLowerCase().includes(searchLower)
    );
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(financialAssets.map(asset => asset.category)))];

  // Check if asset is already in portfolio
  const isAssetInPortfolio = (symbol: string) => {
    return currentAssets.some(asset => asset.asset_identifier === symbol);
  };

  // Sign Out Button Component
  const SignOutButton = () => {
    const handleSignOut = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.signOut()
      window.location.href = getRoute('/login')
    }

    return (
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-n8n-button hover:bg-n8n-button-hover text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out"
      >
        Sign Out
      </button>
    )
  }

  // Clear Test Data Button Component
  const ClearTestDataButton = () => {
    return (
      <Link
        href={getRoute('/dashboard?clear=true')}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out"
      >
        Clear Test Data
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Home Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-white text-xl font-bold">FF</div>
          <Link
            href={getRoute('/')}
            className="text-white transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Auth */}
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400 hidden sm:block">
                  {session.user.email}
                </span>
                <SignOutButton />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-400 mb-8">Manage your financial assets and insights</p>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-8">
            {/* Portfolio Management Section */}
            <div className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 rounded-lg border border-gray-700 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Portfolio</h2>
                <div className="flex space-x-2">
                  <ClearTestDataButton />
                  <button
                    onClick={() => setShowAssetSelector(!showAssetSelector)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-md transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Assets</span>
                  </button>
                </div>
              </div>

              {/* Asset Selector Modal */}
              {showAssetSelector && (
                <div className="mb-6 p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg border border-gray-600 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Add Assets to Portfolio</h3>
                    <button
                      onClick={() => setShowAssetSelector(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="mb-4">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assets Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 relative ${
                          isAssetInPortfolio(asset.symbol)
                            ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-500 text-white shadow-lg'
                            : 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-gray-600 hover:from-gray-600/50 hover:to-gray-700/50 text-gray-300 backdrop-blur-sm'
                        }`}
                        onClick={() => !isAssetInPortfolio(asset.symbol) && handleAddAsset(asset)}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-lg mb-1">{asset.symbol}</div>
                          <div className="text-xs opacity-75 mb-1">{asset.name}</div>
                          <div className="text-xs opacity-75">{asset.type}</div>
                        </div>
                        
                        {/* Checkmark for assets already in portfolio */}
                        {isAssetInPortfolio(asset.symbol) && (
                          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Portfolio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Current Portfolio ({currentAssets.length} assets)</h3>
                
                {currentAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">
                      You are not tracking any assets yet.
                    </p>
                    <button
                      onClick={() => setShowAssetSelector(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
                    >
                      Add Assets to Portfolio
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentAssets.map((asset) => (
                      <div key={asset.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-gray-600 backdrop-blur-sm hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white">{asset.asset_name || asset.asset_identifier}</h4>
                            {asset.asset_type && <p className="text-sm text-gray-400">Type: {asset.asset_type}</p>}
                            {asset.asset_identifier && asset.asset_name && (
                              <p className="text-xs text-gray-500">Symbol: {asset.asset_identifier}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Added: {new Date(asset.selected_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveAsset(asset.id, asset.asset_identifier)}
                            className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all duration-300"
                            title="Remove from portfolio"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Sentiment Analysis Section */}
            <AISentimentAnalysis 
              selectedAssets={currentAssets ? currentAssets.map((asset: any) => asset.asset_identifier) : []}
              analysisData={analysisData}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 