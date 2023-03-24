import {
    initializeWpApollo
} from '@/lib/wordpress/connector'
import { gql } from '@apollo/client';

/**
 * Retrieve single post.
 *
 * @author WebDevStudios
 * @param  {string}          postType  WP post type.
 * @param  {number | string} id        Post identifier.
 * @param  {object}          query     Post retrieval query.
 * @param  {object}          variables Query variables.
 * @param  {string}          preview   Whether query is for a regular post view (null), a preview check (basic), or full post preview (full).
 * @return {object}                    Object containing Apollo client instance and post data or error object.
 */
export default async function processCustomPostTypeQuery(
    postType,
    id,
    query,
    variables = {},
    preview = null
) {

    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo()

    // If no query is set for given post type, return error message.
    if (!query) {
        return {
            apolloClient,
            error: true,
            errorMessage: `Post type \`${postType}\` is not supported.`
        }
    }

    // Execute query.
    const response = await apolloClient
        .query({
            query,
            variables
        })
        .then((res) => {
            return res.data?.[postType] ?? null
        })
        .catch((error) => {
            return {
                isError: true,
                message: error.message
            }
        })

    return response
}
