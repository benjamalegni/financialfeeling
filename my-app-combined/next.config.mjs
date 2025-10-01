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
  // Rewrites para mapear rutas de HuggingFace a archivos locales
  async rewrites() {
    return [
      {
        source: '/assets/fingptmodel/resolve/main/:path*',
        destination: '/assets/fingptmodel/:path*',
      },
    ]
  },
}

if (!isDev) {
  nextConfig.output = 'export'
}

export default nextConfig
