import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { SEO } from '@/components'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero'
import { seoPostFields } from '@/fragments'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import facultyAcfFields from '@/lib/wordpress/_query-partials/facultyAcfFields'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import RichText from '../src/components/atoms/RichText/RichText'
import blocks from '../wp-blocks'

export default function SingleFaculty(props) {
  const { title, editorBlocks, seo, featuredImage, facultyFields } =
    props.data.nodeByUri

  const blocks = flatListToHierarchical(editorBlocks)

  const { faculty } = facultyFields

  const { title: siteTitle } = props?.data?.generalSettings ?? {}

  const seoTitle = `${faculty.position}, ${title} - ${siteTitle}`

  return (
    <>
      <SEO seo={seo} title={seoTitle} />
      <Layout className="thelayoutclass">
        <div className="single-faculty">
          <article className="inner-wrap">
            {featuredImage && (
              <PageHero
                sourceUrl={featuredImage?.node?.sourceUrl}
                alt={featuredImage?.node?.altText}
                imageMeta={featuredImage?.node?.mediaDetails}
                text={title}
                pageType="faculty"
              />
            )}
            {!featuredImage && <RichText tag="h1">{title}</RichText>}

            <div className="page-content">
              <div className="facultyContent">
                <div className="facultyData">
                  {faculty.email ? (
                    <div className="facultyDataLine email">
                      Email: {faculty.email}
                    </div>
                  ) : null}
                  {/* {faculty.location ? (
                    <div className="facultyDataLine location">
                      Location: {faculty.location}
                    </div>
                  ) : null} */}
                  {faculty.phone ? (
                    <div className="facultyDataLine phone">
                      Phone: {faculty.phone}
                    </div>
                  ) : null}
                  {faculty.position ? (
                    <div className="facultyDataLine position">
                      Position: {faculty.position}
                    </div>
                  ) : null}
                  {faculty.facebook ? (
                    <div className="facultyDataLine facebook">
                      Facebook: {faculty.facebook}
                    </div>
                  ) : null}
                  {faculty.instagram ? (
                    <div className="facultyDataLine instagram">
                      Instagram: {faculty.instagram}
                    </div>
                  ) : null}
                  {faculty.linkedin ? (
                    <div className="facultyDataLine linkedin">
                      Linkedin: {faculty.linkedin}
                    </div>
                  ) : null}
                  {faculty.tiktok ? (
                    <div className="facultyDataLine tiktok">
                      Tiktok: {faculty.tiktok}
                    </div>
                  ) : null}
                  {faculty.twitter ? (
                    <div className="facultyDataLine twitter">
                      Twitter: {faculty.twitter}
                    </div>
                  ) : null}
                  {faculty.youtube ? (
                    <div className="facultyDataLine youtube">
                      Youtube: {faculty.youtube}
                    </div>
                  ) : null}
                </div>
                <div className="facultyDescription">
                  <WordPressBlocksViewer blocks={blocks} />
                </div>
              </div>
            </div>
          </article>
        </div>
      </Layout>
    </>
  )
}

SingleFaculty.variables = ({ uri }, ctx) => {
  return {
    uri
  }
}

/**
 * Compose the GraphQL query for our page's data.
 */
SingleFaculty.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  # Get all block fragments and add them to the query
  ${getFragmentDataFromBlocks(blocks).entries}

  query GetSingularFaculty($uri: String!, $imageSize: MediaItemSizeEnum = LARGE) {
    nodeByUri(uri: $uri) {
      ... on NodeWithTitle {
        title
      }
      ... on NodeWithFeaturedImage {
        ...FeaturedImageFragment
      }
      ... on FacultyMember {
        ${facultyAcfFields}
        ${seoPostFields}
      }
       ... on NodeWithEditorBlocks {
        # Get contentBlocks with flat=true and the nodeId and parentId
        # so we can reconstruct them later using flatListToHierarchical()
        editorBlocks {
          cssClassNames
          isDynamic
          name
          id: clientId
          parentId: parentClientId
          renderedHtml

          # Get all block fragment keys and call them in the query
          ${getFragmentDataFromBlocks(blocks).keys}
        }
      }
    }
     generalSettings {
      ...BlogInfoFragment
    }
  }
`
