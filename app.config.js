/**
 * Global application config file
 */
const appConfig = {
  /**
   * The number of posts to fetch per 'page'.
   */
  postsPerPage: 12,

  /**
   * The number of projects to fetch per 'page'.
   */
  facultyPerPage: 5,

  /**
   * The number of post featured images that are above the fold for most screen sizes.
   * These images will be considered high priority and preloaded.
   */
  postsAboveTheFold: 6,

  /**
   * The number of project featured images that are above the fold for most screen sizes.
   * These images will be considered high priority and preloaded.
   */
  facultyAboveTheFold: 4,

  /**
   * Displays a default Featured Image when a Post does not have one.
   */
  archiveDisplayFeaturedImage: true
}

export default appConfig
