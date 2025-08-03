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
  // Solo usar export estático si estamos en producción y queremos GitHub Pages
  ...(process.env.NODE_ENV === 'production' && process.env.USE_STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
    basePath: '/financialfeeling',
    assetPrefix: '/financialfeeling/',
    // Excluir rutas que no pueden ser estáticas
    experimental: {
      excludeDefaultMomentLocales: false,
    },
  } : {}),
}

export default nextConfig
