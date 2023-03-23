import { initializeWpApollo } from '@/lib/wordpress/connector';
import queryEventsListingAttributes from '@/lib/wordpress/events-listing/queryEventsListingAttributes';

/**

Retrieve news listings by their IDs.
@param {Array} ids - Array of news listing IDs to retrieve.
@return {Promise<Array>} - Promise that resolves to an array of news listings, or an error object.
*/
export default async function getEventsListingData(ids) {
    // No IDs? Bail...
    if (!ids || !Array.isArray(ids)) {
        return { isError: true, message: 'Invalid IDs provided.' };
    }
    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo();

    // Execute query for each ID.
    const eventsListings = await Promise.all(
        ids.map(async (id) => {
            const eventsListing = await apolloClient
                .query({
                    query: queryEventsListingAttributes,
                    variables: {
                        id: id,
                    },
                })
                .then((result) => {
                    return result?.data?.event ?? null
                })
                .catch((error) => {
                    return {
                        isError: true,
                        message: error.message,
                    };
                });

            return eventsListing;
        })
    );

    return eventsListings;
}
