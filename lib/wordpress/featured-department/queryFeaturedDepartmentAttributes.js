import { gql } from '@apollo/client'

const queryFeaturedDepartmentAttributes = gql`
  query GET_FEATUREDDEPARTMENT_ATTS($id: ID!) {
    department(id: $id, idType: DATABASE_ID) {
  link
    uri
       programs {
      nodes {
        excerpt
        title
        uri
        id
        featuredImage {
          node {
            altText
            mediaItemUrl
            mediaDetails {
              height
              width
            }
          }
        }
      }
    }
    }
  }
`

export default queryFeaturedDepartmentAttributes
