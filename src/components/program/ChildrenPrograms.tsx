import ModalityIcons from '@/components/atoms/ModalityIcons/ModalityIcons'
import Link from 'next/link'
import React from 'react'

interface ChildrenProgramsProps {
  programs: any[]
  parentSlug: any
  parentDegreeType: any
}

export default function ChildrenPrograms({
  programs,
  parentSlug,
  parentDegreeType
}: ChildrenProgramsProps) {
  // get all programs that have an ancestor
  const programsWithAncestor = programs.filter((program) => {
    return program.ancestors?.nodes.length > 0
  })

  // if parentSlug is the same as ancestor
  // then show the program
  const programsWithAncestorFiltered = programsWithAncestor.filter(
    (program) => {
      return program.ancestors?.nodes[0].slug === parentSlug
    }
  )

  const programsAncestorSameDegreeTypeFiltered =
    programsWithAncestorFiltered.filter((program) => {
      const edges = program.degreeTypes?.edges
      if (edges && edges.length > 0) {
        return edges[0].node.name === parentDegreeType
      }
      return false
    })

  return (
    <>
      {programsAncestorSameDegreeTypeFiltered.map((program: any) => {
        return (
          <React.Fragment key={program.slug}>
            <tr className="concentration">
              <td>
                <Link href={program.uri} className="tableProgramTitle">
                  <h4>{program.title}</h4>
                </Link>
              </td>
              <td>
                <span aria-hidden="true" className="tableCellHead">
                  Modality:
                </span>
                <ModalityIcons modalities={program.modalities} />
              </td>
            </tr>
          </React.Fragment>
        )
      })}
    </>
  )
}
