"use client"

import React, { useState } from 'react'

interface SharedSidebarProps {
  selectedAssets?: string[];
  onAnalysisComplete?: (data: any) => void;
}

export default function SharedSidebar({ selectedAssets = [], onAnalysisComplete }: SharedSidebarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async () => {
    if (selectedAssets.length === 0) {
      alert('❌ No hay assets seleccionados para analizar. Selecciona assets en tu portfolio primero.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando análisis de acciones...', selectedAssets);
      
      const response = await fetch('/api/analyze-stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stocks: selectedAssets
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Análisis completado:', data);
        
        // Llamar al callback para actualizar el dashboard
        if (onAnalysisComplete) {
          onAnalysisComplete(data);
        }
        
        // Mostrar resultados más detallados
        let message = '✅ Análisis de acciones completado!\n\n';
        if (data.data && data.data.stocks) {
          data.data.stocks.forEach((stock: any) => {
            message += `${stock.symbol}: ${stock.analysis.sentiment} (${stock.analysis.confidence}% confianza)\n`;
            message += `Recomendación: ${stock.analysis.recommendation}\n\n`;
          });
        }
        
        alert(message);
      } else {
        const errorData = await response.json();
        console.error('Error en el análisis:', errorData);
        alert(`❌ Error al realizar el análisis: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ Error de conexión con el servidor n8n');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-black border-r border-gray-800 flex flex-col items-center py-4 space-y-4 shadow-lg">
      {/* Efecto de FF superpuestas con sombra - siempre activo */}
      <div className="relative">
        <div className="text-white text-xl font-bold">FF</div>
        <div className="absolute top-0 right-0.5 text-white text-xl font-bold">FF</div>
      </div>
      
      {/* Botón Run FF Analysis vertical con colores 80s animados */}
      <div className="flex-1 flex items-center justify-center">
        <button 
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className={`w-12 h-32 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center border border-gray-600 ${
            isLoading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-1">
            {isLoading ? (
              <>
                <span className="text-xs leading-tight animate-pulse">A</span>
                <span className="text-xs leading-tight animate-pulse">N</span>
                <span className="text-xs leading-tight animate-pulse">A</span>
              </>
            ) : (
              <>
                <span className="text-xs leading-tight">R</span>
                <span className="text-xs leading-tight">U</span>
                <span className="text-xs leading-tight">N</span>
              </>
            )}
          </div>
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="w-8 h-8 bg-gray-700 rounded shadow-sm"></div>
        <div className="w-4 h-4 bg-gray-600 rounded mx-auto shadow-sm"></div>
        <div className="w-4 h-4 bg-gray-600 rounded mx-auto shadow-sm"></div>
        <div className="w-4 h-4 bg-gray-600 rounded mx-auto shadow-sm"></div>
      </div>
    </div>
  )
} 