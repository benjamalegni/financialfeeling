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

interface Particle {
  id: number;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function BullHead3D() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showThreeScene, setShowThreeScene] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration issues
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${3 + Math.random() * 2}s`,
    }));
    setParticles(generatedParticles);

    // Show Three.js scene after a short delay
    const timer = setTimeout(() => {
      setShowThreeScene(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[80vh] bg-gradient-to-b from-neutral-900 to-black rounded-2xl relative overflow-hidden">
      {/* Title and description */}
      <div className="absolute z-10 left-4 top-4 text-white">
        <h1 className="text-xl font-semibold">Financial Feeling — Interactive 3D Bull</h1>
      </div>

      {/* Interactive Instructions */}
      {showInstructions && (
        <div className="absolute z-20 top-4 right-4 bg-black/70 backdrop-blur rounded-lg p-4 text-white text-sm max-w-xs">
        </div>
      )}

      {/* Three.js Scene */}
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

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              animation: `float ${particle.animationDuration} ease-in-out ${particle.animationDelay} infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      {/* Local keyframes for particle animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-80px);
            opacity: 1;
          }
        }
      `}</style>


    </div>
  );
} 