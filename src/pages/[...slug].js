import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import RichText from '@/components/atoms/RichText'
import Layout from '@/components/common/Layout'
import Blocks from '@/components/molecules/Blocks'
import Archive from '@/components/organisms/Archive'
import getPagePropTypes from '@/functions/getPagePropTypes'
import useIsFrontPage from '@/functions/useIsFrontPage'
import getPostTypeStaticPaths from '@/functions/wordpress/postTypes/getPostTypeStaticPaths'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'
import { PropTypes } from 'prop-types'

// Define route post type.
const postType = 'page'

/**
 * Render the Page component.
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
export default function Page({
  archive,
  dateArchive,
  day,
  month,
  pagination,
  post,
  posts,
  year
}) {
  const isFrontPage = useIsFrontPage()

  if (archive) {
    return (
      <Layout seo={{ ...post?.seo }}>
        <Container>
          <Archive posts={posts} postType="post" pagination={pagination} />
        </Container>
      </Layout>
    )
  } else if (dateArchive) {
    return (
      <Layout seo={{ ...post?.seo }}>
        <Container>
          <RichText tag="h1">{post?.title}</RichText>
          <Archive
            date={{
              day,
              month,
              year
            }}
            posts={posts}
            postType="post"
            pagination={pagination}
          />
        </Container>
      </Layout>
    )
  }

  return (
    <Layout className="thelayoutclass" seo={{ ...post?.seo }}>
      <Container>
        <article className="inner-wrap">
          {!isFrontPage && (
            <div>
              <Breadcrumbs breadcrumbs={post.seo.breadcrumbs} />
              <RichText tag="h1">{post?.title}</RichText>
            </div>
          )}
          <Blocks blocks={post?.blocks} />
        </article>
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

Page.propTypes = {
  ...getPagePropTypes(postType),
  dateArchive: PropTypes.bool,
  day: PropTypes.string,
  month: PropTypes.string,
  year: PropTypes.string
}
