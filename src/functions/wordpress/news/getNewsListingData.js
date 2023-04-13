import {initializeWpApollo} from '@/lib/wordpress/connector'
import queryNewsListingAttributes from '@/lib/wordpress/news-listing/queryNewsListingAttributes'

/**

Retrieve news listings by their IDs.
@param {Array} ids - Array of news listing IDs to retrieve.
@return {Promise<Array>} - Promise that resolves to an array of news listings, or an error object.
*/
export default async function getNewsListingData(ids) {
  // No IDs? Bail...
  if (!ids || !Array.isArray(ids)) {
    return {isError: true, message: 'Invalid IDs provided.'}
  }
  // Get/create Apollo instance.
  const apolloClient = initializeWpApollo()

  // Execute query for each ID.
  const newsListings = await Promise.all(
    ids.map(async (id) => {
      const newsListing = await apolloClient
        .query({
          query: queryNewsListingAttributes,
          variables: {
            id: id
          }
        })
        .then((result) => {
          return result?.data?.article ?? null
        })
        .catch((error) => {
          return {
            isError: true,
            message: error.message
          }
        })

      return newsListing
    })
  )

  return newsListings
}
