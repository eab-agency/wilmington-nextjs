/* eslint-disable camelcase */

import FacultyCard from '@/components/molecules/FacultyCard/FacultyCard'
import { gql, useQuery } from '@apollo/client'
import FeaturedImage from '../../src/components/common/FeaturedImage'
/**
 * Athlete Block
 *
 * The acf Athlete Block from colab.
 *
 * @param  {object}  props              Athlete component props.
 * @return {Element}                    The Card component.
 */

export default function AcfFacultyCard(props) {
  const attributes = props.attributes

  const { faculty_member } = JSON.parse(attributes?.data)

  // grap the faculty image
  const {
    loading,
    error,
    data: facultyData
  } = useQuery(FACULTY_QUERY, {
    variables: { ids: faculty_member }
  })

  if (!faculty_member) return null

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    // map over facultyData only  if facultyData is not null
    facultyData.facultyMember.nodes.map((faculty, index) => {
      let fullTitle = ''

      if (faculty && faculty.facultyFields && faculty.facultyFields.faculty) {
        fullTitle = `${faculty.facultyFields.faculty.first} ${faculty.facultyFields.faculty.last}`
      }
      return (
        <FacultyCard
          key={index}
          title={fullTitle}
          description={faculty.facultyFields?.faculty?.position}
          image={faculty.featuredImage && faculty.featuredImage.node}
          link={faculty?.uri}
          phone={faculty?.facultyFields?.faculty?.phone}
          email={faculty?.facultyFields?.faculty?.email}
        />
      )
    })
  )
}

// fragment to get the data from the block
AcfFacultyCard.fragments = {
  entry: gql`
    fragment AcfFacultyCardFragment on AcfFacultyCard {
      attributes {
        data
      }
    }
  `,
  key: `AcfFacultyCardFragment`
}

const FACULTY_QUERY = gql`
  ${FeaturedImage.fragments.entry}
  query GetFacultyData(
    $ids: [ID!]!
    $imageSize: MediaItemSizeEnum = THUMBNAIL
  ) {
    facultyMember(where: { in: $ids }) {
      nodes {
        id
        ...FeaturedImageFragment
        facultyFields {
          faculty {
            email
            facebook
            first
            instagram
            last
            linkedin
            location
            phone
            position
            tiktok
            twitter
            youtube
            cv {
              mediaItemUrl
            }
          }
        }
      }
    }
  }
`
