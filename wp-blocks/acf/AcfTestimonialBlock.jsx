/* eslint-disable react-hooks/rules-of-hooks */
import BlockTestimonial from '@/components/blocks/acf/BlockTestimonial'
import FeaturedImage from '@/components/common/FeaturedImage'
import { gql, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'

function pickTwoRandomTestimonials(testimonials, testimonyIdToFilterOut) {
  // Filter out any object with a databaseId of 687
  const filteredTestimonials = testimonials.filter(
    (testimonial) => testimonial.databaseId !== testimonyIdToFilterOut
  )

  // Return null if no testimonials are left after filtering
  if (filteredTestimonials.length === 0) {
    return null
  }

  // Generate two random indices
  const randomIndex1 = Math.floor(Math.random() * filteredTestimonials.length)
  let randomIndex2 = Math.floor(Math.random() * filteredTestimonials.length)

  // Make sure the two indices are different
  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * filteredTestimonials.length)
  }

  // Pick the two testimonials at the random indices and push them into a new array
  const selectedTestimonials = []
  selectedTestimonials.push(filteredTestimonials[randomIndex1])
  selectedTestimonials.push(filteredTestimonials[randomIndex2])

  // Return the selected testimonials array
  return selectedTestimonials
}

// eslint-disable-next-line camelcase
export default function AcfTestimonialBlock(props) {
  const attributes = props.attributes
  const { testimonial_align, testimonial_group, testimonial_post } = JSON.parse(
    attributes?.data
  )
  // grab the random testimonials
  const {
    loading: randomLoading,
    error: randomError,
    data: randomTestimonies
  } = useQuery(QUERY_TESTIMONIALS)

  // grab the featured testimonials
  const {
    loading: featuredLoading,
    error: featuredError,
    data: featuredTestimonies
  } = useQuery(GET_TESTIMONIAL, {
    variables: { id: testimonial_post }
  })

  const [randomTestimonials, setRandomTestimonials] = useState([])

  useEffect(() => {
    if (randomTestimonies) {
      const testimonials = pickTwoRandomTestimonials(
        randomTestimonies.testimonials.nodes,
        testimonial_post
      )
      setRandomTestimonials(testimonials)
    }
  }, [randomTestimonies, testimonial_post])

  if (randomLoading || featuredLoading) return 'Loading...'
  if (randomError || featuredError)
    return `Error! ${featuredError.message || randomError.message}`

  return (
    <BlockTestimonial
      featuredTestimonial={featuredTestimonies.testimonial}
      random={testimonial_group === 1 ? randomTestimonials : null}
    />
  )
}

// fragment to get the data from the block
AcfTestimonialBlock.fragments = {
  entry: gql`
    fragment AcfTestimonialBlockFragment on AcfTestimonialBlock {
      attributes {
        data
      }
    }
  `,
  key: `AcfTestimonialBlockFragment`
}

// get the first 30 testimonials for the random selection
const QUERY_TESTIMONIALS = gql`
  ${FeaturedImage.fragments.entry}
  query getTestimonials($imageSize: MediaItemSizeEnum = LARGE) {
    testimonials(first: 30) {
      nodes {
        ...FeaturedImageFragment
        databaseId
        testimonialFields {
          testimonial {
            desc
            first
            last
          }
        }
      }
    }
  }
`

// get the featured testimonial
const GET_TESTIMONIAL = gql`
  ${FeaturedImage.fragments.entry}
  query getTestimonial($id: ID!, $imageSize: MediaItemSizeEnum = LARGE) {
    testimonial(id: $id, idType: DATABASE_ID) {
      ...FeaturedImageFragment
      databaseId
      testimonialFields {
        testimonial {
          desc
          first
          last
        }
      }
    }
  }
`

AcfTestimonialBlock.displayName = 'AcfTestimonialBlock'
