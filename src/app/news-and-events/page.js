import EventsPostCard from '@/components/archive/EventsPostCard'
import NewsPostCard from '@/components/archive/NewsPostCard'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import getEventsListingData from '@/functions/wordpress/events/getEventsListingData'
import getNewsListingData from '@/functions/wordpress/news/getNewsListingData'
import { className } from 'classnames/bind'

const NewsAndEventsPage = async () => {
  const news = await getNewsListingData()
  const [firstNewsItem, ...restOfNews] = news // Destructure the first item from the array

  const events = await getEventsListingData()

  const [firstEventItem, ...restOfEvents] = events // Destructure the first item from the array

  return (
    <div className="news-and-events">
      <header className="newsPageHead">
        <h1>News and Events</h1>
        {/* <Breadcrumbs breadcrumbs={props.post.seo.breadcrumbs} /> */}
      </header>
      <section className="newsGroup">
        <header className="newsSectionHead">
          <h2>News</h2>
        </header>
        <div className="group">
          <NewsPostCard
            className="highlightedPost"
            post={firstNewsItem}
            ctx={undefined}
            showImage={true}
          />
          {restOfNews &&
            restOfNews.length > 0 &&
            restOfNews.map((item, index) => (
              <NewsPostCard key={index} post={item} showImage={true} />
            ))}
        </div>
      </section>
      <section className="eventsGroup">
        <header className="eventsSectionHead">
          <h2>Events</h2>
        </header>
        <div className="group">
          <EventsPostCard
            post={firstEventItem}
            ctx={undefined}
            showImage={true}
          />
          {restOfEvents &&
            restOfEvents.length > 0 &&
            restOfEvents.map((item, index) => (
              <EventsPostCard key={index} post={item} showImage={true} />
            ))}
        </div>
      </section>

      {/* <h2>All the events passed to the standard EventsListing</h2>
      <EventsListing posts={restOfNews} listing_title="Recent Events" /> */}
    </div>
  )
}

export default NewsAndEventsPage
