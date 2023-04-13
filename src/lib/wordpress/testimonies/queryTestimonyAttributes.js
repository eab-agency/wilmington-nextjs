import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import {gql} from '@apollo/client'

const queryTestimonyAttributes = gql`
  query GET_TESTIMONY_ATTS(
    $id: ID!,
    $imageSize: MediaItemSizeEnum = LARGE
) {
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
        ${featuredImagePostFields}
    }
  }
`

export const queryTestimonies = gql`
query GET_TESTIMONIALS(
  $imageSize: MediaItemSizeEnum = LARGE
) {
  testimonials(first: 100) {
    nodes {
      databaseId
      ${featuredImagePostFields}
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
