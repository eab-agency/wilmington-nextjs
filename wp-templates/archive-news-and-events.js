import { SEO } from '@/components'
import EventsPostCard from '@/components/archive/EventsPostCard'
import NewsListCard from '@/components/archive/NewsListCard'
import NewsPostCard from '@/components/archive/NewsPostCard'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import RichText from '@/components/atoms/RichText'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql } from '@apollo/client'

export default function NewsArchive(props) {
  const { news, events } = props.data
  const { uri } = props.__TEMPLATE_VARIABLES__

  const { description: siteDescription } = props?.data?.generalSettings ?? {}

  const archiveTitle = `Wilmington College News & Events`

  const firstNewsItem = news.nodes[0]
  const restOfNews = news.nodes.slice(1, -5) // Destructure the rest of the items
  const [...lastFiveNews] = news.nodes.slice(-5) // Destructure the five items

  const [firstEventItem, ...restOfEvents] = events.nodes // Destructure the first item from the array

  const displayNewsFirst = uri === '/news/'
  const breadcrumbs = [
    {
      text: 'Home',
      url: 'https://www.wilmington.edu/'
    },
    {
      text: displayNewsFirst ? 'News & Events' : 'Events & News',
      url: displayNewsFirst
        ? 'https://www.wilmington.edu/news/'
        : 'https://www.wilmington.edu/events/'
    }
  ]

  return (
    <>
      <SEO seo={{ title: archiveTitle, description: siteDescription }} />
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <div className="news-and-events">
            <header className="newsPageHead">
              <RichText className="archiveTitle" tag="h1">
                {displayNewsFirst ? 'News & Events' : 'Events & News'}
              </RichText>
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </header>
            {displayNewsFirst ? (
              <>
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
                        <NewsPostCard
                          key={index}
                          post={item}
                          showImage={false}
                        />
                      ))}
                    <div className="moreNews">
                      <h3>More News</h3>
                      {lastFiveNews &&
                        lastFiveNews.length > 0 &&
                        lastFiveNews.map((item, index) => (
                          <NewsListCard
                            key={index}
                            post={item}
                            showImage={false}
                          />
                        ))}
                    </div>
                  </div>
                </section>
                <section className="eventsGroup">
                  <h2>Events</h2>
                  <div className="group">
                    <EventsPostCard
                      post={firstEventItem}
                      ctx={undefined}
                      showImage={false}
                    />
                    {restOfEvents &&
                      restOfEvents.length > 0 &&
                      restOfEvents.map((item, index) => (
                        <EventsPostCard
                          key={index}
                          post={item}
                          showImage={false}
                        />
                      ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                <section className="eventsGroup">
                  <h2>Events</h2>
                  <div className="group">
                    <EventsPostCard
                      className="highlightedPost"
                      post={firstEventItem}
                      ctx={undefined}
                      showImage={false}
                    />
                    {restOfEvents &&
                      restOfEvents.length > 0 &&
                      restOfEvents.map((item, index) => (
                        <EventsPostCard
                          key={index}
                          post={item}
                          showImage={false}
                        />
                      ))}
                  </div>
                </section>
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
                        <NewsPostCard
                          key={index}
                          post={item}
                          showImage={true}
                        />
                      ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}

NewsArchive.variables = ({ uri }) => {
  return { uri }
}

NewsArchive.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query getNewsAndEvents($imageSize: MediaItemSizeEnum = MEDIUM) {
    news(first: 9) {
      nodes {
        ...FeaturedImageFragment
        excerpt
        date
        title
        uri
      }
    }
    events(first: 5) {
      nodes {
        ...FeaturedImageFragment
        excerpt
        title
        uri
        eventsFields {
          event {
            endDate
            endTime
            featured
            locationAddress
            locationName
            startDate
            startTime
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
