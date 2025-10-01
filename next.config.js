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

    // Block indexing on Vercel domains, only allow production domain
    const isVercelDomain =
      process.env.NEXT_PUBLIC_VERCEL_URL &&
      !process.env.NEXT_PUBLIC_VERCEL_URL.includes('wilmington.edu')

    if (isVercelDomain || process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
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
