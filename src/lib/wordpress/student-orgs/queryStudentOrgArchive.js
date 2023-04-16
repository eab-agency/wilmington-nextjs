import archivePageInfo from '@/lib/wordpress/_query-partials/archivePageInfo'
import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import globalPostFields from '@/lib/wordpress/_query-partials/globalPostFields'
import { gql } from '@apollo/client'

// Fragment: retrieve archive post fields.
export const archiveStudentOrgFragment = gql`
  fragment ArchiveStudentOrgFields on StudentOrg {
    ${globalPostFields}
    excerpt
    orgFields {
        quickFacts
    }
    ${featuredImagePostFields}
  }
`

// Query partial: retrieve archive fields.
export const archiveStudentOrg = `
  studentOrgs(
    last: 1000
    after: $after
    before: $before
    where: {orderby: {field: $orderBy, order: $order}}
  ) {
    ${archivePageInfo}
    edges {
      node {
        ...ArchiveStudentOrgFields
      }
    }
  }
`

// Query: retrieve student org archive.
const queryStudentOrgArchive = gql`
  query GET_STUDENTORG_ARCHIVE(
    $after: String
    $before: String
    $orderBy: PostObjectsConnectionOrderbyEnum = DATE
    $order: OrderEnum = DESC
    $imageSize: MediaItemSizeEnum = THUMBNAIL
  ) {
    ${defaultPageData}
    ${archiveStudentOrg}
  }
  ${archiveStudentOrgFragment}
`

export default queryStudentOrgArchive
