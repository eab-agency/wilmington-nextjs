import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import globalPostFields from '@/lib/wordpress/_query-partials/globalPostFields'
import seoPostFields from '@/lib/wordpress/_query-partials/seoPostFields'
import { gql } from '@apollo/client'

const children = `
   children {
      nodes {
        link
        slug
        ... on Program {
          id
          title
          uri
        }
      }
    }
`

const departmentsAndStudentOrgs = `
   departments {
      nodes {
        name
        programs {
          nodes {
            id
            title
            excerpt
            uri
            concentrationEnabled
            ${featuredImagePostFields}
            ancestors {
              edges {
                node {
                  slug
                }
              }
            }
          }
        }
      }
    }
  programOrgRelationship {
      programOrg {
        nodes {
            ... on StudentOrg {
              id
              title
              link
              orgFields {
                quickFacts
              }
            }
          }
      }
    }
`

// Fragment: retrieve single program fields.
export const singleProgramFragment = gql`
  fragment SingleProgramFields on Program {
    ${globalPostFields}
    blocksJSON
    excerpt
    ${seoPostFields}
    ${featuredImagePostFields}
    ${children}
    ${departmentsAndStudentOrgs}
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

// Query: retrieve page by specified identifier.
export const queryProgramChildrenById = gql`
  query GET_PROGRAM_CHILDREN_BY_ID(
    $id: ID!
    $idType: ProgramIdType = URI
    $imageSize: MediaItemSizeEnum = LARGE
  ) {
    program(id: $id, idType: $idType) {
      uri
      title
      ${featuredImagePostFields}
      ${children}
      ${departmentsAndStudentOrgs}
    }
  }
`

export default queryProgramById
