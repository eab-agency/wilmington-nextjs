import Hero from '@/components/organisms/HomeHero'
import { gql } from '@apollo/client'

const EabBlocksHomepageHeroSlider = (props) => {
  const { attributes, children } = props
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
  } = attributes || {}

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
      // parse the JSON string to access the url property
      let url = ''
      try {
        const parsedLink = typeof ctaLink === 'string' ? JSON.parse(ctaLink) : ctaLink
        url = parsedLink?.url || ''
      } catch (error) {
        console.error('Error parsing JSON for ctaLink:', error)
      }

      if (url) {
        ctas.push({ title: ctaText, url, icon: ctaIcon })
      }
    }
  }

  const mediaItems = []

  // Iterate over each slide in children if it exists
  if (Array.isArray(children)) {
    for (const item of children) {
      const attributes = item?.attributes
      // Check if mediaId and mediaUrl are available
      if (attributes?.mediaId && attributes?.mediaUrl) {
        // Extract relevant information
        const imageId = attributes.mediaId.toString()
        const altText = attributes.mediaAlt || ''
        const mediaUrl = attributes.mediaUrl
        const type = mediaUrl.split('.').pop().toLowerCase() === 'mp4' ? 'video' : 'image'

        // Create the new object with the extracted information
        mediaItems.push({
          type,
          mediaItem: {
            altText,
            mediaUrl
          }
        })
      }
    }
  }

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
