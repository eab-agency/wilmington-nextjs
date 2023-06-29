'use client'

import Image from '@/components/atoms/Image'
import Link from '@/components/common/Link'
import RelatedProgramCard from '@/components/molecules/RelatedProgramCard'
import React, { useEffect, useState } from 'react'

const DepartmentSingle = ({ department }) => {
  const {
    name,
    uri,
    description,
    programs,
    departmentFields: { deptIcon, deptImage }
  } = department

  // don't show programs that are a child program page
  const filteredPrograms = programs.nodes.filter(
    (program) => program.ancestors === null
  )

  return (
    <div>
      <article key={name} className="department">
        {deptImage && (
          <Image
            url={deptImage.sourceUrl}
            alt={deptImage.altText}
            imageMeta={{ mediaDetails: deptImage.mediaDetails }}
          />
        )}
        <h2>
          <Link href={uri}>{name}</Link>
        </h2>
        <p>{description}</p>
        {filteredPrograms.length > 0 && (
          <>
            <h3>Programs</h3>
            <ul>
              {filteredPrograms.map((program) => (
                <li key={program.uri}>
                  <RelatedProgramCard
                    title={program.title}
                    link={program.uri}
                    excerpt={program.excerpt}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
    </div>
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
      <option value="DEFAULT">Choose an area of study</option>
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
  const [selectedDepartmentInfo, setSelectedDepartmentInfo] = useState({})

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
        <DepartmentListing department={selectedDepartmentInfo} />
      </div>
    </section>
  )
}
