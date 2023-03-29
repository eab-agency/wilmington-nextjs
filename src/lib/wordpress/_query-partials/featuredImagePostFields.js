// Query partial: retrieve featured image post fields.
const featuredImagePostFields = `
  featuredImage {
    node {
      altText
      caption
      sourceUrl(size: $imageSize)
      mediaDetails {
        width
        height
      }
    }
  }
`

export default featuredImagePostFields
