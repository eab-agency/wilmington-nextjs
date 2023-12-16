'use client'

import Link from '@/components/common/Link'
import React, { useEffect, useState } from 'react'
import { FaLaptop, FaSchool } from 'react-icons/fa'

const DepartmentSingle = ({ department }) => {
  const {
    name,
    uri,
    description,
    programs,
    departmentFields: { deptImage }
  } = department

  // get programFields degreeType and group programs by degreeType
  const getProgramDegreeType = (program) => {
    // const degreeType = program.programFields.program.degree
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

  // filter programs that are not child program pages
  // const parentPrograms = programs.nodes.filter(
  //   (program) => program.ancestors === null
  // )
  const parentPrograms = programs.nodes

  const groupedPrograms = parentPrograms.reduce((acc, program) => {
    const degreeType = getProgramDegreeType(program)

    //return all programs that have the same degree type
    if (!acc[degreeType]) {
      acc[degreeType] = []
    }

    acc[degreeType].push(program)

    return acc
  }, {})

  // get parentProgram programFields location
  const getParentProgramLocation = (parentProgram) => {
    const modalities = parentProgram.modalities

    return (
      <div className="modalityList">
        {modalities && modalities.includes('On Campus') && (
          <div className="modalityCard">
            <FaSchool /> On Campus
          </div>
        )}
        {modalities && modalities.includes('Online') && (
          <div className="modalityCard">
            <FaLaptop /> Online
          </div>
        )}
      </div>
    )
  }

  return (
    <section key={name} className="department">
      <h2>{name} Degrees</h2>
      <table className="programTable">
        <thead>
          <tr>
            <th>Degrees</th>
            <th>Modality</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedPrograms).map((degreeType) => (
            <div key={degreeType}>
              {groupedPrograms[degreeType].map((program) => (
                <tr key={program.uri}>
                  <td>
                    {' '}
                    <Link href={program.uri} className="tableProgramTitle">
                      <h3>{program.title} </h3>
                    </Link>
                    <small>{degreeType}</small>
                  </td>
                  <td>
                    <span aria-hidden="true" className="tableCellHead">
                      Modality:
                    </span>
                    {getParentProgramLocation(program)}
                  </td>
                </tr>
              ))}
            </div>
          ))}
        </tbody>
      </table>
    </section>
  )
}

const DepartmentListing = ({ department }) => {
  // if deparetment is null, undefined, or empty object, return null
  if (!department || Object.keys(department).length === 0) {
    return null
  }
  // if department is an array, map over the array and return a DepartmentSingle for each department
  if (Array.isArray(department)) {
    return department.map((department) => (
      <DepartmentSingle key={department.uri} department={department} />
    ))
  } else {
    // return a single DepartmentSingle
    return <DepartmentSingle department={department} />
  }
}

const DepartmentSelector = ({
  programDepartments,
  handleDepartmentChange,
  selectedDepartment
}) => {
  const handleDropdownChange = (e) => {
    handleDepartmentChange(e.target.value)
  }

  return (
    <select onChange={handleDropdownChange} value={selectedDepartment}>
      <option value="ALL">Show All</option>
      {programDepartments.map((department) => (
        <option key={department.uri} value={department.name}>
          {department.name}
        </option>
      ))}
    </select>
  )
}

export default function BlockDepartmentSelect({ programDepartments }) {
  const [selectedDepartment, setSelectedDepartment] = React.useState('')
  const [selectedDepartmentInfo, setSelectedDepartmentInfo] =
    useState(programDepartments)

  // use useEffect to set the selectedDepartmentInfo, selectedDepartment values can be null, undefined, ALL, or a department name
  useEffect(() => {
    if (selectedDepartment === 'ALL') {
      setSelectedDepartmentInfo(programDepartments)
    } else if (selectedDepartment) {
      const department = programDepartments.find(
        (department) => department.name === selectedDepartment
      )
      setSelectedDepartmentInfo(department)
    }
  }, [selectedDepartment, programDepartments])

  const handleDepartmentChange = (selectedValue) => {
    setSelectedDepartment(selectedValue)
  }

  return (
    <section className="departmentSelectorSection">
      <div className="group">
        <div className="intro">
          <h2>Choose Your Field of Interest</h2>
          <p>
            Discover the perfect academic program for your future success. Find
            the program that aligns with your goals and aspirations with just a
            few clicks. Start your educational journey today.
          </p>
        </div>
        <div className="departmentSelector">
          <DepartmentSelector
            programDepartments={programDepartments}
            handleDepartmentChange={handleDepartmentChange}
            selectedDepartment={selectedDepartment}
          />
        </div>
      </div>
      <div className="departmentResults">
        <div className="departmentsContainer">
          <DepartmentListing department={selectedDepartmentInfo} />
        </div>
      </div>
    </section>
  )
}
