import { SEO } from '@/components'
import LoadMore from '@/components/LoadMore'
import { PostsList } from '@/components/archive/PostsList'
import RichText from '@/components/atoms/RichText'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql, useQuery } from '@apollo/client'
import appConfig from 'app.config'

export default function Archive(props) {
  const { uri, name, __typename } = props.data.nodeByUri
  const { data, loading, error, fetchMore } = useQuery(Archive.query, {
    variables: Archive.variables({ uri }),
    notifyOnNetworkStatusChange: true
  })

  if (error) {
    console.error(error)
    return <p>Error: {error.message}</p>
  }

  const { title: siteTitle, description: siteDescription } =
    data && data.generalSettings

  const postList = data.nodeByUri?.contentNodes?.edges.map((el) => el.node)

  let archiveTitle

  switch (name) {
    case 'faculty':
      archiveTitle = 'Faculty and Staff'
      break

    case 'news':
      archiveTitle = 'News'
      break

    case 'event':
      archiveTitle = 'Events'
      break

    case 'program':
      archiveTitle = 'Programs'
      break

    case 'organization':
      archiveTitle = 'Student Organizations'
      break

    case 'testimonial':
      archiveTitle = 'Testimonials'
      break

    default:
      archiveTitle = name
  }

  return (
    <>
      <SEO seo={{ title: archiveTitle, description: siteDescription }} />
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <RichText className="archiveTitle" tag="h1">
            {archiveTitle}
          </RichText>
          {data.description && <RichText>{data.description}</RichText>}
          <PostsList
            posts={postList}
            type={name}
            className={`${name}-archiveList`}
          />
          <LoadMore
            className="text-center"
            hasNextPage={data.nodeByUri?.contentNodes?.pageInfo.hasNextPage}
            endCursor={data.nodeByUri?.contentNodes?.pageInfo.endCursor}
            isLoading={loading}
            fetchMore={fetchMore}
            useInfiniteScroll={true}
          />
        </div>
      </Layout>
    </>
  )
}

Archive.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetCategoryPage(
    $uri: String!
    $first: Int!
    $after: String!
    $imageSize: MediaItemSizeEnum = LARGE
  ) {
    nodeByUri(uri: $uri) {
      __typename
      id
      uri
      ... on ContentType {
        name
        description
        label
        contentNodes(where: {orderby: {field: TITLE, order: ASC}}, first: $first, after: $after) {
          edges {
            node {
              id
              contentTypeName
              ... on NodeWithTitle {
                title
              }
              ... on NodeWithExcerpt {
                excerpt
              }
              date
              uri
              ...FeaturedImageFragment
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Archive.variables = ({ uri }) => {
  return {
    uri,
    first: appConfig.postsPerPage,
    after: ''
  }
}
