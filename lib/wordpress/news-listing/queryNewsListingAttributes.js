import { gql } from '@apollo/client'

const queryNewsListingAttributes = gql`
  query GET_NEWSLISTING_ATTS($id: ID!) {
    article(id: $id, idType: DATABASE_ID) {
  link
    uri
    date
    title
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
`

export default queryNewsListingAttributes
