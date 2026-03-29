/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@draven/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Speedup dev compilation
  typescript: {
    // Type check di CI/build saja, skip saat dev
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Lint di CI/build saja, skip saat dev
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  experimental: {
    // Optimasi Windows file watching
    webpackBuildWorker: true,
  },
}

module.exports = nextConfig
