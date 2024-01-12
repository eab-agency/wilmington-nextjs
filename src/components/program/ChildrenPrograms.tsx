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
  // if parentSlug is the same as ancestor
  // then show the program
  const programsWithAncestorFiltered = programs.filter((program) => {
    return program.ancestors?.nodes[0].slug === parentSlug
  })

  const programsAncestorSameDegreeTypeFiltered =
    programsWithAncestorFiltered.filter((program) => {
      const nodes = program.degreeTypes?.nodes
      if (nodes && nodes.length > 0) {
        return nodes[0].name === parentDegreeType
      }
      return false
    })

  const sortedPrograms = programsAncestorSameDegreeTypeFiltered
    .slice()
    .sort((a, b) => {
      return a.title.localeCompare(b.title)
    })

  return (
    <>
      {sortedPrograms.map((program: any) => {
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
