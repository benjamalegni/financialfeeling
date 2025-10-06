import { useState, useEffect, useRef } from "react";
import * as webllm from "@mlc-ai/web-llm";

interface UseWebLLMOptions {
  modelId: string;
  modelBaseUrl?: string;
}

interface LoadingState {
  stage: string;
  progress: number;
}

export function useWebLLM({ modelId }: UseWebLLMOptions) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState<LoadingState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<webllm.MLCEngineInterface | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initEngine() {
      try {
        setLoading({ stage: "Inicializando...", progress: 0 });

        const modelURL = "https://huggingface.co/benjamalegni/fingpt-q4f32_1-MLC"

        const appConfig: webllm.AppConfig = {
          model_list: [
            {
              model_id: "fingpt-custom",
              model: modelURL,
              model_lib:
                webllm.modelLibURLPrefix +
                webllm.modelVersion +
                "/Llama-2-7b-chat-hf-q4f32_1-ctx4k_cs1k-webgpu.wasm",
            },
          ],
        };

        const engine = await webllm.CreateMLCEngine(
          "fingpt-custom",
          {
            appConfig,
            initProgressCallback: (report: webllm.InitProgressReport) => {
              if (mounted) {
                setLoading({
                  stage: report.text,
                  progress: report.progress,
                });
              }
            },
          }
        );

        if (mounted) {
          engineRef.current = engine;
          setReady(true);
          setLoading(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Error loading model:", err);
          const errorMsg = err?.message || err?.toString() || "Error al cargar el modelo";
          setError(errorMsg);
          setLoading(null);
        }
      }
    }

    initEngine();

    return () => {
      mounted = false;
      // Cleanup si es necesario
    };
  }, [modelId]);

  const chat = async (
    messages: Array<{ role: string; content: string }>
  ): Promise<string> => {
    if (!engineRef.current) {
      throw new Error("Engine not ready");
    }

    try {
      const reply = await engineRef.current.chat.completions.create({
        messages: messages as any,
      });

      return reply.choices[0]?.message?.content || "";
    } catch (err: any) {
      setError(err?.message || "Error in the chat");
      throw err;
    }
  };

  return { ready, loading, error, chat };
}

