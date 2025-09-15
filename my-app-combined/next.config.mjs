/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  // Do not set outputFileTracingRoot; avoid path joins with undefined
  // Only set output='export' for production builds
  trailingSlash: true,
  basePath: '',
  assetPrefix: '',
}

if (!isDev) {
  nextConfig.output = 'export'
}

export default nextConfig
