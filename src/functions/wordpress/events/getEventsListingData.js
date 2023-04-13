import {initializeWpApollo} from '@/lib/wordpress/connector'
import queryEventsListingAttributes, {
  queryEventsCategoryAttributes
} from '@/lib/wordpress/events-listing/queryEventsListingAttributes'

/**

Retrieve news listings by their IDs.
@param {Array} ids - Array of news listing IDs to retrieve.
@param {Number} category - Category ID to retrieve events listings from if no IDs are provided.
@return {Promise<Array>} - Promise that resolves to an array of news listings, or an error object.
*/
export default async function getEventsListingData(ids, category) {
  // No IDs? Bail...
  if ((!ids || !Array.isArray(ids)) && !category) {
    return {isError: true, message: 'Invalid IDs or category provided.'}
  }
  // Get/create Apollo instance.
  const apolloClient = initializeWpApollo()

  let eventsListings = []

  // If IDs are provided, execute query for each ID.
  if (ids && Array.isArray(ids)) {
    eventsListings = await Promise.all(
      ids.map(async (id) => {
        const eventsListing = await apolloClient
          .query({
            query: queryEventsListingAttributes,
            variables: {
              id: id
            }
          })
          .then((result) => {
            return result?.data?.event ?? null
          })
          .catch((error) => {
            return {
              isError: true,
              message: error.message
            }
          })

        return eventsListing
      })
    )
  }
  // If no IDs are provided, retrieve events listings from the specified category.
  if (category) {
    const result = await apolloClient
      .query({
        query: queryEventsCategoryAttributes,
        variables: {
          category: category
        }
      })
      .then((result) => {
        const eventsInCategory =
          result?.data?.eventCategory?.events?.nodes || []
        return eventsInCategory
      })
      .catch((error) => {
        return {
          isError: true,
          message: error.message
        }
      })

    return result
  }

  return eventsListings
}
