import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import { gql } from '@apollo/client'

const queryEventsListingAttributes = gql`
  query GET_EVENT_AND_CATEGORY_ATTS(
    $id: ID!,
    $imageSize: MediaItemSizeEnum = LARGE
    ) {
    event(id: $id, idType: DATABASE_ID) {
      link
      uri
      date
      title
      ${featuredImagePostFields}
    }
  }
`

export default queryEventsListingAttributes

export const queryEventsCategoryAttributes = gql`
  query GET_EVENT_AND_CATEGORY_ATTS(
    $category: ID!,
    $imageSize: MediaItemSizeEnum = LARGE
    ) {
  eventCategory(id: $category, idType: DATABASE_ID) {
      events {
        nodes {
          link
          uri
          date
          title
          databaseId
          ${featuredImagePostFields}
        }
      }
    }
  }
`

export const queryAllEventsAttributes = gql`
  query GET_ALL_EVENTS(
    $imageSize: MediaItemSizeEnum = LARGE
  ){
    events(first: 4, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        link
        uri
        date
        title
        databaseId
        ${featuredImagePostFields}
      }
    }
  }
`
