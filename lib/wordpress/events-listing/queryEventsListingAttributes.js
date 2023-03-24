import { gql } from '@apollo/client'

const queryEventsListingAttributes = gql`
  query GET_EVENT_AND_CATEGORY_ATTS($id: ID!, $category: ID!) {
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
`;

export default queryEventsListingAttributes;

export const queryEventsCategoryAttributes = gql`
  query GET_EVENT_AND_CATEGORY_ATTS($category: ID!) {
  eventCategory(id: $category, idType: DATABASE_ID) {
      events {
        nodes {
          link
          uri
          date
          title
          databaseId
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
`;