"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import AISentimentAnalysis from './ai-sentiment-analysis'
import { createBrowserClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

interface DashboardContentProps {
  selectedAssets: any[];
  session: any;
}

export default function DashboardContent({ 
  selectedAssets, 
  session
}: DashboardContentProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
  };

  // Sign Out Button Component
  const SignOutButton = () => {
    const handleSignOut = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.signOut()
      window.location.href = '/login'
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
        href="/dashboard?clear=true"
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out"
      >
        Clear Test Data
      </Link>
    )
  }

  // Tracked Assets List Component
  const TrackedAssetsList = ({ assets }: { assets: any[] }) => {
    if (assets.length === 0) {
      return <p className="text-n8n-text-secondary mt-4">You are not currently tracking any assets.</p>
    }
    return (
      <div className="mt-6 space-y-3">
        <div className="mb-4 p-3 bg-gray-800 rounded-md">
          <p className="text-sm text-gray-300">Debug Info: {assets.length} assets found</p>
          <p className="text-xs text-gray-500">Asset IDs: {assets.map(a => a.id).join(', ')}</p>
        </div>
        {assets.map(asset => (
          <div key={asset.id} className="bg-n8n-surface p-4 rounded-md shadow-lg border border-n8n-border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-n8n-accent-hover">{asset.asset_name || asset.asset_identifier}</h3>
                {asset.asset_type && <p className="text-sm text-n8n-text-secondary">Type: {asset.asset_type}</p>}
                {asset.asset_identifier && asset.asset_name && <p className="text-xs text-n8n-text-secondary">Identifier: {asset.asset_identifier}</p>}
                <p className="text-xs text-gray-500">Selected: {new Date(asset.selected_at).toLocaleString()}</p>
              </div>
              <div className="text-xs text-gray-500">
                ID: {asset.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Home Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-white text-xl font-bold">FF</div>
          <Link
            href="/"
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
            {/* Tracked Assets Section */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Portfolio</h2>
                <div className="flex space-x-2">
                  <ClearTestDataButton />
                  <Link
                    href="/select-assets"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
                  >
                    Manage Assets
                  </Link>
                </div>
              </div>
              
              {selectedAssets && selectedAssets.length > 0 ? (
                <TrackedAssetsList assets={selectedAssets} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    You are not tracking any assets yet.
                  </p>
                  <Link
                    href="/select-assets"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Select Assets to Track
                  </Link>
                </div>
              )}
            </div>

            {/* AI Sentiment Analysis Section */}
            <AISentimentAnalysis 
              selectedAssets={selectedAssets ? selectedAssets.map((asset: any) => asset.asset_identifier) : []}
              analysisData={analysisData}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 