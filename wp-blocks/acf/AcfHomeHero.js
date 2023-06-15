import Image from '@/components/atoms/Image'
import Hero from '@/components/organisms/HomeHero'
import { gql, useQuery } from '@apollo/client'

/**
 * Home Hero Block
 *
 * The core Columns block from Gutenberg.
 *
 * @param  {object}  props                 The component properties.
 * @param  {string}  props.hero_title      Hero title (html)
 * @param  {number}  props.hero_primary_ctas   number of primary CTA buttons
 * @return {Element}                       The Cover component.
 */

// {
//   data: { innerBlocks, hero_content, hero_primary_ctas, ...other },
//   imageMeta
// }

export default function AcfHomeHero(props) {
  // eslint-disable-next-line no-console
  console.log('🚀 ~ file: AcfHomeHero.js:22 ~ AcfHomeHero ~ props:', props)
  const attributes = props.attributes

  const { hero_content, hero_primary_ctas, hero_image, ...other } = JSON.parse(
    attributes?.data
  )

  // grap the athlete image
  const { loading, error, data } = useQuery(Image.query, {
    variables: { id: hero_image }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const count = hero_primary_ctas

  const hero_ctas_array = []
  // loop through the number of tabs
  for (let i = 0; i < count; i++) {
    // create an object for each tab
    const cta = {
      title: other[`hero_primary_ctas_${i}_link`].title,
      url: other[`hero_primary_ctas_${i}_link`].url,
      target: other[`hero_primary_ctas_${i}_link`].target,
      icon: other[`hero_primary_ctas_${i}_icon`]
    }
    // push the object to the array
    hero_ctas_array.push(cta)
  }

  return (
    <Hero
      imageMeta={data?.mediaItem}
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
