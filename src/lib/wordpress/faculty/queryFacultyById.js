import { gql } from '@apollo/client'
import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import globalPostFields from '@/lib/wordpress/_query-partials/globalPostFields'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import facultyAcfFields from '@/lib/wordpress/_query-partials/facultyAcfFields'
import seoPostFields from '@/lib/wordpress/_query-partials/seoPostFields'


// Fragment: retrieve single page fields.
export const singleFacultyFragment = gql`
  fragment SingleFacultyFields on FacultyMember {
     ${globalPostFields}
    blocksJSON
    excerpt
     departments {
      nodes {
        name
      }
    }
    ${facultyAcfFields}
    ${seoPostFields}
    ${featuredImagePostFields}
  }
`

// Query: retrieve post by specified identifier.
const queryFacultyById = gql`
  query GET_FACULTY_BY_ID(
     $id: ID!
    $idType: FacultyMemberIdType = URI
    $imageSize: MediaItemSizeEnum = MEDIUM
  ) {
  ${defaultPageData}
  facultyMember(id: $id, idType: $idType) {
    ...SingleFacultyFields
  }
}
${singleFacultyFragment}
`

export default queryFacultyById
