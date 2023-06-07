import formatBlockData from '@/functions/wordpress/blocks/formatBlockData'
import getMenuByLocation from '@/functions/wordpress/menus/getMenuByLocation'
import formatDefaultSeoData from '@/functions/wordpress/seo/formatDefaultSeoData'
import {
  createWpApolloClient,
  initializeWpApollo
} from '@/lib/wordpress/connector'

/**
 * Retrieve single post.
 *
 * @param  {string}          postType  WP post type.
 * @param  {number | string} id        Post identifier.
 * @param  {object}          query     Post retrieval query.
 * @param  {object}          variables Query variables.
 * @param  {string}          preview   Whether query is for a regular post view (null), a preview check (basic), or full post preview (full).
 * @return {object}                    Object containing Apollo client instance and post data or error object.
 */
export default async function processPostTypeQuery(
  postType,
  id,
  query,
  variables = {},
  preview = null
) {
  // console.log('👩🏼‍💻👩🏼‍💻👩🏼‍💻👩🏼‍💻 ~ file: processPostTypeQuery.js:26 ~ query:', query)
  // Get/create Apollo instance.
  const apolloClient = preview
    ? createWpApolloClient(true)
    : initializeWpApollo()

  // Set up return object.
  const response = {
    apolloClient,
    error: false,
    errorMessage: null
  }

  // If no query is set for given post type, return error message.
  if (!query) {
    return {
      apolloClient,
      error: true,
      errorMessage: `Post type \`${postType}\` is not supported.`
    }
  }

  const mainNavMenuItems = await getMenuByLocation('MAIN_NAV')
  const utilityNavMenuItems = await getMenuByLocation('UTILITY_NAV')
  const footerNavMenuItems = await getMenuByLocation('FOOTER_NAV')
  const resourceNavMenuItems = await getMenuByLocation('RESOURCE_NAV')

  // Execute query.
  response.post = await apolloClient
    .query({ query, variables })
    .then((res) => {
      // console.log(
      //   '🚀 ~ file: processPostTypeQuery.js:52 ~ .then ~ res.data:',
      //   res.data.menuItems
      // )
      const { siteSeo, ...postData } = res.data

      // Retrieve menus.
      response.menus = {
        mainNav: mainNavMenuItems,
        utilityNav: utilityNavMenuItems,
        footerNav: footerNavMenuItems,
        resourceNav: resourceNavMenuItems
      }

      // Retrieve default SEO data.
      response.defaultSeo = formatDefaultSeoData({ siteSeo })

      // Retrieve post data.
      let post =
        postData?.[postType] ?? // Dynamic posts.
        postData?.headlessConfig?.additionalSettings?.[postType] // Settings custom page.

      // Set notFound prop if post data missing.
      if (!post) {
        response.notFound = true

        return null
      }

      // Retrieve revision post data if viewing full preview.
      if (preview === 'full' && post?.revisions?.edges?.[0]?.node) {
        post = {
          ...post,
          ...post.revisions.edges[0].node
        }
      }

      // Remove original revision data from return.
      if (post?.revisions?.edges?.length) {
        post = {
          ...post,
          revisions: null
        }
      }

      return post
    })
    .then(async (post) => {
      // Add slug/ID to post.
      const newPost = {
        ...post,
        slug: id
      }

      if ('basic' === preview || !post || !post?.blocksJSON) {
        return post
      }

      // Handle blocks.
      newPost.blocks = await formatBlockData(
        JSON.parse(newPost.blocksJSON) ?? []
      )

      delete newPost.blocksJSON

      return newPost
    })
    .catch((error) => {
      response.error = true
      response.errorMessage = error.message

      return null
    })

  return response
}
