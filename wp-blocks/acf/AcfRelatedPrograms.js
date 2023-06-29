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
  const wordpressContext = useWordPressContext()

  if (!wordpressContext || !wordpressContext.departments) {
    return null
  }

  // flatten all the programs in the needToFlatten array
  const { departments, currentProgramId } = wordpressContext

  if (!departments) {
    return null
  }

  // flatten all the programs out of their departments
  const flattenedPrograms = departments.reduce((acc, item) => {
    return [...acc, ...item.programs.nodes]
  }, [])

  // filter out the current program from the flattened programs
  const filteredPrograms = flattenedPrograms.filter(
    (program) => program.id !== currentProgramId
  )

  return <BlockRelatedPrograms departments={filteredPrograms} />
}

export const RelatedProgramsFragment = gql`
  fragment RelatedProgramsFragment on Program {
    currentProgramId: id
    departments {
      nodes {
        id
        programs {
          nodes {
            id
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
