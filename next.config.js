/* eslint-disable no-console */
/** @type {import('next').NextConfig} */
const fetchRedirects = require('./src/lib/wordpress/fetchRedirects')
const { withFaust } = require('@faustwp/core')
const remotePatterns = require('./src/config/imageConfig')
const nrExternals = require('newrelic/load-externals')
const path = require('path')
const glob = require('glob')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/(.*)sitemap.xml',
        destination: '/api/sitemap-proxy'
      },
      {
        source: '/sitemap(.*).xml',
        destination: '/api/sitemap-proxy'
      },
      // {
      //   source: '/api/formstack:path*',
      //   destination: 'https://go.advance.appily.com/form/submit:path*'
      // },
      {
        source: '/api/formstack/form/:slug*',
        destination: 'https://www.formstack.com/api/v2/form/:slug*'
      }
    ]
  },
  async redirects() {
    const redirects = await fetchRedirects()
    return [
      {
        source: '/wp-content/uploads/:slug*',
        destination:
          'https://wordpress.wilmington.edu/wp-content/uploads/:slug',
        permanent: true
      },
      ...redirects
    ]
  },
  serverExternalPackages: ['newrelic'],
  webpack: (config) => {
    nrExternals(config)
    return config
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
  },
  async headers() {
    return [
      {
        source: '/assets/:all*', // adjust to your actual fonts folder
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/:all*(woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ]
  }
}

module.exports = withFaust(nextConfig)
