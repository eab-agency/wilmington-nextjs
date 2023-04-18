import { initializeWpApollo } from '@/lib/wordpress/connector'
import queryNewsListingAttributes, {
  queryAllNewsListings,
  queryNewsCategoryAttributes
} from '@/lib/wordpress/news-listing/queryNewsListingAttributes'

/**

Retrieve news listings by their IDs.
@param {Array} ids - Array of news listing IDs to retrieve.
@return {Promise<Array>} - Promise that resolves to an array of news listings, or an error object.
*/
export default async function getNewsListingData(ids, category) {
  // No IDs and category? Get all news.
  if (!ids && !category) {
    const apolloClient = initializeWpApollo()

    const allNews = await apolloClient
      .query({
        query: queryAllNewsListings
      })
      .then((result) => {
        const events = result?.data?.news?.nodes || []
        return events
      })
      .catch((error) => {
        return {
          isError: true,
          message: error.message
        }
      })

    return allNews
  }

  // No IDs? Get news from category.
  if (!ids || !Array.isArray(ids)) {
    const apolloClient = initializeWpApollo()

    const result = await apolloClient
      .query({
        query: queryNewsCategoryAttributes,
        variables: {
          category: category
        }
      })
      .then((result) => {
        return result?.data?.newsCategory?.news?.nodes ?? []
      })
      .catch((error) => {
        return {
          isError: true,
          message: error.message
        }
      })

    return result
  }

  // Get/create Apollo instance and execute query for each ID.
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
