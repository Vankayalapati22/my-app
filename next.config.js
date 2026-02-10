/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },

      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: process.env.NEXT_PUBLIC_ENV === 'development',
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || 'development',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "export",
  basePath: `/my-app`,
  assetPrefix: `/my-app/`,
  trailingSlash: true,
};

module.exports = nextConfig;
