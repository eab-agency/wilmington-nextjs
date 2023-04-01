import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import { gql } from '@apollo/client'

const queryNewsListingAttributes = gql`
  query GET_NEWSLISTING_ATTS(
    $id: ID!,
    $imageSize: MediaItemSizeEnum = LARGE
) {
    article(id: $id, idType: DATABASE_ID) {
  link
    uri
    date
    title
    ${featuredImagePostFields}
    }
  }
`

export default queryNewsListingAttributes
