import { SEO } from '@/components'
import LoadMore from '@/components/LoadMore'
import { PostsList } from '@/components/archive/PostsList'
import RichText from '@/components/atoms/RichText'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql, useQuery } from '@apollo/client'
import { useFaustQuery } from '@faustwp/core'
import appConfig from 'app.config'

export default function Archive(props) {
  const uri = '/faculty'
  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_FACULTY_QUERY,
    {
      variables: Archive.variables({ uri: uri }),
      notifyOnNetworkStatusChange: true
    }
  )

  const { generalSettings } = useFaustQuery(GET_LAYOUT_QUERY)

  if (error) {
    console.error(error)
    return <p>Error: {error.message}</p>
  }

  if (!data) return null

  const { description } = generalSettings

  const postList = data.nodeByUri?.contentNodes?.edges.map((el) => el.node)

  const archiveTitle = 'Faculty and Staff'

  return (
    <>
      <SEO seo={{ title: archiveTitle, description: description }} />
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <RichText className="archiveTitle" tag="h1">
            {archiveTitle}
          </RichText>

          <PostsList posts={postList} type="faculty" className="facultyList" />
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

const GET_FACULTY_QUERY = gql`
  ${FeaturedImage.fragments.entry}
  query GetFacultyPage(
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
        contentNodes(
          first: $first
          after: $after
          where: {
            orderby: {
              field: META_KEY
              order: ASC
              metaKeyField: "faculty_last"
            }
          }
        ) {
          edges {
            node {
              id
              contentTypeName
              ... on NodeWithTitle {
                title
              }
              date
              uri
              ...FeaturedImageFragment
              ... on NodeWithAuthor {
                author {
                  node {
                    name
                  }
                }
              }
              ... on FacultyMember {
                facultyFields {
                  faculty {
                    last
                    first
                    email
                    phone
                    position
                  }
                }
              }
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
  }
`

const GET_LAYOUT_QUERY = gql`
  ${BlogInfoFragment}

  query GetLayout {
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Archive.queries = [
  {
    query: GET_FACULTY_QUERY,
    variables: ({ uri }) => ({
      uri,
      first: appConfig.postsPerPage,
      after: ''
    })
  },
  {
    query: GET_LAYOUT_QUERY
  }
]

Archive.variables = ({ uri }) => {
  return {
    uri,
    first: appConfig.postsPerPage,
    after: ''
  }
}
