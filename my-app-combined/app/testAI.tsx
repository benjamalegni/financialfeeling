"use client"

import { useEffect, useState } from "react";
import { useWebLLM } from "../lib/useWebLLM";

export default function FinGPTChat() {
  // Usando tu FinGPT custom q4f32 fine-tuned para finanzas
  const { ready, loading, error, chat } = useWebLLM({
    modelId: "fingpt-custom"
  });

  const [input, setInput] = useState("");
  const [log, setLog] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar WebGPU
    if (typeof window !== 'undefined') {
      setHasWebGPU('gpu' in navigator);
    }
  }, []);

  const send = async () => {
    const userText = input.trim();
    if (!userText || !ready) return;

    setLog((l) => [...l, { role: "user", text: userText }]);
    setInput("");

    const reply = await chat([
      { 
        role: "system", 
        content: `You are FinGPT, an advanced financial analysis assistant specialized in:
- Stock market analysis and technical indicators
- Financial ratios and fundamental analysis (P/E, P/B, ROE, debt ratios, etc.)
- Investment strategies and portfolio management
- Market trends and economic indicators
- Risk assessment and valuation

Provide clear, data-driven insights. When analyzing stocks or financial metrics, explain your reasoning step by step. Use relevant financial terminology but explain complex concepts when needed.` 
      },
      ...log.map((m) => ({ role: m.role, content: m.text })),
      { role: "user", content: userText },
    ]);

    setLog((l) => [...l, { role: "assistant", text: reply }]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-3 text-white">FinGPT (WebGPU, modelo local)</h1>
      
      {hasWebGPU !== null && (
        <div className={`text-sm mb-3 p-2 rounded ${hasWebGPU ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
          WebGPU: {hasWebGPU ? '✓ Disponible' : '✗ No disponible - Activa chrome://flags/#enable-unsafe-webgpu'}
        </div>
      )}

      {!ready && (
        <div className="rounded border border-gray-600 bg-gray-800 p-3 mb-3 text-white">
          <div className="font-medium">Cargando modelo…</div>
          {loading ? (
            <div className="text-sm mt-1">
              {loading.stage} — {Math.round(loading.progress * 100)}%
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loading.progress * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm mt-1">Inicializando…</div>
          )}
        </div>
      )}

      {error && (
        <div className="rounded border border-red-500 bg-red-900/20 text-red-400 p-3 mb-3">
          Error: {error}
        </div>
      )}

      <div className="space-y-2 mb-3 max-h-96 overflow-y-auto">
        {log.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.role === "user" 
                ? "bg-blue-900/30 text-blue-100 border border-blue-700" 
                : "bg-gray-800 text-gray-100 border border-gray-600"
            }`}
          >
            <strong>{m.role === "user" ? "Tú" : "FinGPT"}: </strong>
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-600 bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder={ready ? "Preguntá algo financiero…" : "Cargando modelo…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!ready}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          disabled={!ready || !input.trim()}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
} 