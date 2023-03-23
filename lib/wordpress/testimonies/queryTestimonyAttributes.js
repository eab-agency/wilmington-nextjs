import { gql } from '@apollo/client'

const queryTestimonyAttributes = gql`
  query GET_TESTIMONY_ATTS($id: ID!) {
    testimonial(id: $id, idType: DATABASE_ID) {
        contentTypeName
          id
          databaseId
          title
          uri
          content
          testimonialFields {
            testimonial {
              desc
              first
              last
            }
          }
          featuredImage {
      node {
      mediaDetails {
        height
        width
        sizes {
          height
          name
          sourceUrl
          width
        }
      }
      }
          }
    }
  }
`

export const queryTestimonies = gql`
query GET_TESTIMONIALS {
  testimonials(first: 100) {
    nodes {
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
      testimonialFields {
        testimonial {
          desc
          first
          last
        }
      }
    }
  }
}
`

export default queryTestimonyAttributes
