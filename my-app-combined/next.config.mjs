/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  trailingSlash: true,
  // No basePath needed for custom domain (financialfeeling.com)
  basePath: '',
  assetPrefix: '',
  reactStrictMode: true,
}

if (!isDev) {
  nextConfig.output = 'export'
}

export default nextConfig
