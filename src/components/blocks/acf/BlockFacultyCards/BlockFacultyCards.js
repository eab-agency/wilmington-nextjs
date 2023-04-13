/* eslint-disable camelcase */
import React from 'react'
import FacultyCard from '@/components/molecules/FacultyCard/FacultyCard'

/**
 * Faculty Block
 *
 * The acf Faculty Block from colab.
 *
 * @param  {object}  props              Faculty component props.
 * @return {Element}                    The Card component.
 */

export default function BlockFacultyCards({ facultyData }) {
  // if facultyData is null or undefined, return null
  if (!facultyData) {
    return null
  }

  const facultyRestructured = facultyData.map((faculty) => {
    const { email, first, last, phone, position } =
      faculty?.facultyFields?.faculty
    return {
      email: email,
      first: first,
      last: last,
      phone: phone,
      title: `${first} ${last}`,
      link: faculty.uri,
      image: faculty.featuredImage?.node,
      description: position
    }
  })

  return (
    <>
      {facultyRestructured.map((faculty, index) => {
        return <FacultyCard {...faculty} key={index} />
      })}
    </>
  )
}
