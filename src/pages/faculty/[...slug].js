import FeaturedImage from '@/components/common/FeaturedImage'
import Container from '@/components/atoms/Container'
import RichText from '@/components/atoms/RichText'
import Layout from '@/components/common/Layout'
import Blocks from '@/components/molecules/Blocks'
import getPagePropTypes from '@/functions/getPagePropTypes'
import getPostTypeStaticPaths from '@/functions/wordpress/postTypes/getPostTypeStaticPaths'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'
import Image from '@/components/atoms/Image';

// Define route post type.
const postType = 'facultyMember'

/**
 * Render the Faculty component.
 *
 * @param  {object}  props             The component attributes as props.
 * @param  {boolean} props.archive     Whether displaying single post (false) or archive (true).
 * @param  {boolean} props.dateArchive Whether displaying single post (false) or date-based archive (true).
 * @param  {string}  props.day         Date query: day.
 * @param  {string}  props.month       Date query: month.
 * @param  {object}  props.pagination  Archive pagination data from WordPress.
 * @param  {object}  props.post        Post data from WordPress.
 * @param  {Array}   props.posts       Array of post data from WordPress.
 * @param  {string}  props.year        Date query: year.
 * @return {Element}                   The Page component.
 */
export default function Faculty({
    post
}) {
    console.log("🚀 ~ file: [...slug].js:31 ~ post:", post)
    const { email, facebook, first, last, instagram, linkedin, location, phone, position, tiktok, twitter, youtube } = post?.facultyFields?.faculty

    const { name: departmentName } = post?.departments?.nodes[0]

    const featuredImage = post?.featuredImage;
    const sourceUrl = featuredImage?.node?.sourceUrl;
    const altText = featuredImage?.node?.altText;



    let positionTitle = position;

    // checking if departmentName is not empty so we can add a comma
    if (departmentName !== "") {
        positionTitle += `, ${departmentName}`;
    }

    return (
        <Layout seo={{ ...post?.seo }}>
            <Container>
                <article className="innerWrap">
                    {featuredImage && <Image id="featured-img" url={sourceUrl} alt={altText} width='300' height='200' />}
                    <RichText tag="h1">{post?.title}</RichText>
                    <RichText tag="h2">{positionTitle}</RichText>
                    <Blocks blocks={post?.blocks} />
                </article>
                <div className="sidebar">
                    First: {first}<br />
                    Last: {last}<br />
                    Email: {email}<br />
                    Facebook: {facebook}<br />
                    Instagram: {instagram}<br />
                    Linkedin: {linkedin}<br />
                    Location: {location}<br />
                    Phone: {phone}<br />
                    Position: {position}<br />
                    Tiktok: {tiktok}<br />
                    Twitter: {twitter}<br />
                    Youtube: {youtube}<br />
                </div>
            </Container>
        </Layout>
    )
}

/**
 * Get post static paths.
 *
 * @return {object} Object consisting of array of paths and fallback setting.
 */
export async function getStaticPaths() {
    return await getPostTypeStaticPaths(postType)
}

/**
 * Get post static props.
 *
 * @param  {object}  context             Context for current post.
 * @param  {object}  context.params      Route parameters for current post.
 * @param  {boolean} context.preview     Whether requesting preview of post.
 * @param  {object}  context.previewData Post preview data.
 * @return {object}                      Post props.
 */
export async function getStaticProps({ params, preview, previewData }) {
    return getPostTypeStaticProps(params, postType, preview, previewData)
}

Faculty.propTypes = {
    ...getPagePropTypes(postType),
}
