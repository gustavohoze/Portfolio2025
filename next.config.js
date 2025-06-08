/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Portfolio2025' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Portfolio2025/' : '',
  trailingSlash: true,
}

module.exports = nextConfig 