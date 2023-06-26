import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Image from '@/components/atoms/Image'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import { className } from 'classnames/bind'
import blocks from '../wp-blocks'

/**
 * This is a Faust Template for resolving singular templates (posts, pages).
 *
 * If you are unfamiliar with Faust Templates, they resolve much like the
 * WordPress Template Hierarchy.
 *
 * @see https://faustjs.org/docs/templates
 */
export default function Component(props) {
  const { title, editorBlocks, seo, featuredImage, facultyFields } =
    props.data.nodeByUri
  const blocks = flatListToHierarchical(editorBlocks)

  const { faculty } = facultyFields

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {}

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Layout className="thelayoutclass">
        <Container calssName="single-faculty">
          <article className="inner-wrap">
            <PageHero
              sourceUrl={featuredImage?.node?.sourceUrl}
              alt={featuredImage?.node?.altText}
              imageMeta={featuredImage?.node?.mediaDetails}
              text={title}
              pageType="faculty"
            />
            {featuredImage && (
              <Image
                id="featured-img"
                url={featuredImage.node.sourceUrl}
                alt={featuredImage.node.altText}
                width="300"
                height="200"
              />
            )}
            <div className="page-content">
              <div className="facultyContent">
                <section className="div">
                  {faculty.first ? <div>First: {faculty.first}</div> : null}
                  {faculty.last ? <div>Last: {faculty.last}</div> : null}
                  {faculty.email ? <div>Email: {faculty.email}</div> : null}
                  {faculty.facebook ? (
                    <div>Facebook: {faculty.facebook}</div>
                  ) : null}
                  {faculty.instagram ? (
                    <div>Instagram: {faculty.instagram}</div>
                  ) : null}
                  {faculty.linkedin ? (
                    <div>Linkedin: {faculty.linkedin}</div>
                  ) : null}
                  {faculty.location ? (
                    <div>Location: {faculty.location}</div>
                  ) : null}
                  {faculty.phone ? <div>Phone: {faculty.phone}</div> : null}
                  {faculty.position ? (
                    <div>Position: {faculty.position}</div>
                  ) : null}
                  {faculty.tiktok ? <div>Tiktok: {faculty.tiktok}</div> : null}
                  {faculty.twitter ? (
                    <div>Twitter: {faculty.twitter}</div>
                  ) : null}
                  {faculty.youtube ? (
                    <div>Youtube: {faculty.youtube}</div>
                  ) : null}
                </section>
                <div className="facultyDescription">
                  <WordPressBlocksViewer blocks={blocks} />
                </div>
              </div>
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

Component.variables = ({ uri }, ctx) => {
  return {
    uri
  }
}

/**
 * Compose the GraphQL query for our page's data.
 */
Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  # Get all block fragments and add them to the query
  ${getFragmentDataFromBlocks(blocks).entries}

  query GetSingular($uri: String!, $imageSize: MediaItemSizeEnum = LARGE) {
    nodeByUri(uri: $uri) {
      ... on NodeWithTitle {
        title
      }
      ... on NodeWithFeaturedImage {
        ...FeaturedImageFragment
      }
      ... on Faculty {
        facultyFields {
          faculty {
            email
            facebook
            first
            instagram
            last
            linkedin
            location
            phone
            position
            tiktok
            twitter
            youtube
            cv {
              mediaItemUrl
            }
          }
      }
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
          # renderedHtml

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
