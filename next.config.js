/** @type {import('next').NextConfig} */
const fetchRedirects = require('./src/lib/wordpress/fetchRedirects')
const { withFaust, getWpHostname } = require('@faustwp/core')

const path = require('path')
const glob = require('glob')
const envImageDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS
const imageDomains = envImageDomains ? envImageDomains.split(', ') : []

const nextConfig = {
  experimental: {
    appDir: true
  },
  async redirects() {
    const redirects = await fetchRedirects()

    return [
      ...redirects,
      // {
      //   source: '/wp-content/uploads/:slug*',
      //   destination: `${getWpHostname()}/wp-content/uploads/:slug*`,
      //   permanent: true
      // },
      {
        source: '/programs',
        destination: '/academics/program-directory',
        permanent: true
      },
      {
        source: '/program-directory',
        destination: '/academics/program-directory',
        permanent: true
      },
      {
        source: '/program',
        destination: '/academics/program-directory',
        permanent: true
      }
    ]
  },
  reactStrictMode: true,
  images: {
    domains: [getWpHostname(), ...imageDomains],
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
