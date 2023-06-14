import { initializeWpApollo } from '@/lib/wordpress/connector'
import queryEventsListingAttributes, {
  queryAllEventsAttributes,
  queryEventsCategoryAttributes
} from '@/lib/wordpress/events-listing/queryEventsListingAttributes'

/**

Retrieve news listings by their IDs.
@param {Array} ids - Array of news listing IDs to retrieve.
@param {Number} category - Category ID to retrieve events listings from if no IDs are provided.
@return {Promise<Array>} - Promise that resolves to an array of news listings, or an error object.
*/
export default async function getEventsListingData(ids, category) {
  // No IDs and category? Get all events.
  if (!ids && !category) {
    const apolloClient = initializeWpApollo()

    const allEvents = await apolloClient
      .query({
        query: queryAllEventsAttributes
      })
      .then((result) => {
        const events = result?.data?.events?.nodes || []
        return events
      })
      .catch((error) => {
        return {
          isError: true,
          message: error.message
        }
      })

    return allEvents
  }

  // No IDs? Get events from category.
  if (!ids || !Array.isArray(ids)) {
    const apolloClient = initializeWpApollo()

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

  // Get/create Apollo instance and execute query for each ID.
  const apolloClient = initializeWpApollo()

  const eventsListings = await Promise.all(
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

  return eventsListings
}
