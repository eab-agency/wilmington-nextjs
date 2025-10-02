/* eslint-disable no-console */
/**
 * On-demand post revalidation.
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation
 * @param {object} req Instance of http.IncomingMessage.
 * @param {object} res Instance of http.ServerResponse.
 */
export default async function revalidate(req, res) {
  console.log('=== REVALIDATE WEBHOOK CALLED ===')
  console.log('Method:', req.method)
  console.log('Headers:', JSON.stringify(req.headers, null, 2))
  console.log('Query params:', JSON.stringify(req.query, null, 2))
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('================================')

  // Support both query params and body
  const secret = req.query.secret || req.body.secret
  let path = req.query.path || req.body.slug || req.body.path

  // Extract path from post_permalink if not provided directly
  if (!path && req.body.post_permalink) {
    try {
      const url = new URL(req.body.post_permalink)
      path = url.pathname
    } catch (e) {
      console.log('Failed to parse post_permalink:', e.message)
    }
  }

  console.log('Extracted secret:', secret ? 'Present' : 'Missing')
  console.log('Extracted path:', path)
  console.log('Post permalink:', req.body.post_permalink)

  // Check for a valid secret.
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    console.log('❌ Secret validation failed')
    return res.status(401).json({
      message:
        'Invalid secret. Please check your .env file or the POST request.'
    })
  }

  console.log('✅ Secret validated')

  // Check for a valid path.
  if (!path) {
    console.log('❌ Path missing')
    return res.status(400).json({
      message: 'A path is required to revalidate the cache.'
    })
  }

  // Try to revalidate the post cache.
  try {
    console.log('🔄 Attempting to revalidate:', path)
    await res.revalidate(path)
    console.log('✅ Revalidation successful')
    return res.status(200).json({
      message: `Success! The cache for ${path} was successfully revalidated.`,
      revalidated: true
    })
  } catch (err) {
    console.log('❌ Revalidation error:', err.message)
    return res.status(500).json({
      message: err.message
    })
  }
}
