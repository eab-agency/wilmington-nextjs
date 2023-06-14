/** @type {import('next').NextConfig} */
const fetchRedirects = require('./src/lib/wordpress/fetchRedirects')
const { withFaust, getWpHostname } = require('@faustwp/core')

const path = require('path')
const glob = require('glob')

const nextConfig = {
  experimental: {
    appDir: true
  },
  // async redirects() {
  //   return await fetchRedirects()
  // },
  reactStrictMode: true,
  images: {
    domains: [getWpHostname()],
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
