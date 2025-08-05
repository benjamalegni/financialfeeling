/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuración para dominio personalizado financialfeeling.com
  ...(process.env.NODE_ENV === 'production' && process.env.USE_STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
    basePath: '',
    assetPrefix: '',
  } : {}),
}

export default nextConfig
