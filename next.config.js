/** @type {import('next').NextConfig} */

const path = require('path')

// function fetchRedirects() {
//   return fetch(`${process.env.SITE_URL}/api/wordpress/redirects`)
//     .then((response) => response.json())
//     .catch((error) => {
//       console.error('Error fetching redirects:', error)
//       throw error
//     })
// }

const nextConfig = {
  experimental: {
    appDir: true
  },
  // async redirects() {
  //   return await fetchRedirects()
  // },
  reactStrictMode: true,
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS
      ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(', ')
      : '',
    formats: ['image/avif', 'image/webp']
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')]
  }
}

module.exports = nextConfig
