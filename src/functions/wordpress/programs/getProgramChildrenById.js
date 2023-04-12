import { initializeWpApollo } from '@/lib/wordpress/connector'
import { queryProgramChildrenById } from '@/lib/wordpress/programs/queryProgramById'

/**
 * Retrieve program details by ID.
 *
 * @param  {number} id The program's database ID.
 * @return {object}    Object containing Apollo client instance and post data or error object.
 */
export default async function getProgramChildrenByID(id) {
    // No ID? Bail...
    if (!id) {
        return {}
    }

    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo()

    // Execute query.
    const program = await apolloClient
        .query({
            query: queryProgramChildrenById,
            variables: {
                id: id
            }
        })
        .then((program) => {
            return {
                program: program?.data?.program ?? null
            }
        })
        .catch((error) => {
            return {
                isError: true,
                message: error.message
            }
        })

    return program
}
