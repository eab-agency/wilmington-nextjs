import {gql} from '@apollo/client'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'

const queryFeaturedDepartmentAttributes = gql`
  query GET_FEATUREDDEPARTMENT_ATTS(
    $id: ID!,
    $imageSize: MediaItemSizeEnum = LARGE
) {
    department(id: $id, idType: DATABASE_ID) {
  link
    uri
       programs {
      nodes {
        excerpt
        title
        uri
        id
        ${featuredImagePostFields}
      }
    }
    }
  }
`

export default queryFeaturedDepartmentAttributes
