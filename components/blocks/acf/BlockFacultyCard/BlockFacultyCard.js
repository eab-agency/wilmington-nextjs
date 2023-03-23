/* eslint-disable camelcase */
import React from 'react';
import FacultyCard from '../../../molecules/FacultyCard/FacultyCard';

/**
 * Athlete Block
 *
 * The acf Athlete Block from colab.
 *
 * @param  {object}  props              Athlete component props.
 * @return {Element}                    The Card component.
 */


export default function BlockFaculty({ faculty_member }) {
  const faculty = []
  // destructuring the faculty object but allow for null values
  const { email, first, last, phone, position } =
    faculty?.facultyFields?.faculty || {};

  const link = faculty?.link;
  const fullName = `${first} ${last}`;
  const image = faculty?.featuredImage?.node?.gatsbyImage;

  return (
    // only render if faculty is not null
    faculty && (
      <FacultyCard
        title={fullName}
        description={position}
        email={email}
        phone={phone}
        link={link}
        image={image}
      />
    )
  );
}
