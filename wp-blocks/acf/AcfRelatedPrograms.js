import BlockRelatedPrograms from '@/components/blocks/acf/BlockRelatedPrograms/BlockRelatedPrograms'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import { gql } from '@apollo/client'

/**
 * Athlete Block
 *
 * The acf Athlete Block from colab.
 *
 * @param  {object}  props              Athlete component props.
 * @return {Element}                    The Card component.
 */

export default function AcfRelatedPrograms() {
  // flatten all the programs in the needToFlatten array
  const { departments } = useWordPressContext()

  if (!departments) {
    return null
  }

  const flattenedPrograms = departments.reduce((acc, item) => {
    return [...acc, ...item.programs.nodes]
  }, [])

  return <BlockRelatedPrograms departments={flattenedPrograms} />
}

export const RelatedProgramsFragment = gql`
  fragment RelatedProgramsFragment on Program {
    departments {
      nodes {
        id
        programs {
          nodes {
            title
            excerpt
            uri
          }
        }
      }
    }
  }
`

AcfRelatedPrograms.displayName = 'AcfRelatedPrograms'
