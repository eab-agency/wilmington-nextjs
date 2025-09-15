import Preloader from '@/components/atoms/Preloader'
import Hero from '@/components/organisms/HomeHero'
import {
  createCTAArray,
  createMediaObject
} from '@/functions/createMediaObject'
import { gql, useQuery } from '@apollo/client'
/**
 * Home Hero Block
 *
 * The ACF Home Hero block from Gutenberg.
 */

const IMAGE_QUERY = gql`
  query GET_MEDIA($ids: [ID]!) {
    mediaItems(where: { in: $ids }) {
      edges {
        node {
          altText
          mediaUrl: mediaItemUrl
          mediaDetails {
            height
            width
            sizes {
              height
              name
              sourceUrl
              width
            }
          }
        }
      }
    }
  }
`

export default function AcfHomeHero(props) {
  const attributes = props.attributes
  const {
    hero_content,
    hero_primary_ctas: cta_count,
    hero_media_slider: hero_media_slider_count,
    ...other
  } = JSON.parse(attributes?.data)

  const hero_ctas_array = createCTAArray(other, cta_count)

  const hero_media_slider_array = []

  for (let i = 0; i < hero_media_slider_count; i++) {
    const media = createMediaObject(other, i)
    hero_media_slider_array.push(media)
  }

  const allTheImageIds = hero_media_slider_array.map((item) => item.imageId)

  // Pass the imageIds to the useQuery hook
  const { loading, error, data } = useQuery(IMAGE_QUERY, {
    variables: { ids: allTheImageIds }
  })

  if (loading) return <Preloader />
  if (error) {
    console.error(error)
    return null
  }

  const { mediaItems } = data

  let mediaArray = []

  // Check if the data has been fetched successfully
  if (!loading && !error) {
    const nodes = mediaItems.edges.map((edge) => edge.node)

    // Iterate over the hero_media_slider_array and append data.mediaItem to each object
    mediaArray = hero_media_slider_array.map((item, index) => ({
      ...item,
      mediaItem: nodes[index]
    }))
  }

  return (
    <Hero
      mediaItems={mediaArray}
      media={hero_media_slider_array}
      content={hero_content}
      ctas={hero_ctas_array}
    />
  )
}

AcfHomeHero.fragments = {
  entry: gql`
    fragment AcfHomeHeroFragment on AcfHomeHero {
      attributes {
        data
      }
    }
  `,
  key: `AcfHomeHeroFragment`
}

AcfHomeHero.displayName = `AcfHomeHero`
