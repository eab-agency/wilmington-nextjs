/* eslint-disable camelcase */

import BlockFeaturedPrograms from '@/components/blocks/acf/BlockFeaturedPrograms/BlockFeaturedPrograms'
import FeaturedImage from '@/components/common/FeaturedImage'
import { gql, useQuery } from '@apollo/client'

export default function AcfFeaturedDept(props) {
  const attributes = props.attributes

  const { featured_depts } = JSON.parse(attributes?.data)

  // grap the featured departments
  const { loading, error, data } = useQuery(AcfFeaturedDept.query, {
    variables: { ids: featured_depts }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const featuredPrograms = data.departments.nodes.flatMap(
    (department) => department.programs.nodes
  )

  // don't show programs that are a child program page
  const filteredPrograms = featuredPrograms.filter(
    (program) => program.ancestors === null
  )

  return <BlockFeaturedPrograms featuredPrograms={filteredPrograms} />
}

// fragment to get the data from the block
AcfFeaturedDept.fragments = {
  entry: gql`
    fragment AcfFeaturedDeptFragment on AcfFeaturedDept {
      attributes {
        data
      }
    }
  `,
  key: `AcfFeaturedDeptFragment`
}

AcfFeaturedDept.query = gql`
  ${FeaturedImage.fragments.entry}
  query getFeaturedDepartmens(
    $ids: [ID!]!
    $imageSize: MediaItemSizeEnum = MEDIUM
    $programLimit: Int = 2
  ) {
    departments(where: { include: $ids }) {
      nodes {
        id
        link
        uri
        programs(first: $programLimit) {
          nodes {
            excerpt
            title
            uri
            id
            ancestors {
              nodes {
                id
              }
            }
            ...FeaturedImageFragment
          }
        }
      }
    }
  }
`

AcfFeaturedDept.displayName = 'AcfFeaturedDept'
