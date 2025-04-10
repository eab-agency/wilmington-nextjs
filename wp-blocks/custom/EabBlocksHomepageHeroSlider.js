import Hero from '@/components/organisms/HomeHero'
import { gql } from '@apollo/client'

const EabBlocksHomepageHeroSlider = (props) => {
  const { innerBlocks } = props

  // Find the hero top section block
  const heroTopSection = innerBlocks?.find(block => block.name === 'eab-blocks/hero-top-section')

  // Get content blocks from hero content section
  const heroContent = heroTopSection?.innerBlocks?.find(
    block => block.name === 'eab-blocks/hero-content'
  )
  const heading = heroContent?.innerBlocks?.find(block => block.name === 'core/heading')
  const paragraph = heroContent?.innerBlocks?.find(block => block.name === 'core/paragraph')
  const modalButton = heroContent?.innerBlocks?.find(block => block.name === 'eab-blocks/modal-button')

  const heroTitle = heading?.attributes?.content || ''
  const heroExtraContent = paragraph?.attributes?.content || ''

  // Extract modal button data - pass both videoUrl and imageUrl
  const modalButtonData = modalButton?.attributes ? {
    title: modalButton.attributes.label || '',
    url: modalButton.attributes.videoUrl || '', // videoUrl for the modal iframe
    imageUrl: modalButton.attributes.imageUrl || '', // imageUrl for the button display
    type: modalButton.attributes.useImage ? 'image' : 'video',
    useImage: modalButton.attributes.useImage || false
  } : null

  // Get CTAs from hero-ctas-group
  const ctasGroup = heroTopSection?.innerBlocks?.find(
    block => block.name === 'eab-blocks/hero-ctas-group'
  )
  const ctas = ctasGroup?.innerBlocks?.filter(cta => cta.name === 'eab-blocks/hero-cta-button')?.map(cta => {
    const { buttonText, buttonLink, buttonIcon } = cta.attributes || {}
    return {
      title: buttonText || '',
      url: buttonLink?.url || '',
      icon: buttonIcon || ''
    }
  }) || []

  // Get slides from hero-slides-area
  const slidesArea = innerBlocks?.find(block => block.name === 'eab-blocks/hero-slides-area')
  const mediaItems = slidesArea?.innerBlocks?.filter(block => block.name === 'eab-blocks/hero-slide')?.map(slide => {
    const { mediaUrl, mediaId, mediaAlt } = slide.attributes || {}
    if (!mediaUrl || !mediaId) return null

    return {
      imageId: mediaId.toString(),
      type: mediaUrl?.endsWith('.mp4') ? 'video' : 'image',
      mediaItem: {
        altText: mediaAlt || '',
        mediaUrl
      }
    }
  }).filter(Boolean) || []

  return (
    <Hero
      mediaItems={mediaItems}
      content={heroTitle}
      description={heroExtraContent}
      ctas={ctas}
      modalButton={modalButtonData}
    />
  )
}

export default EabBlocksHomepageHeroSlider

EabBlocksHomepageHeroSlider.fragments = {
  entry: gql`
    fragment EabBlocksHomepageHeroSliderFragment on EabBlocksHomepageHeroSlider {
      innerBlocks {
        name
        ... on EabBlocksHeroTopSection {
          innerBlocks {
            name
            ... on EabBlocksHeroContent {
              innerBlocks {
                name
                ... on CoreHeading {
                  attributes {
                    content
                  }
                }
                ... on CoreParagraph {
                  attributes {
                    content
                  }
                }
                ... on EabBlocksModalButton {
                  attributes {
                    label
                    videoUrl
                    useImage
                    imageUrl
                    imageWidth
                    align
                  }
                }
              }
            }
            ... on EabBlocksHeroCtasGroup {
              innerBlocks {
                name
                ... on EabBlocksHeroCtaButton {
                  attributes {
                    buttonText
                    buttonIcon
                    buttonLink
                  }
                }
              }
            }
          }
        }
        ... on EabBlocksHeroSlidesArea {
          innerBlocks {
            name
            ... on EabBlocksHeroSlide {
              attributes {
                mediaUrl
                mediaId
                mediaAlt
              }
            }
          }
        }
      }
    }
  `,
  key: 'EabBlocksHomepageHeroSliderFragment'
}

EabBlocksHomepageHeroSlider.displayName = 'EabBlocksHomepageHeroSlider'
