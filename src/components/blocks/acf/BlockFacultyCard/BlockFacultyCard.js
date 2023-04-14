/* eslint-disable camelcase */

import FacultyCard from '@/components/molecules/FacultyCard/FacultyCard'

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

  // TODO: fix it so data doesn't come back as null value, but as an empty array
  if (
    !Array.isArray(facultyData) ||
    !facultyData.length ||
    facultyData.includes(null)
  ) {
    return null
  }

  return (
    // map over facultyData only  if facultyData is not null
    facultyData?.map((faculty, index) => {
      let fullTitle = ''

      if (faculty && faculty.facultyFields && faculty.facultyFields.faculty) {
        fullTitle = `${faculty.facultyFields.faculty.first} ${faculty.facultyFields.faculty.last}`
      }
      return (
        <FacultyCard
          key={index}
          title={fullTitle}
          description={faculty.facultyFields.faculty.position}
          image={faculty.featuredImage && faculty.featuredImage.node}
          link={faculty.uri}
          phone={faculty.facultyFields.faculty.phone}
          email={faculty.facultyFields.faculty.email}
        />
      )
    })
  )
}
