'use client'

import React from "react";

export default function BullHead3D() {
  return (
    <div className="w-full h-[80vh] bg-gradient-to-b from-neutral-900 to-black rounded-2xl relative overflow-hidden">
      <div className="absolute z-10 left-4 top-4 text-white">
        <h1 className="text-xl font-semibold">Financial Feeling — Toro 3D</h1>
        <p className="text-xs opacity-80">Modelo 3D del Toro de Wall Street</p>
      </div>

      {/* 3D Bull Model Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Bull Head Geometry using CSS */}
          <div className="relative w-48 h-48">
            {/* Bull head base */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full transform rotate-12 shadow-2xl animate-pulse"></div>
            
            {/* Bull horns */}
            <div className="absolute -top-8 -left-4 w-8 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform -rotate-45 shadow-lg"></div>
            <div className="absolute -top-8 -right-4 w-8 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform rotate-45 shadow-lg"></div>
            
            {/* Bull eyes */}
            <div className="absolute top-8 left-8 w-4 h-4 bg-black rounded-full shadow-inner"></div>
            <div className="absolute top-8 right-8 w-4 h-4 bg-black rounded-full shadow-inner"></div>
            
            {/* Bull nose */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-black rounded-full"></div>
          </div>
          
          {/* Rotating animation */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
            <div className="w-full h-full rounded-full border-2 border-amber-500/30"></div>
          </div>
        </div>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* CTA overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href="#"
          className="bg-white/10 backdrop-blur rounded-2xl px-4 py-2 text-white text-sm shadow hover:bg-white/20 transition-colors"
        >
          Probar demo
        </a>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 text-white/60 text-xs">
        <p>🎯 Modelo 3D interactivo del Toro de Wall Street</p>
        <p>💎 Símbolo de fortaleza y prosperidad financiera</p>
      </div>
    </div>
  );
} 