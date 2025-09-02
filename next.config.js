/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/schoolImages/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    serverComponentsExternalPackages: ['mysql2'],
  },
};

module.exports = nextConfig;