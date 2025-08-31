import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
// import Container from '@/components/atoms/Container'
import EventIcon from '@/components/atoms/EventIcon'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { seoPostFields } from '@/fragments'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import Head from 'next/head'
// import RichText from '../src/components/atoms/RichText/RichText'
import Preloader from '@/components/atoms/Preloader'
import { MdForward } from 'react-icons/md'
import blockEntries from '../wp-blocks'

/**
 * Format date string to display only month/day/year without time
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
const formatDateWithoutTime = (dateString) => {
  if (!dateString) return ''

  // Check if the date string includes a time component (contains 'T' or ':')
  const hasTimeComponent = dateString.includes('T') || dateString.includes(':')

  if (hasTimeComponent) {
    // Create a Date object and format it to display only month/day/year
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC', // Ensuring our formatted date respects the timezone already passed in the date string
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // If it's already just a date without time, return as is
  return dateString
}

export default function SingleEvent(props) {
  if (props.loading) {
    return <Preloader />
  }
  const { editorBlocks, seo, featuredImage, eventsFields, title } =
    props.data.event

  const blocks = flatListToHierarchical(editorBlocks)

  const { event } = eventsFields

  // if no event, return null
  if (!event)
    return (
      <div>
        Whoops, it looks like this event is not configured correctly. Please
        contact the school.
      </div>
    )

  return (
    <>
      <SEO seo={seo} />
      <Head>
        {/* add json-ld for this event */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: title,
              startDate: event.startDate,
              endDate: event.endDate,
              eventAttendanceMode:
                'https://schema.org/OnlineEventAttendanceMode',
              eventStatus: 'https://schema.org/EventScheduled',
              location: {
                '@type': 'Place',
                name: event.locationName,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: event.locationName,
                  addressRegion: 'OH',
                  postalCode: '45177',
                  streetAddress: event.locationAddress
                }
              },
              image: featuredImage?.node?.sourceUrl,
              description: seo.metaDesc
            })
          }}
        />
      </Head>
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
                <div className="eventDateTime">
                  <div className="eventDate">
                    <EventIcon icon="calendar" />
                    {formatDateWithoutTime(event.startDate)}{' '}
                    {event.endDate && (
                      <>
                        <span className="separatorUpTo">
                          <MdForward />
                        </span>{' '}
                        {formatDateWithoutTime(event.endDate)}
                      </>
                    )}
                  </div>
                  <div className="eventTime">
                    <EventIcon icon="time" /> {event.startTime}{' '}
                    {event.endTime && (
                      <>
                        <span className="separatorUpTo">
                          <MdForward />
                        </span>{' '}
                        {event.endTime}
                      </>
                    )}
                  </div>
                </div>
                <div className="eventLocations">
                  <EventIcon icon="location" />
                  <address>
                    <div className="eventLocationName">
                      <strong>{event.locationName}</strong>
                    </div>
                    <div className="eventLocationAddress">
                      {event.locationAddress}
                    </div>
                  </address>
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

SingleEvent.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview
  }
}

/**
 * Compose the GraphQL query for our page's data.
 */
SingleEvent.query = gql`
  ${FeaturedImage.fragments.entry}
  ${getFragmentDataFromBlocks(blockEntries).entries}
  query GetEventData($databaseId: ID!, $imageSize: MediaItemSizeEnum = LARGE, $asPreview: Boolean = false
) {
    event(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
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
          ${getFragmentDataFromBlocks(blockEntries).keys}
        }
      }
    }
  }


`
