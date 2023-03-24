import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import { gql } from '@apollo/client'

// Fragment: retrieve single post fields.
const singleFacultyFragment = gql`
  fragment SingleFacultyFields on FacultyMember {
       databaseId
       link
    facultyFields {
      faculty {
        first
        last
        phone
        email
        position
      }
    }
    ${featuredImagePostFields}
  }
`
// Query: retrieve post by specified identifier.
const queryFacultyById = gql`
  query GET_FACULTY_BY_ID(
    $id: ID!
    $imageSize: MediaItemSizeEnum = LARGE

  ) {
    facultyMember(id: $id, idType: DATABASE_ID) {
        ...SingleFacultyFields
    }
  },
    ${singleFacultyFragment}
`

export default queryFacultyById
