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
        posts.push({
          id: event.id,
          title: event.title,
          date: event.eventsFields.event.startDate,
          link: event.link,
          uri: event.uri
        })
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
      posts.push({
        id: event.id,
        title: event.title,
        date: event.eventsFields.event.startDate,
        link: event.link,
        uri: event.uri
      })
    })
  }
  console.log(
    '🚀 ~ file: AcfEventsListing.tsx:32 ~ AcfEventsListing ~ posts:',
    posts
  )
  const currentDate = new Date()

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.date)
    return postDate >= currentDate
  })

  if (idsLoading || latestLoading) return <p>Loading...</p>
  if (idsError || latestError) return <p>Error :(</p>

  if (posts.length === 0) return null

  return (
    <>
      <EventsListing
        posts={posts}
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
