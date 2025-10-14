/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  trailingSlash: true,
  // No basePath for custom domain (financialfeeling.com)
  reactStrictMode: true,
  // Vercel optimizations
  swcMinify: true,
  poweredByHeader: false,
}

export default nextConfig
