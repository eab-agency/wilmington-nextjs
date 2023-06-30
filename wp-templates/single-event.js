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
import { className } from 'classnames/bind'
import blocks from '../wp-blocks'

export default function SingleEvent(props) {
  const { editorBlocks, seo, featuredImage, eventsFields, terms, title } =
    props.data.nodeByUri

  const blocks = flatListToHierarchical(editorBlocks)

  const { event } = eventsFields
  const termsArray = terms.nodes

  return (
    <>
      <SEO seo={seo} />
      <Layout className="thelayoutclass">
        <div className="events-article">
          <article className="inner-wrap">
            <PageHero
              sourceUrl={featuredImage?.node?.sourceUrl}
              alt={featuredImage?.node?.altText}
              imageMeta={featuredImage?.node?.mediaDetails}
              text={title}
              pageType="news"
              newsCategories={event.newsCategories}
            />
            <div className="page-content">
              <Breadcrumbs breadcrumbs={seo.breadcrumbs} />
              <section className="eventDetails">
                <div className="eventStartDate">
                  <div>The start-date: {event.startDate}</div>
                  <div>The start-time: {event.startTime}</div>
                </div>
                <div classname="eventEndDate">
                  <div>The end-date: {event.endDate}</div>
                  <div>The end-time: {event.endTime}</div>
                </div>
                <div className="eventLocations">
                  <div>The location name: {event.locationName}</div>
                  <div>The location address: {event.locationAddress}</div>
                </div>
                {/* <div>The field group name: {event.fieldGroupName}</div> */}
                <div>
                  The terms:
                  {termsArray.map((term, index) => (
                    <span key={index}>{term.name}</span>
                  ))}
                </div>
              </section>
              <WordPressBlocksViewer blocks={blocks} />
            </div>
          </article>
        </div>
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
