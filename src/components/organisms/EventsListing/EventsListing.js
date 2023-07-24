/* eslint-disable no-unused-vars */
import EventsPostCard from '@/components/archive/EventsPostCard'
import Button from '@/components/atoms/Buttons/Button'
import Heading from '@/components/atoms/Heading'
import useIsFrontPage from '@/functions/useIsFrontPage'

function EventsListing({ listing_title, posts, showImage, listing_display }) {
  const isFrontPage = useIsFrontPage()

  if (posts === null || Object.keys(posts).length === 0) {
    return null
  }

  if (Array.isArray(posts) && posts.length > 0 && posts[0].isError) {
    return <div>{posts[0].message}</div>
  }

  if (posts.isError) {
    return <div>{posts.message}</div>
  }

  return (
    // <div className={listing_display === '1' ? 'grid' : ''}>
    <section className="eventsSection">
      <div className="sectionHead">
        <div className="sectionTag">Events</div>
        <Heading tag="h2" id="jump-news-listing">
          {listing_title}
        </Heading>
      </div>
      <ul className="eventsList">
        {posts.map((item, index) => (
          <li key={index}>
            <EventsPostCard post={item} ctx={undefined} showImage={showImage} />
          </li>
        ))}
      </ul>
      <Button
        className={!isFrontPage && 'secondary'}
        url="/events"
        text="View All Events"
      />
    </section>
  )
}

export default EventsListing
