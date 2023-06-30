import { SEO } from '@/components'
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

  const [firstNewsItem, ...restOfNews] = news.nodes // Destructure the first item from the array

  const [firstEventItem, ...restOfEvents] = events.nodes // Destructure the first item from the array

  const displayNewsFirst = uri === '/news/'
  const breadcrumbs = [
    {
      text: 'Home',
      url: 'https://wilmington-nexjs.vercel.app/'
    },
    {
      text: displayNewsFirst ? 'News & Events' : 'Events & News',
      url: displayNewsFirst
        ? 'https://wilmington-nexjs.vercel.app/news/'
        : 'https://wilmington-nexjs.vercel.app/events/'
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
                          showImage={true}
                        />
                      ))}
                  </div>
                </section>
                <section className="eventsGroup">
                  <h2>Events</h2>
                  <div className="group">
                    <NewsPostCard
                      post={firstEventItem}
                      ctx={undefined}
                      showImage={true}
                    />
                    {restOfEvents &&
                      restOfEvents.length > 0 &&
                      restOfEvents.map((item, index) => (
                        <NewsPostCard
                          key={index}
                          post={item}
                          showImage={true}
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
                    <NewsPostCard
                      className="highlightedPost"
                      post={firstEventItem}
                      ctx={undefined}
                      showImage={true}
                    />
                    {restOfEvents &&
                      restOfEvents.length > 0 &&
                      restOfEvents.map((item, index) => (
                        <NewsPostCard
                          key={index}
                          post={item}
                          showImage={true}
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
    news(first: 5) {
      nodes {
        ...FeaturedImageFragment
        date
        title
        uri
      }
    }
    events(first: 5) {
      nodes {
        ...FeaturedImageFragment
        date
        title
        uri
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
