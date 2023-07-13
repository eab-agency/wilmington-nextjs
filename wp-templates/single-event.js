import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { seoPostFields } from '@/fragments'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import RichText from '../src/components/atoms/RichText/RichText'
import blocks from '../wp-blocks'

export default function SingleEvent(props) {
  const { editorBlocks, seo, featuredImage, eventsFields, terms, title } =
    props.data.nodeByUri

  const blocks = flatListToHierarchical(editorBlocks)

  const { event } = eventsFields

  return (
    <>
      <SEO seo={seo} />
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <RichText className="archiveTitle" tag="h1">
              {title}
            </RichText>
            {featuredImage && (
              <PageHero
                sourceUrl={featuredImage?.node?.sourceUrl}
                alt={featuredImage?.node?.altText}
                imageMeta={featuredImage?.node?.mediaDetails}
                text={title}
                pageType="event"
              />
            )}
            <div className="page-content">
              <Breadcrumbs breadcrumbs={seo.breadcrumbs} />
              <WordPressBlocksViewer blocks={blocks} />
            </div>
            <p>The location address: {event.locationAddress}</p>
            <p>The location name: {event.locationName}</p>
            <p>The start-date: {event.startDate}</p>
            <p>The end-date: {event.endDate}</p>
            <p>The start-time: {event.startTime}</p>
            <p>The end-time: {event.endTime}</p>
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
            locationAddress
            locationName
            startDate
            startTime
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
