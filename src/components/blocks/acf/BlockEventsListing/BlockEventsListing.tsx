/* eslint-disable camelcase */
import EventsListing from '@/components/organisms/EventsListing'

interface BlockEventsListingProps {
  data: {
    listing_title: string
    events_listing: string[]
    listing_display: string
    event_category?: string
  }
  listingData: any
}

const BlockEventsListing = ({
  data: { listing_title, listing_display },
  listingData
}: BlockEventsListingProps) => {
  const posts = listingData

  // if posts is an empty array, return null
  if (posts.length === 0) {
    return null
  }

  return (
    <>
      {posts ? (
        <EventsListing
          posts={posts}
          listing_title={listing_title}
          listing_display={listing_display}
          showImage={false}
        />
      ) : null}
    </>
  )
}

export default BlockEventsListing
