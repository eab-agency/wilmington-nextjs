/* eslint-disable camelcase */
import Preloader from '@/components/atoms/Preloader'
import NewsListing from '@/components/organisms/NewsListing'
import { gql, useQuery } from '@apollo/client'

interface AcfNewsListingProps {
  attributes: {
    data: string
  }
}

type News = {
  link: string
  uri: string
  date: string
  title: string
  databaseId: string
  id: string
  excerpt: string
  featuredImage: any
}

const AcfNewsListing = (props: AcfNewsListingProps) => {
  const attributes = props.attributes

  const { listing_title, listing_display, news_listing, news_category } =
    JSON.parse(attributes?.data)
  const {
    loading: idsLoading,
    error: idsError,
    data: idsData
  } = useQuery(news_listing ? GET_NEWS_BY_IDS : GET_NEWS_BY_CATEGORY, {
    variables: { ids: news_listing, category_id: news_category }
  })

  const posts: any[] = []

  if (idsData && (idsData.news || idsData.newsCategory)) {
    const nodes = idsData.news
      ? idsData.news?.nodes
      : idsData.newsCategory.news.nodes
    if (nodes.length > 0) {
      nodes.forEach((article: News) => {
        posts.push({
          id: article.id,
          title: article.title,
          date: article.date,
          link: article.link,
          uri: article.uri,
          excerpt: article.excerpt,
          featuredImage: article.featuredImage
        })
      })
    }
  }

  const {
    loading: latestLoading,
    error: latestError,
    data: latestData
  } = useQuery(GET_LATEST_NEWS)

  if (latestData && latestData.news.nodes.length > 0) {
    latestData.news.nodes.forEach((article: News) => {
      posts.push({
        id: article.id,
        title: article.title,
        date: article.date,
        link: article.link,
        uri: article.uri,
        excerpt: article.excerpt,
        featuredImage: article.featuredImage
      })
    })
  }

  if (idsLoading || latestLoading) return <Preloader />
  if (idsError || latestError) return <p>Error :(</p>

  if (posts.length === 0) return null

  return (
    <NewsListing
      posts={posts}
      listing_title={listing_title}
      listing_display={listing_display}
      showImage={false}
    />
  )
}

export default AcfNewsListing

// pull data out of the block
AcfNewsListing.fragments = {
  entry: gql`
    fragment AcfNewsListingFragment on AcfNewsListing {
      attributes {
        data
      }
    }
  `,
  key: `AcfNewsListingFragment`
}

const newsFragment = gql`
  fragment NewsFields on Article {
    link
    uri
    date
    title
    databaseId
    id
    excerpt
    featuredImage {
      node {
        altText
        sourceUrl
        mediaDetails {
          height
          width
        }
      }
    }
  }
`

// query to get the events from the block
const GET_NEWS_BY_IDS = gql`
  query GetNewsByIds($ids: [ID!]) {
    news(where: { in: $ids }) {
      nodes {
        ...NewsFields
      }
    }
  }
  ${newsFragment}
`

const GET_NEWS_BY_CATEGORY = gql`
  query GetNewsByCateogry($category_id: ID!) {
    newsCategory(id: $category_id, idType: DATABASE_ID) {
      news(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          ...NewsFields
        }
      }
    }
  }
  ${newsFragment}
`

const GET_LATEST_NEWS = gql`
  query GetLatestNews {
    news(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...NewsFields
      }
    }
  }
  ${newsFragment}
`

AcfNewsListing.displayName = 'AcfNewsListing'
