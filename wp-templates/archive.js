import { SEO } from '@/components'
import { PostsList } from '@/components/archive/PostsList'
import RichText from '@/components/atoms/RichText'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql } from '@apollo/client'

export default function Archive(props) {
  const { label, description, contentNodes } = props.data.nodeByUri

  const { description: siteDescription } = props?.data?.generalSettings ?? {}

  const archiveTitle = `Wilmington College ${label}`

  return (
    <>
      <SEO seo={{ title: archiveTitle, description: siteDescription }} />
      <Layout className="thelayoutclass">
        <div className="inner-wrap archive">
          <RichText className="archiveTitle" tag="h1">
            {label}
          </RichText>
          {description && <RichText>{description}</RichText>}
          <PostsList className="archiveList" posts={contentNodes.nodes} />
        </div>
      </Layout>
    </>
  )
}

Archive.variables = ({ uri }, ctx) => {
  return { uri }
}

Archive.query = gql`
  ${BlogInfoFragment}
  query Archive($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      uri
      ... on ContentType {
        label
        __typename
        uri
        description

        contentNodes(
          first: 100
          where: { orderby: { field: TITLE, order: ASC } }
        ) {
          nodes {
            id
            uri
            ... on NodeWithExcerpt {
              excerpt
            }
            ... on NodeWithContentEditor {
              content
            }
            ... on NodeWithTitle {
              title
            }
            ... on StudentOrg {
              orgFields {
                quickFacts
              }
              featuredImage {
                node {
                  sourceUrl(size: THUMBNAIL)
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
