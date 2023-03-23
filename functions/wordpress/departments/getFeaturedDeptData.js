import { initializeWpApollo } from '@/lib/wordpress/connector';
import queryFeaturedDepartmentAttributes from '@/lib/wordpress/featured-department/queryFeaturedDepartmentAttributes';

/**

Retrieve news listings by their IDs.
@param {Array} ids - Array of news listing IDs to retrieve.
@return {Promise<Array>} - Promise that resolves to an array of news listings, or an error object.
*/
export default async function getFeaturedProgramsFromDepartmentData(ids) {
    // No IDs? Bail...
    if (!ids || !Array.isArray(ids)) {
        return { isError: true, message: 'Invalid IDs provided.' };
    }
    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo();

    // Execute query for each ID.
    const featuredPrograms = await Promise.all(
        ids.map(async (id) => {
            const featuredDepartment = await apolloClient
                .query({
                    query: queryFeaturedDepartmentAttributes,
                    variables: {
                        id: id,
                    },
                })
                .then((result) => {
                    // just return the programs
                    return result?.data?.department?.programs.nodes ?? null
                })
                .catch((error) => {
                    return {
                        isError: true,
                        message: error.message,
                    };
                });

            return featuredDepartment;
        })
    );

    return featuredPrograms;
}
