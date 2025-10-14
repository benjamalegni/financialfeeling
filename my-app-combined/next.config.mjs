import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  trailingSlash: true,
  // No basePath for custom domain (financialfeeling.com)
  reactStrictMode: true,
  poweredByHeader: false,
  // Fix for multiple lockfiles warning
  outputFileTracingRoot: __dirname,
}

export default nextConfig
