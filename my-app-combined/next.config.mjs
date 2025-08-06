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
  // Configuración para GitHub Pages (dominio que funciona)
  ...(process.env.NODE_ENV === 'production' && process.env.USE_STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
    basePath: '/financialfeeling',
    assetPrefix: '/financialfeeling/',
    // Forzar HTTPS en producción
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
          ],
        },
      ]
    },
  } : {}),
}

export default nextConfig
