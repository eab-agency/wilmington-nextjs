import NewsPost from '@/components/archive/NewsPost'
import getEventsListingData from '@/functions/wordpress/events/getEventsListingData'
import getNewsListingData from '@/functions/wordpress/news/getNewsListingData'

const NewsAndEventsPage = async () => {
  const news = await getNewsListingData()
  const [firstNewsItem, ...restOfNews] = news // Destructure the first item from the array

  const events = await getEventsListingData()

  const [firstEventItem, ...restOfEvents] = events // Destructure the first item from the array

  return (
    <div className="news-and-events">
      <h1>News and Events</h1>
      <section className="newsGroup">
        <h2>News</h2>
        <div className="group">
          <NewsPost post={firstNewsItem} ctx={undefined} showImage={true} />
          {restOfNews &&
            restOfNews.length > 0 &&
            restOfNews.map((item, index) => (
              <NewsPost key={index} post={item} showImage={true} />
            ))}
        </div>
      </section>
      <section className="eventsGroup">
        <h2>Events</h2>
        <div className="group">
          <NewsPost post={firstEventItem} ctx={undefined} showImage={true} />
          {/* <h2>rest of the events</h2> */}
          {restOfEvents &&
            restOfEvents.length > 0 &&
            restOfEvents.map((item, index) => (
              <NewsPost key={index} post={item} showImage={true} />
            ))}
        </div>
      </section>

      {/* <h2>All the events passed to the standard EventsListing</h2>
      <EventsListing posts={restOfNews} listing_title="Recent Events" /> */}
    </div>
  )
}

export default NewsAndEventsPage
