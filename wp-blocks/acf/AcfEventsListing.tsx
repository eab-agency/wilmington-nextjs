/* eslint-disable camelcase */
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

  const posts: any[] = []
  if (idsData && (idsData.events || idsData.eventCategory)) {
    const nodes = idsData.events
      ? idsData.events?.nodes
      : idsData.eventCategory.events.nodes
    if (nodes.length > 0) {
      nodes.forEach((event: Event) => {
        if (event.eventsFields.event.startDate) {
          // Check if startDate is not null
          const [year, month, day] =
            event.eventsFields.event.startDate.split('-')
          const startDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          )

          const [endYear, endMonth, endDay] =
            event.eventsFields.event.endDate.split('-')
          const endDate = new Date(
            parseInt(endYear),
            parseInt(endMonth) - 1,
            parseInt(endDay)
          )

          posts.push({
            id: event.id,
            title: event.title,
            date: startDate,
            endDate: endDate,
            link: event.link,
            uri: event.uri,
            eventsFields: event.eventsFields,
            multiDay: startDate.getTime() !== endDate.getTime()
          })
        }
      })
    }
  }

  const {
    loading: latestLoading,
    error: latestError,
    data: latestData
  } = useQuery(GET_LATEST_EVENTS)

  if (latestData && latestData.events.length > 0) {
    latestData.events.forEach((event: Event) => {
      if (event.eventsFields.event.startDate) {
        const [year, month, day] = event.eventsFields.event.startDate.split('-')
        const startDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        )

        const [endYear, endMonth, endDay] =
          event.eventsFields.event.endDate.split('-')
        const endDate = new Date(
          parseInt(endYear),
          parseInt(endMonth) - 1,
          parseInt(endDay)
        )

        posts.push({
          id: event.id,
          title: event.title,
          date: startDate,
          endDate: endDate,
          link: event.link,
          uri: event.uri,
          eventsFields: event.eventsFields,
          multiDay: startDate.getTime() !== endDate.getTime()
        })
      }
    })
  }

  const futureEvents = posts.filter((post) => {
    const currentDate = new Date()
    const postDate = new Date(post.date)
    const postEndDate = new Date(post.endDate)

    return (
      postDate >= currentDate ||
      (postDate < currentDate && postEndDate >= currentDate)
    )
  })

  const sortedFutureEvents = futureEvents.sort((post1, post2) => {
    return post1.date - post2.date
  })

  if (idsLoading || latestLoading) return <p>Loading...</p>
  if (idsError || latestError) return <p>Error :(</p>

  if (posts.length === 0) return null

  return (
    <>
      <EventsListing
        posts={sortedFutureEvents}
        listing_title={listing_title}
        listing_display={listing_display}
        showImage={false}
      />
    </>
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
      events(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
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
