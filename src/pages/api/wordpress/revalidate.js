/* eslint-disable no-console */
/**
 * On-demand post revalidation.
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation
 * @param {object} req Instance of http.IncomingMessage.
 * @param {object} res Instance of http.ServerResponse.
 */
export default async function revalidate(req, res) {
  console.log('🔔 Revalidate endpoint called')
  console.log('📥 Request method:', req.method)
  console.log('🔑 Secret received:', req.query.secret ? 'Yes' : 'No')
  console.log('🔑 Secret expected:', process.env.WORDPRESS_PREVIEW_SECRET ? 'Yes' : 'No')
  console.log('🔍 Query params:', req.query)
  console.log('📦 Request body:', req.body)

  // Check for a valid secret.
  if (req.query.secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    console.log('❌ Secret validation failed')
    return res.status(401).json({
      message:
        'Invalid secret. Please check your .env file or the POST request.'
    })
  }

  console.log('✅ Secret validated')

  const path = req.query.path
  console.log('🚀 ~ revalidate ~ path:', path)

  // Ensure the path parameter is provided
  if (!path) {
    return res.status(400).json({ message: 'Path query parameter is required' })
  }

  // Try to revalidate the post cache.
  try {
    console.log('🔄 Attempting to revalidate path:', path)
    await res.revalidate(path)
    console.log('✅ Revalidation successful for:', path)

    return res.status(200).json({
      message: `Success! The cache for ${path} was successfully revalidated.`,
      revalidated: true
    })
  } catch (err) {
    console.log('❌ Revalidation failed:', err.message)
    return res.status(500).json({
      message: err.message
    })
  }
}
