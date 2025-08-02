"use client"

import React, { useState } from 'react'
import SharedSidebar from './shared-sidebar'
import AISentimentAnalysis from './ai-sentiment-analysis'

interface DashboardWrapperProps {
  selectedAssets: string[];
  children: React.ReactNode;
}

export default function DashboardWrapper({ selectedAssets, children }: DashboardWrapperProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
  };

  return (
    <>
      <SharedSidebar 
        selectedAssets={selectedAssets} 
        onAnalysisComplete={handleAnalysisComplete}
      />
      {children}
    </>
  );
} 