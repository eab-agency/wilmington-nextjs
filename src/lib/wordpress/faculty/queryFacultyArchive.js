import archivePageInfo from '@/lib/wordpress/_query-partials/archivePageInfo'
import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import globalPostFields from '@/lib/wordpress/_query-partials/globalPostFields'
import facultyAcfFields from '@/lib/wordpress/_query-partials/facultyAcfFields'
import {gql} from '@apollo/client'

// Fragment: retrieve archive post fields.
export const archiveFacultyFragment = gql`
  fragment ArchiveFacultyFields on FacultyMember {
    ${globalPostFields}
    excerpt
    ${facultyAcfFields}
    ${featuredImagePostFields}
  }
`

// Query partial: retrieve archive fields.
export const archiveFaculty = `
  faculty(
    first: $first
    last: $last
    after: $after
    before: $before
    where: {orderby: {field: $orderBy, order: $order}}
  ) {
    ${archivePageInfo}
    edges {
      node {
        ...ArchiveFacultyFields
      }
    }
  }
`

// Query: retrieve faculty archive.
const queryFacultyArchive = gql`
  query GET_FACULTY_ARCHIVE(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $orderBy: PostObjectsConnectionOrderbyEnum = DATE
    $order: OrderEnum = DESC
    $imageSize: MediaItemSizeEnum = THUMBNAIL
  ) {
    ${defaultPageData}
    ${archiveFaculty}
  }
  ${archiveFacultyFragment}
`

export default queryFacultyArchive
