import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import RSSParser from 'rss-parser'
import { z } from 'zod'

const app = express()
app.use(express.json())
// CORS: allow frontend to call this API from a different origin
// Configure allowed origin via ALLOWED_ORIGIN, else allow all in dev
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
app.use(cors({ origin: allowedOrigin, methods: ['GET', 'POST', 'OPTIONS'] }))

const RSS_SOURCES = [
  {
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com/feeds/news/global.xml',
  },
]

const ForecastSchema = z.object({
  forecast: z.record(z.object({
    impact: z.enum(['positive', 'negative', 'neutral']),
    news: z.string(),
    reason: z.string(),
    horizon: z.enum(['short', 'medium', 'long']),
  })),
})

async function fetchRssNews(sources) {
  const parser = new RSSParser()
  const allNews = []

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url)
      const newsInfo = (feed.items || [])
        .slice(0, 5)
        .map((it) => ({
          title: it.title || it.contentSnippet || '',
          link: it.link || '',
          isoDate: it.isoDate || it.pubDate || null,
          source: source.name,
        }))
      allNews.push(...newsInfo)
    } catch (e) {
      // ignore source errors and continue
    }
  }

  return allNews
}

app.get('/', (req, res) => {
  res.send('OK')
})

app.get('/news', async (req, res) => {
  try {
    const news = await fetchRssNews(RSS_SOURCES)
    res.json({ news })
    console.log(news)
  } catch (e) {
    res.status(500).json({ error: 'failed_to_fetch_news' })
  }
})

// Clean LLM JSON-like responses and parse to object (mirrors n8n "md to json")
function cleanAndParseJson(raw) {
  if (typeof raw !== 'string') throw new Error('Model output must be a string')

  let clean = raw.trim()

  // Strip common lead-in headers like "Here is your JSON:" etc.
  clean = clean.replace(/^(here\s+is\s+(your\s+)?(the\s+)?(valid\s+)?json:?)/i, '').trim()

  // If wrapped in a code fence, extract inner content
  const fenceMatch = clean.match(/```(?:json|markdown)?\n([\s\S]*?)\n```/i)
  if (fenceMatch) {
    clean = fenceMatch[1].trim()
  }

  // As a fallback, trim everything after the last closing brace
  const endIndex = clean.lastIndexOf('}')
  if (endIndex !== -1) {
    clean = clean.slice(0, endIndex + 1)
  }

  // Final parse
  let parsed
  try {
    parsed = JSON.parse(clean)
  } catch (err) {
    throw new Error('Error parsing model JSON: ' + err.message + '\nContent:\n' + clean)
  }

  return parsed
}

// Try Gemini via official SDK (@google/genai). If SDK not installed, return null.
async function tryGeminiWithSdk(promptText, apiKey, modelName) {
  try {
    const mod = await import('@google/genai').catch(() => null)
    if (!mod || (!mod.GoogleGenAI && !mod.GoogleAI && !mod.GoogleGenerativeAI)) {
      return null // SDK not present, let caller fallback
    }

    // Prefer GoogleGenAI from @google/genai; support other names cautiously
    const Ctor = mod.GoogleGenAI || mod.GoogleAI || mod.GoogleGenerativeAI
    const ai = new Ctor({ apiKey: apiKey || process.env.GOOGLE_API_KEY })

    // API shape for @google/genai: ai.models.generateContent
    if (typeof ai?.models?.generateContent === 'function') {
      const resp = await ai.models.generateContent({ model: modelName, contents: promptText })
      const text = resp?.text ?? (typeof resp?.text === 'function' ? resp.text() : undefined)
      if (!text) throw new Error('Empty response from Gemini SDK')
      return text
    }

    // Back-compat for @google/generative-ai style
    if (typeof ai?.getGenerativeModel === 'function') {
      const model = ai.getGenerativeModel({ model: modelName })
      const resp = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: promptText }] }] })
      const text = resp?.response?.text?.() || resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Empty response from Gemini SDK (gen-ai)')
      return text
    }

    // Unknown SDK shape
    return null
  } catch (e) {
    // Wrap as upstream error with provider for consistent handling
    const status = e?.response?.status
    const upstreamMsg = e?.response?.data?.error?.message || e?.message
    const err = new Error(status ? `Gemini SDK request failed (${status})` : 'Gemini SDK request failed')
    err.code = 'upstream_error'
    err.provider = 'gemini'
    if (status) err.upstream_status = status
    if (upstreamMsg) err.upstream_message = upstreamMsg
    throw err
  }
}

// Build the prompt exactly like n8n Code1 node, now including optional RSS headlines
function buildStocksPrompt(stocksText, headlines = []) {
  const safeStocks = (stocksText || '').trim()
  const limitedHeadlines = Array.isArray(headlines) ? headlines.filter(Boolean).slice(0, 5) : []

  const prompt = `You are a critical-thinking senior financial analyst.
Analyze the following recent financial headlines and extract structured insights in valid JSON format only.

Your task:
- Wrap output in forecast attribute
- Identify only financial assets directly affected by the news
- For each affected market, return: "impact", "news", "reason", "horizon"
- Respond strictly in JSON format only — no additional explanation or commentary - no empty json
- Do not use special characters that might break the JSON
- Do not include unaffected or speculative markets

assets to analyze:
${safeStocks}

recent headlines:
${limitedHeadlines.map((h, i) => `- ${h}`).join('\n')}
`

  const example = `. OUTPUT FORMAT EXAMPLE:
{"forecast":{
    "S&P500": {
      "impact": "negative",
      "news": "Federal Reserve announces...",
      "reason": "Higher interest rates increase borrowing costs...",
      "horizon": "short"
    },
    "Gold": {
      "impact": "positive",
      "news": "Geopolitical tensions escalate as trade war intensifies",
      "reason": "Trade war uncertainty drives investors...",
      "horizon": "medium"
    }
  }
}`

  return prompt.concat(example)
}

// Call Gemini or OpenAI depending on available credentials
// options.provider can force 'gemini' | 'openai'
// Returns: { text, provider, transport }
async function callModel(promptText, options = {}) {
  const geminiKey = process.env.GEMINI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  const preferred = options.provider === 'gemini' || options.provider === 'openai' ? options.provider : null
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  if ((preferred === 'gemini' || !preferred) && geminiKey) {
    // Try official SDK first; if not available, fallback to REST
    const sdkText = await tryGeminiWithSdk(promptText, geminiKey, geminiModel).catch((e) => { throw e })
    if (typeof sdkText === 'string' && sdkText.length > 0) return { text: sdkText, provider: 'gemini', transport: 'sdk' }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }],
        },
      ],
    }
    try {
      const { data } = await axios.post(url, body, { timeout: 30000 })
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Empty response from Gemini')
      return { text, provider: 'gemini', transport: 'rest' }
    } catch (e) {
      const status = e?.response?.status
      const upstreamMsg = e?.response?.data?.error?.message || e?.response?.data?.message
      const msg = status ? `Gemini request failed (${status})` : 'Gemini request failed'
      const err = new Error(msg)
      err.code = 'upstream_error'
      err.provider = 'gemini'
      err.transport = 'rest'
      if (status) err.upstream_status = status
      if (upstreamMsg) err.upstream_message = upstreamMsg
      throw err
    }
  }

  if ((preferred === 'openai' || !preferred) && openaiKey) {
    const url = 'https://api.openai.com/v1/chat/completions'
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    const body = {
      model,
      messages: [{ role: 'user', content: promptText }],
      temperature: 0,
    }
    const headers = {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    }
    try {
      const { data } = await axios.post(url, body, { headers, timeout: 30000 })
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error('Empty response from OpenAI')
      return { text, provider: 'openai', transport: 'rest' }
    } catch (e) {
      const status = e?.response?.status
      const upstreamMsg = e?.response?.data?.error?.message || e?.response?.data?.message
      const msg = status ? `OpenAI request failed (${status})` : 'OpenAI request failed'
      const err = new Error(msg)
      err.code = 'upstream_error'
      err.provider = 'openai'
      err.transport = 'rest'
      if (status) err.upstream_status = status
      if (upstreamMsg) err.upstream_message = upstreamMsg
      throw err
    }
  }

  throw new Error('No AI provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY.')
}

// Normalize `stocks` param: allow string or array of strings
function normalizeStocksParam(input) {
  if (typeof input === 'string') {
    if (!input.trim()) {
      const err = new Error('Body must include non-empty "stocks"')
      err.code = 'invalid_stocks'
      throw err
    }
    return input
  }
  if (Array.isArray(input)) {
    const parts = input
      .map((x) => (typeof x === 'string' ? x.trim() : ''))
      .filter(Boolean)
    const joined = parts.join('; ')
    if (!joined.trim()) {
      const err = new Error('Body must include non-empty array of strings in "stocks"')
      err.code = 'invalid_stocks'
      throw err
    }
    return joined
  }
  const err = new Error('Body must include "stocks" as string or array of strings')
  err.code = 'invalid_stocks'
  throw err
}

// Shared core that always calls the model (no mockOutput)
async function analyzeStocksCore({ stocks, provider, includeRss = true }) {
  const stocksText = normalizeStocksParam(stocks)
  let headlines = []
  if (includeRss) {
    try {
      const news = await fetchRssNews(RSS_SOURCES)
      headlines = (news || []).map((n) => n.title).filter(Boolean).slice(0, 5)
    } catch (_) {
      // if RSS fails, continue with empty headlines
    }
  }

  const promptText = buildStocksPrompt(stocksText, headlines)
  const modelRes = await callModel(promptText, provider ? { provider } : undefined)
  const rawOutput = modelRes.text

  const parsed = cleanAndParseJson(rawOutput)
  const validated = ForecastSchema.parse(parsed)
  if (!validated || !validated.forecast || Object.keys(validated.forecast).length === 0) {
    const err = new Error('Empty forecast from model')
    err.code = 'empty_forecast'
    throw err
  }

  return { promptText, rawOutput, parsed, validated, provider: modelRes.provider, transport: modelRes.transport }
}

// POST /analyze-stocks -> mirrors the n8n Webhook + Code1 + AI Agent + md to json
app.post('/analyze-stocks', async (req, res) => {
  const { stocks, provider } = req.body || {}
  try {
    const { validated, transport } = await analyzeStocksCore({ stocks, provider })
    console.log('[analyze-stocks] transport=', transport, 'assets=', Object.keys(validated.forecast))
    return res.json(validated)
  } catch (err) {
    // Fallback: if model returned empty/invalid forecast, return neutral entries for requested stocks
    const message = err?.message || 'unknown_error'
    const isUserInput = err?.code === 'invalid_stocks'
    const isModelEmpty = err?.code === 'empty_forecast' || message.startsWith('Error parsing model JSON')
    if (!isUserInput && isModelEmpty) {
      try {
        const list = Array.isArray(stocks) ? stocks : (typeof stocks === 'string' ? stocks.split(/[,;]+/).map(s => s.trim()).filter(Boolean) : [])
        const fallback = list.reduce((acc, symRaw) => {
          const sym = (symRaw || '').toUpperCase()
          if (!sym) return acc
          acc[sym] = {
            impact: 'neutral',
            news: `No strong signal detected for ${sym}`,
            reason: 'Model returned empty/invalid forecast; providing neutral fallback',
            horizon: 'short',
          }
          return acc
        }, {})
        if (Object.keys(fallback).length > 0) {
          console.warn('[analyze-stocks] returning neutral fallback forecast due to model error:', message)
          res.setHeader('X-Fallback', '1')
          return res.json({ forecast: fallback })
        }
      } catch (_) {}
    }

    const status = err?.code === 'invalid_stocks'
      ? 400
      : (typeof err?.upstream_status === 'number' && err.upstream_status)
        || (err?.code === 'empty_forecast' ? 422 : (message.startsWith('Error parsing model JSON') ? 422 : 500))
    return res.status(status).json({
      error: 'analyze_stocks_failed',
      message,
      provider: err?.provider,
      transport: err?.transport,
      upstream_status: err?.upstream_status,
    })
  }
})

// POST /analyze-stocks-debug -> returns debug info (no mockOutput)
app.post('/analyze-stocks-debug', async (req, res) => {
  try {
    const { stocks, provider } = req.body || {}
    console.log('[analyze-stocks-debug] input types:', {
      typeofStocks: typeof stocks,
      isArray: Array.isArray(stocks),
    })
    const result = await analyzeStocksCore({ stocks, provider })

    // Trim long fields for readability in logs
    const preview = (txt) => (typeof txt === 'string' ? txt.slice(0, 400) : '')
    console.log('[analyze-stocks-debug] prompt(ln=', result.promptText.length, ')\n', preview(result.promptText))
    console.log('[analyze-stocks-debug] rawOutput\n', preview(result.rawOutput))
    console.log('[analyze-stocks-debug] validated assets=', Object.keys(result.validated.forecast))

    return res.json({
      prompt: result.promptText,
      raw: result.rawOutput,
      parsed: result.parsed,
      validated: result.validated,
      provider: result.provider,
      transport: result.transport,
    })
  } catch (err) {
    const message = err?.message || 'unknown_error'
    const status = err?.code === 'invalid_stocks'
      ? 400
      : (typeof err?.upstream_status === 'number' && err.upstream_status)
        || (err?.code === 'empty_forecast' ? 422 : (message.startsWith('Error parsing model JSON') ? 422 : 500))
    return res.status(status).json({
      error: 'analyze_stocks_debug_failed',
      message,
      provider: err?.provider,
      transport: err?.transport,
      upstream_status: err?.upstream_status,
      upstream_message: err?.upstream_message,
    })
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
