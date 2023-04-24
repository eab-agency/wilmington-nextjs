import NewsPost from '@/components/archive/NewsPost'
import Container from '@/components/atoms/Container'
import EventsListing from '@/components/organisms/EventsListing/EventsListing'
import getEventsListingData from '@/functions/wordpress/events/getEventsListingData'
import getNewsListingData from '@/functions/wordpress/news/getNewsListingData'

const NewsAndEventsPage = async () => {
  const news = await getNewsListingData()
  const [firstNewsItem, ...restOfNews] = news // Destructure the first item from the array
  console.log(
    '🚀 ~ file: page.js:9 ~ NewsAndEventsPage ~ firstNewsItem:',
    firstNewsItem
  )

  const events = await getEventsListingData()

  const [firstEventItem, ...restOfEvents] = events // Destructure the first item from the array

  return (
    <Container>
      <h1>News and Events</h1>
      <h2>First news item</h2>
      <NewsPost post={firstNewsItem} ctx={undefined} showImage={true} />
      <h2>rest of the news</h2>
      {restOfNews &&
        restOfNews.length > 0 &&
        restOfNews.map((item, index) => (
          <NewsPost key={index} post={item} showImage={true} />
        ))}

      <h2>First event item</h2>
      <NewsPost post={firstEventItem} ctx={undefined} showImage={true} />
      <h2>rest of the events</h2>
      {restOfEvents &&
        restOfEvents.length > 0 &&
        restOfEvents.map((item, index) => (
          <NewsPost key={index} post={item} showImage={true} />
        ))}

      <h2>All the events passed to the standard EventsListing</h2>
      <EventsListing posts={restOfNews} listing_title="Recent Events" />
    </Container>
  )
}

export default NewsAndEventsPage
