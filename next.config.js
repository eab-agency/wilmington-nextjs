/* eslint-disable no-console */
/** @type {import('next').NextConfig} */
const fetchRedirects = require('./src/lib/wordpress/fetchRedirects')
const { withFaust } = require('@faustwp/core')
const remotePatterns = require('./src/config/imageConfig')

const path = require('path')
const glob = require('glob')

const nextConfig = {
  experimental: {
    appDir: true
  },
  async redirects() {
    const redirects = await fetchRedirects()
    console.log(
      '🚀 ~ file: next.config.js:15 ~ redirects ~ redirects:',
      redirects.length
    )
    return [...redirects]
  },
  reactStrictMode: true,
  images: {
    remotePatterns,
    formats: ['image/avif', 'image/webp']
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'src/styles'),
      ...glob.sync(path.join(__dirname, 'src/styles/**/'))
    ]
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  }
}

module.exports = withFaust(nextConfig)
