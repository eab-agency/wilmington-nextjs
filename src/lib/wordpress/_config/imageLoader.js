let domains = process.env.WORDPRESS_URL
console.log('🚀 ~ file: imageLoader.js:2 ~ domains:', domains)
let allDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS
console.log('🚀 ~ file: imageLoader.js:4 ~ allDomains:', allDomains)

export default function wordpressLoader({ src, quality, width }) {
  console.log(
    '🩸🩸🩸🩸🩸🩸 ~ file: imageLoader.js:8 ~ wordpressLoader ~ width:',
    width
  )
  console.log(
    '🩸🩸🩸🩸🩸🩸 ~ file: imageLoader.js:8 ~ wordpressLoader ~ quality:',
    quality
  )
  console.log(
    '🩸🩸🩸🩸🩸🩸 ~ file: imageLoader.js:8 ~ wordpressLoader ~ src:',
    src
  )
  const url = new URL(src)
  console.log('🚀 ~ file: imageLoader.js:12 ~ wordpressLoader ~ url:', url)
  // url.searchParams.set('fm', 'webp')
  // url.searchParams.set('w', width.toString())
  // url.searchParams.set('q', quality.toString() || '75')
  return src
}
