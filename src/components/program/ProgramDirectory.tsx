import ModalityIcons from '@/components/atoms/ModalityIcons/ModalityIcons'
import { randomInt } from 'crypto'
import Link from 'next/link'
import React from 'react'
import ChildrenPrograms from './ChildrenPrograms'

interface ProgramDirectoryProps {
  programs: any[]
}

export default function ProgramDirectory({ programs }: ProgramDirectoryProps) {
  // ===============

  const getProgramDegreeType = (program: any) => {
    let degreeTypeName = ''
    if (
      program.degreeTypes &&
      program.degreeTypes.edges &&
      program.degreeTypes.edges.length > 0
    ) {
      degreeTypeName = program.degreeTypes.edges[0].node.name
    }

    return degreeTypeName
  }

  const groupedPrograms = programs.reduce((acc, program) => {
    const degreeType = getProgramDegreeType(program)

    if (degreeType) {
      if (
        !program.ancestors?.nodes.length ||
        (program.ancestors?.nodes.length &&
          program.concentrationEnabled === false)
      ) {
        if (!acc[degreeType]) {
          acc[degreeType] = []
        }
        acc[degreeType].push(program)
      }
    }

    return acc
  }, {})

  // enforce degreeTypeOrder for programs that don't have a degreeTypeOrder
  programs.forEach((program) => {
    if (program.degreeTypes?.edges?.length > 0) {
      if (!program.degreeTypes.edges[0].node.degreeTypeOrder) {
        program.degreeTypes.edges[0].node.degreeTypeOrder = 100
      }
    }
  })

  // sort programs within each degree type group by degreeTypeOrder
  Object.keys(groupedPrograms).forEach((degreeType) => {
    groupedPrograms[degreeType].sort((a: any, b: any) => {
      const orderA = a.degreeTypes.edges[0]?.node.degreeTypeOrder || 100
      const orderB = b.degreeTypes.edges[0]?.node.degreeTypeOrder || 100
      return orderA - orderB
    })
  })

  // sort degree types based on minimum degreeTypeOrder
  const sortedDegreeTypes = Object.keys(groupedPrograms).sort((a, b) => {
    const minOrderA = Math.min(
      ...groupedPrograms[a].map(
        (program: any) =>
          program.degreeTypes.edges[0]?.node.degreeTypeOrder || 100
      )
    )
    const minOrderB = Math.min(
      ...groupedPrograms[b].map(
        (program: any) =>
          program.degreeTypes.edges[0]?.node.degreeTypeOrder || 100
      )
    )
    return minOrderA - minOrderB
  })

  return (
    <div className="programDirectory">
      {sortedDegreeTypes.map((degreeType) => (
        <React.Fragment key={degreeType}>
          <section className="programTableContainer">
            <h2 className="degreeTypeName">{degreeType}</h2>
            <table className="programTable">
              <thead>
                <tr>
                  <th>Degrees</th>
                  <th>Modality</th>
                </tr>
              </thead>
              <tbody>
                {groupedPrograms[degreeType].map((program: any) => (
                  <React.Fragment key={program.slug}>
                    <tr className="parentProgram">
                      <td>
                        <Link href={program.uri} className="tableProgramTitle">
                          <h3>{program.title}</h3>
                        </Link>
                      </td>
                      <td>
                        <span aria-hidden="true" className="tableCellHead">
                          Modality:
                        </span>
                        <ModalityIcons modalities={program.modalities} />
                      </td>
                    </tr>
                    <ChildrenPrograms
                      programs={programs}
                      parentSlug={program.slug}
                      parentDegreeType={degreeType}
                    />
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </section>
        </React.Fragment>
      ))}
    </div>
  )
}
