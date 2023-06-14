import Hero from '@/components/organisms/HomeHero'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

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

export default function BlockHomeHero({
  data: { innerBlocks, hero_content, hero_primary_ctas, ...other },
  imageMeta
}) {
  const { data } = other.attributes
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
      imageMeta={imageMeta}
      content={hero_content}
      ctas={hero_ctas_array}
      innerBlocks={innerBlocks}
    />
  )
}

BlockHomeHero.fragments = {
  entry: gql`
    fragment ACFHomeHeroFragment on AcfHomeHero {
      attributes {
        data
      }
    }
  `,
  key: `ACFHomeHeroFragment`
}
