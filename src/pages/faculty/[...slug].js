/* eslint-disable no-unsafe-optional-chaining */
import Container from '@/components/atoms/Container'
import Image from '@/components/atoms/Image'
import RichText from '@/components/atoms/RichText'
import Layout from '@/components/common/Layout'
import Blocks from '@/components/molecules/Blocks'
import ProgramCard from '@/components/molecules/ProgramCard'
import getPagePropTypes from '@/functions/getPagePropTypes'
import getPostTypeStaticPaths from '@/functions/wordpress/postTypes/getPostTypeStaticPaths'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'

// Define route post type.
const postType = 'facultyMember'

// TODO: separate this out to its own component (maybe if using it more than once)
function ProgramList({ programs }) {
  const renderPrograms = (programType, title) => {
    if (programs[programType] && programs[programType].length > 0) {
      return (
        <>
          <h4>{title}</h4>
          {programs[programType].map((program) => (
            <ProgramCard
              key={program.id}
              title={program.title}
              link={program.link}
            />
          ))}
        </>
      )
    }
    return null
  }

  return (
    <>
      {programs.major.length || programs.minor.length ? (
        <h3>Related Programs</h3>
      ) : null}
      {renderPrograms('major', 'Majors')}
      {renderPrograms('minor', 'Minors')}
    </>
  )
}

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
export default function Faculty({ post }) {
  const {
    email,
    facebook,
    first,
    last,
    instagram,
    linkedin,
    location,
    phone,
    position,
    tiktok,
    twitter,
    youtube
  } = post?.facultyFields?.faculty

  const department = post?.departments
  const departmentName = department?.nodes[0]?.name

  const featuredImage = post?.featuredImage
  const sourceUrl = featuredImage?.node?.sourceUrl
  const altText = featuredImage?.node?.altText

  const programs = post?.facultyToProgramRelationship?.programfaculty

  let positionTitle = position || ''
  if (departmentName && departmentName !== '') {
    positionTitle += `, ${departmentName}`
  }
  function programsByDegree(data) {
    const programsArray = {
      major: [],
      minor: []
    }

    if (data) {
      data.forEach((program) => {
        const degree = program.programFields.program.degree
        const degreeTitle = program.programFields.program.degreeTitle

        if (degree === 'major' || degree === 'major-grad') {
          programsArray.major.push({
            title: `${program.title} - ${degreeTitle}`,
            id: program.id,
            link: program.uri,
            degreeTitle
          })
        } else if (degree === 'minor') {
          programsArray.minor.push({
            title: `${program.title} - ${degreeTitle}`,
            id: program.id,
            link: program.uri,
            degreeTitle
          })
        }
      })
    }

    return programsArray
  }

  const updatedPrograms = programsByDegree(programs)

  return (
    <Layout seo={{ ...post?.seo }}>
      <Container>
        <article className="innerWrap">
          {featuredImage && (
            <Image
              id="featured-img"
              url={sourceUrl}
              alt={altText}
              width="300"
              height="200"
            />
          )}
          <RichText tag="h1">{post?.title}</RichText>
          {positionTitle && <RichText tag="h2">{positionTitle}</RichText>}
          <Blocks blocks={post?.blocks} />
        </article>
        <div className="sidebar">
          First: {first}
          <br />
          Last: {last}
          <br />
          Email: {email}
          <br />
          Facebook: {facebook}
          <br />
          Instagram: {instagram}
          <br />
          Linkedin: {linkedin}
          <br />
          Location: {location}
          <br />
          Phone: {phone}
          <br />
          Position: {position}
          <br />
          Tiktok: {tiktok}
          <br />
          Twitter: {twitter}
          <br />
          Youtube: {youtube}
          <br />
        </div>
        <div className="relatedPrograms">
          <ProgramList programs={updatedPrograms} />
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
  ...getPagePropTypes(postType)
}
