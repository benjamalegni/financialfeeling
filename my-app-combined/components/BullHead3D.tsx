'use client'

import React, { useState, useEffect, Suspense } from "react";
import dynamic from 'next/dynamic';

// Dynamic imports for Three.js components to avoid SSR issues
const ThreeScene = dynamic(() => import('./ui/ThreeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[80vh] bg-gradient-to-b from-neutral-900 to-black rounded-2xl relative flex items-center justify-center">
      <div className="text-white text-lg">Loading interactive 3D model...</div>
    </div>
  )
});

interface Candle {
  id: number;
  left: string;
  baseHeight: number;
  animationDelay: string;
  animationDuration: string;
  isGreen: boolean;
}

export default function BullHead3D() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [showThreeScene, setShowThreeScene] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Generate animated candles as background
    const count = 34;
    const generatedCandles: Candle[] = Array.from({ length: count }, (_, i) => {
      const isGreen = Math.random() > 0.5;
      const col = (i / count) * 100;
      return {
        id: i,
        left: `${Math.max(0, Math.min(98, col + (Math.random() * 6 - 3)))}%`,
        baseHeight: 40 + Math.floor(Math.random() * 110),
        animationDelay: `${(Math.random() * 2).toFixed(2)}s`,
        animationDuration: `${(4 + Math.random() * 3.5).toFixed(2)}s`,
        isGreen,
      }
    })
    setCandles(generatedCandles);

    // Show Three.js scene after a short delay
    const timer = setTimeout(() => {
      setShowThreeScene(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[80vh] bg-gradient-to-b from-neutral-900 to-black rounded-2xl relative overflow-hidden">
      {/* Background animated candlesticks (behind the bull) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {candles.map((candle) => (
          <div
            key={candle.id}
            className="absolute bottom-0 flex items-end"
            style={{ left: candle.left }}
          >
            <div
              className="relative flex items-center"
              style={{
                height: `${candle.baseHeight}px`,
                transformOrigin: 'bottom center',
                animation: `candleFloat ${candle.animationDuration} ease-in-out ${candle.animationDelay} infinite`,
                filter: 'blur(0.2px)',
              }}
            >
              {/* Wick top */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-white/40"
                style={{ width: '2px', bottom: '100%', height: `${6 + Math.floor(Math.random() * 12)}px` }}
              />
              {/* Body */}
              <div
                className={`${candle.isGreen ? 'bg-emerald-400/35' : 'bg-rose-400/35'} shadow-sm rounded-sm`}
                style={{ width: '6px', height: '100%' }}
              />
              {/* Wick bottom */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-white/40"
                style={{ width: '2px', top: '100%', height: `${4 + Math.floor(Math.random() * 10)}px` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Title and description */}
      <div className="absolute z-20 left-4 top-4 text-white">
        <h1 className="text-xl font-semibold">Financial Feeling — Interactive 3D Bull</h1>
      </div>

      {/* Interactive Instructions */}
      {showInstructions && (
        <div className="absolute z-20 top-4 right-4 bg-black/70 backdrop-blur rounded-lg p-4 text-white text-sm max-w-xs">
        </div>
      )}

      {/* Three.js Scene on top of background */}
      <div className="absolute inset-0 z-10">
        {showThreeScene ? (
          <ThreeScene />
        ) : (
          /* Fallback CSS Bull Model */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full transform rotate-12 shadow-2xl animate-pulse"></div>
                <div className="absolute -top-8 -left-4 w-8 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform -rotate-45 shadow-lg"></div>
                <div className="absolute -top-8 -right-4 w-8 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform rotate-45 shadow-lg"></div>
                <div className="absolute top-8 left-8 w-4 h-4 bg-black rounded-full shadow-inner"></div>
                <div className="absolute top-8 right-8 w-4 h-4 bg-black rounded-full shadow-inner"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-black rounded-full"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="w-full h-full rounded-full border-2 border-amber-500/30"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Local keyframes for animations */}
      <style jsx>{`
        @keyframes candleFloat {
          0% {
            transform: translateY(12px) scaleY(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.25;
          }
          50% {
            transform: translateY(0) scaleY(1);
            opacity: 0.45;
          }
          80% {
            opacity: 0.25;
          }
          100% {
            transform: translateY(-8px) scaleY(0.85);
            opacity: 0;
          }
        }
      `}</style>


    </div>
  );
} 