import { initializeWpApollo } from '@/lib/wordpress/connector'
import queryMenuItemsByLocation from '@/lib/wordpress/menus/queryMenuItemsByLocation'

/**
 * Retrieve data for Frontend-only route (i.e., page does not exist in WordPress).
 *
 * @param  {string} route Frontend route.
 * @return {object}       Object containing Apollo client instance and post data or error object.
 */




export default async function getMenuByLocation(location) {
    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo()

    // Set up return object.
    const response = {
        apolloClient,
        error: false,
        errorMessage: null
    }

    // Execute query.
    response.post = await apolloClient
        .query({ query: queryMenuItemsByLocation, variables: { location } })
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            response.error = true
            response.errorMessage = error.message

            return null
        })

    return response.post.menuItems.nodes
}
