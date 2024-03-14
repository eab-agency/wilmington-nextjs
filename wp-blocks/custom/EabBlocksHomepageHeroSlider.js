import Hero from '@/components/organisms/HomeHero'
import { gql } from '@apollo/client'

const EabBlocksHomepageHeroSlider = (props) => {
  const { attributes } = props
  const {
    ctaOneLink,
    ctaOneText,
    ctaOneIcon,
    ctaTwoLink,
    ctaTwoText,
    ctaTwoIcon,
    ctaThreeLink,
    ctaThreeText,
    ctaThreeIcon,
    heroExtraContent,
    heroTitle
  } = attributes

  // put the three ctas into an array
  const ctas = []

  const ctaTexts = [ctaOneText, ctaTwoText, ctaThreeText]
  const ctaLinks = [ctaOneLink, ctaTwoLink, ctaThreeLink]
  const ctaIcons = [ctaOneIcon, ctaTwoIcon, ctaThreeIcon]

  for (let i = 0; i < 3; i++) {
    const ctaText = ctaTexts[i]
    const ctaLink = ctaLinks[i]
    const ctaIcon = ctaIcons[i]

    if (ctaText && ctaLink) {
      ctas.push({ title: ctaText, url: ctaLink.url, icon: ctaIcon })
    }
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
        ctaOneIcon
        ctaThreeLink
        ctaThreeText
        ctaThreeIcon
        ctaTwoLink
        ctaTwoText
        ctaTwoIcon
        heroExtraContent
        heroTitle
      }
    }
  `,
  key: 'EabBlocksHomepageHeroSliderFragment'
}

EabBlocksHomepageHeroSlider.displayName = 'EabBlocksHomepageHeroSlider'
