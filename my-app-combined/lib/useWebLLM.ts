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

export function useWebLLM({ modelId, modelBaseUrl }: UseWebLLMOptions) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState<LoadingState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<webllm.MLCEngineInterface | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initEngine() {
      try {
        setLoading({ stage: "Inicializando...", progress: 0 });

        // custom model config from my hugging face
        const appConfig: webllm.AppConfig = {
          model_list: [
            {
              // Tu modelo en HuggingFace
              model: "https://huggingface.co/benjamalegni/fingpt2-7_MLC",
              model_id: "fingpt2-7_MLC",

              // reutilize the precompiled wasm from llama 2 7b chat
              model_lib:
                webllm.modelLibURLPrefix +
                webllm.modelVersion +
                "/Llama-2-7b-chat-hf-q4f16_1-ctx4k_cs1k-webgpu.wasm",

              required_features: ["shader-f16"],
            },
          ],
        };

        // create engine with progress callback
        const engine = await webllm.CreateMLCEngine(
          "fingpt2-7_MLC",
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
          setError(err?.message || "Error al cargar el modelo");
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

