// Query partial: retrieve SEO post fields.
export const seoPostFields = `
  seo {
    breadcrumbs {
      text
      url
    }
    fullHead
    metaRobotsNofollow
    metaRobotsNoindex
    title
    metaDesc
  }
`
