"use client"

import { useEffect, useState } from "react";
import { useWebLLM } from "../lib/useWebLLM";

export default function FinGPTChat() {
  // Usando FinGPT personalizado desde HuggingFace
  const { ready, loading, error, chat } = useWebLLM({
    modelId: "fingpt2-7_MLC"
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

  useEffect(() => {
    // Mensaje de sistema opcional para dar identidad financiera
    // (podés pasarlo en cada `chat([...])`).
  }, []);

  const send = async () => {
    const userText = input.trim();
    if (!userText || !ready) return;

    setLog((l) => [...l, { role: "user", text: userText }]);
    setInput("");

    const reply = await chat([
      { role: "system", content: "You are FinGPT, a financial analysis assistant." },
      ...log.map((m) => ({ role: m.role, content: m.text })),
      { role: "user", content: userText },
    ]);

    setLog((l) => [...l, { role: "assistant", text: reply }]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-3">FinGPT (WebGPU, modelo local)</h1>
      
      {hasWebGPU !== null && (
        <div className={`text-sm mb-3 p-2 rounded ${hasWebGPU ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
          WebGPU: {hasWebGPU ? '✓ Disponible' : '✗ No disponible - Activa chrome://flags/#enable-unsafe-webgpu'}
        </div>
      )}

      {!ready && (
        <div className="rounded border p-3 mb-3">
          <div className="font-medium">Cargando modelo…</div>
          {loading ? (
            <div className="text-sm mt-1">
              {loading.stage} — {Math.round(loading.progress * 100)}%
            </div>
          ) : (
            <div className="text-sm mt-1">Inicializando…</div>
          )}
        </div>
      )}

      {error && (
        <div className="rounded border border-red-500 text-red-600 p-3 mb-3">
          Error: {error}
        </div>
      )}

      <div className="space-y-2 mb-3">
        {log.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.role === "user" ? "bg-neutral-800 text-neutral-100" : "bg-neutral-100 text-neutral-900"
            }`}
          >
            <strong>{m.role === "user" ? "Tú" : "FinGPT"}: </strong>
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder={ready ? "Preguntá algo financiero…" : "Cargando modelo…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!ready}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          disabled={!ready || !input.trim()}
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
