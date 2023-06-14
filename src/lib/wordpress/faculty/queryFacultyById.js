import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import facultyAcfFields from '@/lib/wordpress/_query-partials/facultyAcfFields'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import globalPostFields from '@/lib/wordpress/_query-partials/globalPostFields'
import seoPostFields from '@/lib/wordpress/_query-partials/seoPostFields'
import { gql } from '@apollo/client'

// Fragment: retrieve single page fields.
export const singleFacultyFragment = gql`
  fragment SingleFacultyFields on Faculty {
     ${globalPostFields}
    blocksJSON
    excerpt
     departments {
      nodes {
        name
      }
    }
      facultyToProgramRelationship {
      programfaculty {
        ... on Program {
          title
          id
          excerpt
          uri
          programFields {
            program {
              degree
              degreeTitle
            }
          }
        }
      }
    }
    ${facultyAcfFields}
    ${seoPostFields}
    ${featuredImagePostFields}
  }
`

export const singleFacultyFragmentPartial = gql`
  fragment SingleFacultyFieldsPartial on Faculty {
     ${globalPostFields}
    excerpt
    ${facultyAcfFields}
    ${featuredImagePostFields}
  }
`

// Query: retrieve post by specified identifier.
const queryFacultyById = gql`
  query GET_FACULTY_BY_ID(
     $id: ID!
    $idType: FacultyIdType = SLUG
    $imageSize: MediaItemSizeEnum = MEDIUM
  ) {
  ${defaultPageData}
  faculty(id: $id, idType: $idType) {
    ...SingleFacultyFields
  }
}
${singleFacultyFragment}
`

export default queryFacultyById

export const queryFacultyPartialById = gql`
  query GET_FACULTY_PARTIAL_BY_ID(
    $id: ID!
    $idType: FacultyIdType = SLUG
    $imageSize: MediaItemSizeEnum = MEDIUM
  ) {
    faculty(id: $id, idType: $idType) {
      ...SingleFacultyFieldsPartial
    }
  }
  ${singleFacultyFragmentPartial}
`
