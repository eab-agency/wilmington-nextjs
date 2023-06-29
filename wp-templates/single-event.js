import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Image from '@/components/atoms/Image'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { seoPostFields } from '@/fragments'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import blocks from '../wp-blocks'

export default function SingleEvent(props) {
  const { editorBlocks, seo, featuredImage, eventsFields, terms } =
    props.data.nodeByUri

  const blocks = flatListToHierarchical(editorBlocks)

  const { event } = eventsFields
  const termsArray = terms.nodes

  return (
    <>
      <SEO seo={seo} />
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
              {termsArray.map((term, index) => (
                <span key={index}>{term.name}</span>
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
  ${FeaturedImage.fragments.entry}
  ${getFragmentDataFromBlocks(blocks).entries}
  query GetEventData($uri: String!, $imageSize: MediaItemSizeEnum = LARGE) {
    nodeByUri(uri: $uri) {
       ... on NodeWithTitle {
        title
      }
       ... on Event {
        ${seoPostFields}
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
  }


`
