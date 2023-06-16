import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Image from '@/components/atoms/Image'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
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
        <Container>
          <article className="inner-wrap">
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
              <div className="sidebar">
                First: {faculty.first}
                <br />
                Last: {faculty.last}
                <br />
                Email: {faculty.email}
                <br />
                Facebook: {faculty.facebook}
                <br />
                Instagram: {faculty.instagram}
                <br />
                Linkedin: {faculty.linkedin}
                <br />
                Location: {faculty.location}
                <br />
                Phone: {faculty.phone}
                <br />
                Position: {faculty.position}
                <br />
                Tiktok: {faculty.tiktok}
                <br />
                Twitter: {faculty.twitter}
                <br />
                Youtube: {faculty.youtube}
              </div>
              <WordPressBlocksViewer blocks={blocks} />
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
