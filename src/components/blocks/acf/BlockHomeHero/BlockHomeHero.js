import React from 'react'
import Hero from '@/components/organisms/HomeHero'

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
  data: { innerBlocks, hero_content, hero_primary_ctas, hero_image, ...other },
  imageMeta
}) {
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

  // const image = useImageItem(hero_image, 'full');
  const image = ''

  return (
    <Hero
      imageMeta={imageMeta}
      content={hero_content}
      ctas={hero_ctas_array}
      innerBlocks={innerBlocks}
    />
  )
}
