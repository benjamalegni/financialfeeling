import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import RSSParser from 'rss-parser'
import { z } from 'zod'

const app = express()

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

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})