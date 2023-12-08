'use client'

// import Image from '@/components/atoms/Image'
import Link from '@/components/common/Link'
// import ResultProgramCard from '@/components/molecules/ResultProgramCard'
// import { className } from 'classnames/bind'
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

  // filter programs that are not child program pages
  const parentPrograms = programs.nodes.filter(
    (program) => program.ancestors === null
  );

  // filter child programs with concentrationEnabled set to true
  const childPrograms = programs.nodes.filter(
    (program) => program.ancestors !== null && program.concentrationEnabled
  );

  // get childProgram names for a given parentProgram
  const getChildProgramNamesList = (parentProgram) => {
    const childNames = childPrograms
      .filter(childProgram =>
        childProgram.ancestors.nodes.some(ancestor => ancestor.slug === parentProgram.slug)
      )
      .map(childProgram => <li key={childProgram.uri}>{childProgram.title}</li>);

    return childNames.length > 0 ? <ul>{childNames}</ul> : null;
  }

  // get parentProgram programFields location
  const getParentProgramLocation = (parentProgram) => {
    const locations = parentProgram.programFields.program.location

    return (

      <div className='modalityList'>
        {locations && locations.includes('wilmington') && (
          <div className='modalityCard'><FaSchool /> On Campus</div>
        )}
        {locations && locations.includes('online') && (
          <div className='modalityCard'><FaLaptop /> Online</div>
        )}
      </div>
    )

  }

  return (
    <section key={name} className="department">
      {parentPrograms.length > 0 && (
        <>
          <table className='programTable'>
            <thead>
              <tr>
                <th><h2>{name} Degrees</h2></th>
                <th>Concentrations</th>
                <th>Modality</th>
              </tr>
            </thead>
            <tbody>
              {parentPrograms.map((program) => (
                <tr key={program.uri}>
                  <td> <Link href={program.uri}>
                    <h3>{program.title}</h3>
                  </Link></td>
                  <td>
                    <span aria-hidden="true" className="tableCellHead">Concentrations</span>
                    {getChildProgramNamesList(program)}
                  </td>
                  <td>
                    <span aria-hidden="true" className="tableCellHead">Modality</span>
                    {getParentProgramLocation(program)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
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
