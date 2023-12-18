import ModalityIcons from '@/components/atoms/ModalityIcons/ModalityIcons'
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

    //return all programs that have the same degree type and don't have a parent

    if (!program.ancestors?.nodes.length) {
      if (!acc[degreeType]) {
        acc[degreeType] = []
      }
      acc[degreeType].push(program)
    }

    return acc
  }, {})

  return (
    <div className="programDirectory">
      <h2>ProgramDirectory</h2>
      {Object.keys(groupedPrograms).map((degreeType) => (
        <section key={degreeType} className="programTableContainer">
          <h3 className="degreeTypeName">{degreeType}s</h3>
          <table className="programTable">
            <thead>
              <tr>
                <th>Degrees</th>
                <th>Modality</th>
              </tr>
            </thead>
            <tbody>
              {groupedPrograms[degreeType].map((program: any) => (
                <>
                  <tr key={program.slug} className="parentProgram">
                    <td>
                      <Link href={program.uri} className="tableProgramTitle">
                        <h4>{program.title} </h4>
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
                  />
                </>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {programs.filter((program: any) => !program.degreeTypes.edges.length)
        .length > 0 && (
          <>
            <h3 className="degreeTypeName">No Degree type</h3>
            <table className="programTable" key="NoDegreeType">
              <thead>
                <tr>
                  <th>Degrees</th>
                  <th>Modality</th>
                </tr>
              </thead>
              <tbody>
                {programs
                  .filter((program: any) => !program.degreeTypes.edges.length)
                  .map((program: any) => (
                    <tr key={program.slug}>
                      <td>
                        <Link href={program.uri} className="tableProgramTitle">
                          <h4>{program.title} </h4>
                        </Link>
                      </td>
                      <td>
                        <span aria-hidden="true" className="tableCellHead">
                          Modality:
                        </span>
                        <ModalityIcons modalities={program.modalities} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
    </div>
  )
}
