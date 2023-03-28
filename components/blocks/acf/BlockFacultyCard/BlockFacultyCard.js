/* eslint-disable camelcase */
import React from 'react';
import FacultyCard from '@/components/molecules/FacultyCard/FacultyCard';

/**
 * Athlete Block
 *
 * The acf Athlete Block from colab.
 *
 * @param  {object}  props              Athlete component props.
 * @return {Element}                    The Card component.
 */


export default function BlockFaculty(props) {
  const { facultyData } = props

  return (
    // map over facultyData only  if facultyData is not null
    facultyData?.map((faculty, index) => {
      return (
        <FacultyCard
          key={index}
          title={`${faculty.facultyFields.faculty.first} ${faculty.facultyFields.faculty.last}`}
          description={faculty.facultyFields.faculty.position}
          image={faculty.featuredImage.node}
          link={faculty.link}
          phone={faculty.facultyFields.faculty.phone}
          email={faculty.facultyFields.faculty.email}
        />
      )
    })
  )
}
