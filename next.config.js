/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS
      ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(', ')
      : '',
    formats: ['image/avif', 'image/webp'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
}

module.exports = nextConfig
