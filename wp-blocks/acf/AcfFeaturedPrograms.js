/* eslint-disable camelcase */

import Preloader from '@/components/atoms/Preloader'
import BlockFeaturedPrograms from '@/components/blocks/acf/BlockFeaturedPrograms/BlockFeaturedPrograms'
import FeaturedImage from '@/components/common/FeaturedImage'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'

export default function AcfFeaturedPrograms(props) {
  const attributes = props.attributes

  const { featured_programs } = JSON.parse(attributes?.data)

  // grab the featured departments
  const { loading, error, data } = useQuery(AcfFeaturedPrograms.query, {
    variables: { ids: featured_programs }
  })

  if (loading) return <Preloader />
  if (error) return <p>Error: {error.message}</p>

  return <BlockFeaturedPrograms featuredPrograms={data.programs.nodes} />
}
// fragment to get the data from the block
AcfFeaturedPrograms.fragments = {
  entry: gql`
    fragment AcfFeaturedProgramsFragment on AcfFeaturedPrograms {
      attributes {
        data
      }
    }
  `,
  key: `AcfFeaturedProgramsFragment`
}

AcfFeaturedPrograms.query = gql`
  ${FeaturedImage.fragments.entry}
  query getFeaturedDepartmens(
    $ids: [ID!]!
    $imageSize: MediaItemSizeEnum = DEPT_CARD
    $programLimit: Int = 5
  ) {
    programs(where: { in: $ids }, first: $programLimit) {
      nodes {
        excerpt
        title
        uri
        id
        ancestors {
          nodes {
            id
            slug
          }
        }
        ...FeaturedImageFragment
      }
    }
  }
`

AcfFeaturedPrograms.displayName = 'AcfFeaturedPrograms'
