import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Image from '@/components/atoms/Image'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import blocks from '../wp-blocks'

const SEO_QUERY = gql`
  fragment SeoFragment on PostTypeSEO {
    breadcrumbs {
      text
      url
    }
    fullHead
    metaRobotsNofollow
    metaRobotsNoindex
    title
  }
`

/**
 * This is a Faust Template for resolving singular templates (posts, pages).
 *
 * If you are unfamiliar with Faust Templates, they resolve much like the
 * WordPress Template Hierarchy.
 *
 * @see https://faustjs.org/docs/templates
 */
export default function SingleEvent(props) {
  const { title, editorBlocks, seo, featuredImage, eventsFields, uri, terms } =
    props.data.nodeByUri

  const blocks = flatListToHierarchical(editorBlocks)

  // console.log('result: ', props.data.nodeByUri.terms.nodes[0].name)
  // console.log('result: ', terms)

  const { event } = eventsFields
  // const { name } = terms.nodes[0]
  const termsArray = terms.nodes

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
              <WordPressBlocksViewer blocks={blocks} />
            </div>
            <p>The end-date: {event.endDate}</p>
            <p>The end-time: {event.endTime}</p>
            <p>The field group name: {event.fieldGroupName}</p>
            <p>The location address: {event.locationAddress}</p>
            <p>The location name: {event.locationName}</p>
            <p>The start-date: {event.startDate}</p>
            <p>The start-time: {event.startTime}</p>
            <p>
              The terms:
              {termsArray.map((term) => (
                <span key={term.name}>{term.name}</span>
              ))}
            </p>
          </article>
        </Container>
      </Layout>
    </>
  )
}

SingleEvent.variables = ({ uri }, ctx) => {
  return {
    uri,
    asPreview: ctx?.asPreview
  }
}

/**
 * Compose the GraphQL query for our page's data.
 */
SingleEvent.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  ${getFragmentDataFromBlocks(blocks).entries}
  ${SEO_QUERY}
  query GetEventData($uri: String!, $imageSize: MediaItemSizeEnum = LARGE) {
    nodeByUri(uri: $uri) {
       ... on NodeWithTitle {
        title
      }
       ... on Event {
        uri
        eventsFields {
          event {
            endDate
            endTime
            fieldGroupName
            locationAddress
            locationName
            startDate
            startTime
          }
        }
        terms {
          nodes {
            ... on Department {
              name
            }
          }
        }
         seo {
    ...SeoFragment
  }
  }
   ...FeaturedImageFragment
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
