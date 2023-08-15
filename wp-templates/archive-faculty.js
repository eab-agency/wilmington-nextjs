import { SEO } from '@/components'
import LoadMore from '@/components/LoadMore'
import { FacultyList } from '@/components/archive/FacultyList'
import RichText from '@/components/atoms/RichText'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql, useQuery } from '@apollo/client'

export default function ArchiveFaculty(props) {
  const { uri, name, __typename } = props.data.nodeByUri
  const { data, loading, fetchMore } = useQuery(ArchiveFaculty.query, {
    variables: ArchiveFaculty.variables({ uri })
  })

  if (loading) {
    return <></>
  }
  const { description: siteDescription } = props?.data?.generalSettings ?? {}
  const postList = props.data.nodeByUri?.contentNodes?.edges.map(
    (el) => el.node
  )

  const archiveTitle = `Wilmington College ${data.label}`

  return (
    <>
      <SEO seo={{ title: archiveTitle, description: siteDescription }} />
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <RichText className="archiveTitle" tag="h1">
            Faculty and Staff
          </RichText>
          {data.description && <RichText>{data.description}</RichText>}
          <FacultyList className="facultyList" posts={postList} />
          <LoadMore
            className="text-center"
            hasNextPage={data.nodeByUri?.contentNodes?.pageInfo.hasNextPage}
            endCursor={data.nodeByUri?.contentNodes?.pageInfo.endCursor}
            isLoading={loading}
            fetchMore={fetchMore}
          />
        </div>
      </Layout>
    </>
  )
}

ArchiveFaculty.variables = ({ uri }) => {
  return {
    uri,
    first: 10,
    after: ''
  }
}

ArchiveFaculty.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query Archive(
    $uri: String!
    $first: Int!
    $after: String!
    $imageSize: MediaItemSizeEnum = MEDIUM
  ) {
    nodeByUri(uri: $uri) {
      __typename
      id
      uri
      ... on ContentType {
        name
        description
        label
        contentNodes(first: $first, after: $after) {
          edges {
            node {
              id
              uri
              ... on NodeWithTitle {
                title
              }
              ... on FacultyMember {
                facultyFields {
                  faculty {
                    email
                    phone
                    position
                  }

                }
                ...FeaturedImageFragment
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
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
