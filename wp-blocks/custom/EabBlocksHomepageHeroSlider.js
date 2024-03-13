import Hero from '@/components/organisms/HomeHero'
import { gql } from '@apollo/client'

const EabBlocksHomepageHeroSlider = (props) => {
  const { attributes } = props
  const {
    ctaOneLink,
    ctaOneText,
    ctaTwoLink,
    ctaTwoText,
    ctaThreeLink,
    ctaThreeText,
    heroExtraContent,
    heroTitle
  } = attributes

  // put the three ctas into an array
  const ctas = []

  if (ctaOneText) {
    ctas.push({ title: ctaOneText, url: ctaOneLink.url })
  }

  if (ctaTwoText) {
    ctas.push({ title: ctaTwoText, url: ctaTwoLink.url })
  }

  if (ctaThreeText) {
    ctas.push({ title: ctaThreeText, url: ctaThreeLink.url })
  }
  const mediaArray = props?.children
  const mediaItems = []

  // Iterate over each object in the mediaArray
  mediaArray.forEach((item) => {
    // Check if mediaId and mediaUrl are available
    if (item.attributes.mediaId && item.attributes.mediaUrl) {
      // Extract relevant information
      const imageId = item.attributes.mediaId.toString()
      const type = 'image'
      const altText = item.attributes.mediaAlt || ''
      const mediaUrl = item.attributes.mediaUrl

      // Create the new object with the extracted information
      const mediaItem = {
        imageId,
        type,
        mediaItem: {
          altText,
          mediaUrl
        }
      }

      // Push the new object to the mediaItems array
      mediaItems.push(mediaItem)
    }
  })

  return (
    <Hero
      mediaItems={mediaItems}
      content={heroTitle}
      description={heroExtraContent}
      ctas={ctas}
    />
  )
}
export default EabBlocksHomepageHeroSlider

EabBlocksHomepageHeroSlider.fragments = {
  entry: gql`
    fragment EabBlocksHomepageHeroSliderFragment on EabBlocksHomepageHeroSlider {
      attributes {
        backgroundColor
        className
        ctaOneLink
        ctaOneText
        ctaThreeLink
        ctaThreeText
        ctaTwoLink
        ctaTwoText
        heroExtraContent
        heroTitle
      }
    }
  `,
  key: `EabBlocksHomepageHeroSliderFragment`
}

EabBlocksHomepageHeroSlider.displayName = 'EabBlocksHomepageHeroSlider'
