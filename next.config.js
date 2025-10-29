/* eslint-disable no-console */
/** @type {import('next').NextConfig} */
const fetchRedirects = require('./src/lib/wordpress/fetchRedirects')
const { withFaust } = require('@faustwp/core')
const remotePatterns = require('./src/config/imageConfig')
const nrExternals = require('newrelic/load-externals')
const path = require('path')
const glob = require('glob')

// Clean all NEXT_PUBLIC environment variables of whitespace/newlines
// This prevents "argument name is invalid" errors in cookie setting
Object.keys(process.env).forEach((key) => {
  if (key.startsWith('NEXT_PUBLIC_') && typeof process.env[key] === 'string') {
    process.env[key] = process.env[key].trim()
  }
})

// Set NEXT_PUBLIC_URL based on environment
if (!process.env.NEXT_PUBLIC_URL) {
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_URL) {
    // Production deployment - use VERCEL_URL
    process.env.NEXT_PUBLIC_URL = `https://${process.env.VERCEL_URL}`
  } else if (process.env.NODE_ENV === 'development') {
    // Local development
    process.env.NEXT_PUBLIC_URL = 'http://localhost:3000'
  }
  // For preview/non-production, NEXT_PUBLIC_URL must be set explicitly in Vercel
}

const nextConfig = {
  env: {
    // Make sure NEXT_PUBLIC_URL is available to the client
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
  },
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
    const headers = [
      {
        // Matches anything under /assets/ (your fonts live here)
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]

    // Block indexing on non-production domains following Vercel best practices
    // https://vercel.com/guides/avoiding-duplicate-content-with-vercel-app-urls
    //
    // According to Vercel docs: "Preview deployments are not indexed by search engines
    // by default because the X-Robots-Tag HTTP header is set to noindex automatically by Vercel."
    //
    // However, we want to be explicit and also block any non-wilmington.edu domains
    // Strategy: Only allow indexing on wilmington.edu and www.wilmington.edu

    // Block all vercel.app domains (preview/production deployments on Vercel infrastructure)
    if (
      process.env.VERCEL_URL &&
      process.env.VERCEL_URL.includes('.vercel.app')
    ) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      })
    }

    // Block non-production environments (development, preview, QA)
    if (process.env.VERCEL_ENV !== 'production') {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      })
    }

    return headers
  },
  swcMinify: true,
  // Make SWC stop emitting ES5-era transforms/polyfills
  experimental: {
    legacyBrowsers: false, // ✅ drop IE/very old Chrome/Firefox targets
    browsersListForSwc: true // ✅ respect your package.json browserslist
  }
}

module.exports = withFaust(nextConfig)
