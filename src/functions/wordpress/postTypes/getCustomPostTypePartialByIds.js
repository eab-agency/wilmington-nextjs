import processCustomPostTypeQuery from '@/functions/wordpress/postTypes/processCustomPostTypeQuery'
import queryFacultyById from '@/lib/wordpress/faculty/queryFacultyById'
import queryFaqById from '@/lib/wordpress/faq/queryFaqById'
import queryStudentOrgById from '@/lib/wordpress/student-orgs/queryStudentOrgById'

/**
 * Retrieve single post by specified identifier.
 *
 * @param  {string}          postType WP post type.
 * @param  {array | string } ids       Post identifier.
 * @param  {string}          idType   Type of ID.
 * @param  {string}          preview  Whether query is for a regular post view (null), a preview check (basic), or full post preview (full).
 * @return {object}                   Object containing Apollo client instance and post data or error object.
 */
export default async function getCustomPostTypePartialById(
    postType,
    ids,
    idType = 'DATABASE_ID',
    preview = null
) {
    // if ids is not an array, make it one
    if (!Array.isArray(ids)) {
        ids = [ids]
    }


    // Define single post query based on post type.
    const postTypeQuery = {
        facultyMember: queryFacultyById,
        fAQ: queryFaqById,
        studentOrg: queryStudentOrgById,
    }

    // Retrieve post type query.
    const query = postTypeQuery?.[postType] ?? null

    // Loop over IDs and push results into array.
    const posts = [];
    for (let i = 0; i < ids.length; i++) {
        const result = await processCustomPostTypeQuery(
            postType,
            ids[i],
            query,
            { id: ids[i], idType },
            preview
        )
            .then((res) => {
                return res
            })
            .catch((err) => {
                return null
            })
        posts.push(result ?? null);
    }

    return posts
}
