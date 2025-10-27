/* eslint-disable camelcase */
import Preloader from '@/components/atoms/Preloader'
import EventsListing from '@/components/organisms/EventsListing'
import { gql, useQuery } from '@apollo/client'

interface AcfEventsListingProps {
  attributes: {
    data: string
  }
}

type Event = {
  id: string
  title: string
  date: string
  link: string
  uri: string
  eventsFields: {
    event: {
      startDate: string
      endDate: string
    }
  }
}

const AcfEventsListing = (props: AcfEventsListingProps) => {
  const attributes = props.attributes
  const { listing_title, listing_display, events_listing, event_category } =
    JSON.parse(attributes?.data)
  const {
    loading: idsLoading,
    error: idsError,
    data: idsData
  } = useQuery(events_listing ? GET_EVENTS_BY_IDS : GET_EVENTS_BY_CATEGORY, {
    variables: { ids: events_listing, category_id: event_category }
  })

  function extractDate(dateString: string) {
    const [year, month, day] = dateString.split('-')
    // Use Date.UTC to create dates at midnight UTC for consistent comparisons
    return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  }

  const extractEventData = (event: Event) => {
    const { startDate, endDate } = event.eventsFields.event
    return {
      id: event.id,
      title: event.title,
      date: extractDate(startDate),
      endDate: endDate ? extractDate(endDate) : null,
      link: event.link,
      uri: event.uri,
      eventsFields: event.eventsFields,
      multiDay: startDate !== endDate
    }
  }

  const posts: any[] = []
  if (idsData && (idsData.events || idsData.eventCategory)) {
    const nodes = idsData.events
      ? idsData.events?.nodes
      : idsData.eventCategory.events.nodes
    if (nodes.length > 0) {
      nodes.forEach((event: Event) => {
        if (event.eventsFields.event.startDate) {
          posts.push(extractEventData(event))
        }
      })
    }
  }

  const {
    loading: latestLoading,
    error: latestError,
    data: latestData
  } = useQuery(GET_LATEST_EVENTS)

  if (latestData && latestData.events.nodes.length > 0) {
    latestData.events.nodes.forEach((event: Event) => {
      if (event.eventsFields.event.startDate) {
        posts.push(extractEventData(event))
      }
    })
  }

  const futureEvents = posts.filter((post) => {
    const now = new Date()
    // Get the start of today in UTC
    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    )

    // Post dates are already UTC from extractDate, but normalize to be safe
    const postDateUTC = new Date(post.date)
    postDateUTC.setUTCHours(0, 0, 0, 0)

    // Handle potentially invalid endDate
    const postEndDate = post.endDate ? new Date(post.endDate) : null
    if (postEndDate) {
      postEndDate.setUTCHours(0, 0, 0, 0)
    }

    // Show event if it starts today or in the future
    if (postDateUTC >= todayUTC) {
      return true
    }

    // Show event if it's a multi-day event that is still ongoing
    if (postEndDate && postDateUTC < todayUTC && postEndDate >= todayUTC) {
      return true
    }

    return false
  })

  const sortedFutureEvents = futureEvents
    .sort((post1, post2) => post1.date - post2.date)
    .slice(0, 4)

  if (idsLoading || latestLoading) return <Preloader />
  if (idsError || latestError) return <p>Error :(</p>

  if (posts.length === 0) return null

  return (
    <EventsListing
      posts={sortedFutureEvents}
      listing_title={listing_title}
      listing_display={listing_display}
      showImage={false}
    />
  )
}

export default AcfEventsListing

// pull data out of the block
AcfEventsListing.fragments = {
  entry: gql`
    fragment AcfEventsListingFragment on AcfEventsListing {
      attributes {
        data
      }
    }
  `,
  key: `AcfEventsListingFragment`
}

const eventFragment = gql`
  fragment EventFields on Event {
    id
    link
    uri
    date
    title
    eventsFields {
      event {
        startDate
        startTime
        endDate
        endTime
        locationName
        locationAddress
        featured
      }
    }
  }
`

// query to get the events from the block
const GET_EVENTS_BY_IDS = gql`
  query GetEventsByIds($ids: [ID!]!) {
    events(where: { in: $ids }) {
      nodes {
        ...EventFields
      }
    }
  }
  ${eventFragment}
`

const GET_EVENTS_BY_CATEGORY = gql`
  query GetEventsByCateogry($category_id: ID!) {
    eventCategory(id: $category_id, idType: DATABASE_ID) {
      events(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          ...EventFields
        }
      }
    }
  }
  ${eventFragment}
`

const GET_LATEST_EVENTS = gql`
  query GetLatestEvents {
    events(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...EventFields
      }
    }
  }
  ${eventFragment}
`

AcfEventsListing.displayName = 'AcfEventsListing'
