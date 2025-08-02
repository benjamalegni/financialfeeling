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
  output: 'export',
  trailingSlash: true,
  // Remove basePath and assetPrefix for GitHub Pages
  // basePath: process.env.NODE_ENV === 'production' ? '/financialfeeling' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/financialfeeling/' : '',
}

export default nextConfig
