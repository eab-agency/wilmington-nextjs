import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import globalPostFields from '@/lib/wordpress/_query-partials/globalPostFields'
import seoPostFields from '@/lib/wordpress/_query-partials/seoPostFields'
import { gql } from '@apollo/client'

// Fragment: retrieve single page fields.
export const singleProgramFragment = gql`
  fragment SingleProgramFields on Program {
    ${globalPostFields}
    blocksJSON
    excerpt
    ${seoPostFields}
    ${featuredImagePostFields}
     departments {
      nodes {
        name
        programs {
          nodes {
            id
            title
            excerpt
            uri
            ${featuredImagePostFields}
          }
        }
      }
    }
  }
`

// Query: retrieve page by specified identifier.
const queryProgramById = gql`
  query GET_PROGRAM_BY_ID(
    $id: ID!
    $idType: ProgramIdType = URI
    $imageSize: MediaItemSizeEnum = LARGE
  ) {
    ${defaultPageData}
    program(id: $id, idType: $idType) {
      ...SingleProgramFields
      revisions(first: 1, where: {orderby: {field: DATE, order: DESC}}) {
        edges {
          node {
            ${globalPostFields}
            blocksJSON
            excerpt
          }
        }
      }
    }
  }
  ${singleProgramFragment}
`

export default queryProgramById
