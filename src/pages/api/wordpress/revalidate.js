/**
 * On-demand post revalidation.
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation
 * @param {object} req Instance of http.IncomingMessage.
 * @param {object} res Instance of http.ServerResponse.
 */
export default async function revalidate(req, res) {
  // Check for a valid secret.
  if (req.query.secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return res.status(401).json({
      message:
        'Invalid secret. Please check your .env file or the POST request.'
    })
  }

  const path = req.query.path

  // Ensure the path parameter is provided
  if (!path) {
    return res.status(400).json({ message: 'Path query parameter is required' })
  }

  // Try to revalidate the post cache.
  try {
    await res.revalidate(path)

    return res.status(200).json({
      message: `Success! The cache for ${path} was successfully revalidated.`,
      revalidated: true
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}
