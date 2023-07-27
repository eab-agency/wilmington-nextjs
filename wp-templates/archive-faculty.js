import { SEO } from '@/components'
import { FacultyList } from '@/components/archive/FacultyList'
import RichText from '@/components/atoms/RichText'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql } from '@apollo/client'

export default function ArchiveFaculty(props) {
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
          <FacultyList className="facultyList" posts={contentNodes.nodes} />
        </div>
      </Layout>
    </>
  )
}

ArchiveFaculty.variables = ({ uri }) => {
  return { uri }
}

ArchiveFaculty.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query Archive($uri: String!, $imageSize: MediaItemSizeEnum = MEDIUM) {
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
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
