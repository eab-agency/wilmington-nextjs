/* eslint-disable camelcase */
import React from 'react';
import FacultyCard from '@/components/molecules/FacultyCard/FacultyCard';

/**
 * Faculty Block
 *
 * The acf Faculty Block from colab.
 *
 * @param  {object}  props              Faculty component props.
 * @return {Element}                    The Card component.
 */

export default function BlockFacultyCards({ programfacultyIDs }) {
  const programfaculty = []
  // if programfaculty is null or undefined, return null
  if (!programfaculty) {
    return null;
  }

  const facultyRestructured = programfaculty.map(faculty => {
    const { email, first, last, phone, position } =
      faculty?.facultyFields?.faculty;
    return {
      email: email,
      first: first,
      last: last,
      phone: phone,
      position: position,
      title: `${first} ${last}`,
      link: faculty.link,
      image: faculty.featuredImage?.node?.gatsbyImage,
    };
  });
  // console.table(facultyRestructured);
  return (
    <>
      {facultyRestructured.map((faculty, index) => {
        return <FacultyCard {...faculty} key={index} />;
      })}
    </>
  );
}
