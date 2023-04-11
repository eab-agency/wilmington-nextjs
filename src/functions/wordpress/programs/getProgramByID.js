import { initializeWpApollo } from '@/lib/wordpress/connector'
import queryProgramById from '@/lib/wordpress/programs/queryProgramById'

/**
 * Retrieve program details by ID.
 *
 * @param  {number} id The program's database ID.
 * @return {object}    Object containing Apollo client instance and post data or error object.
 */
export default async function getProgramByID(id) {
    // No ID? Bail...
    if (!id) {
        return {}
    }

    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo()

    // Execute query.
    const media = await apolloClient
        .query({
            query: queryProgramById,
            variables: {
                id: id
            }
        })
        .then((media) => {
            return media?.data?.mediaItem ?? null
        })
        .catch((error) => {
            return {
                isError: true,
                message: error.message
            }
        })

    return media
}
