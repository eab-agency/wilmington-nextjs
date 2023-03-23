import { gql } from '@apollo/client'

const queryEventsListingAttributes = gql`
  query GET_EVENTSLISTING_ATTS($id: ID!) {
    event(id: $id, idType: DATABASE_ID) {
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

export default queryEventsListingAttributes
