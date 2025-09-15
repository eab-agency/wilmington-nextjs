import Hero from '@/components/organisms/HomeHero'
import { gql } from '@apollo/client'

const EabBlocksHomepageHeroSlider = (props) => {
  const { innerBlocks } = props

  // Find the hero top section block
  const heroTopSection = innerBlocks?.find(
    (block) => block.name === 'eab-blocks/hero-top-section'
  )

  // Get content blocks from hero content section
  const heroContent = heroTopSection?.innerBlocks?.find(
    (block) => block.name === 'eab-blocks/hero-content'
  )

  const heading = heroContent?.innerBlocks?.find(
    (block) => block.name === 'core/heading'
  )

  const paragraphs =
    heroContent?.innerBlocks?.filter(
      (block) => block.name === 'core/paragraph'
    ) || []

  const modalButtons =
    heroContent?.innerBlocks?.filter(
      (block) => block.name === 'eab-blocks/modal-button'
    ) || []

  const heroTitle = heading?.attributes?.content || ''
  const paragraphsContent = paragraphs.map((p) => p.attributes?.content || '')

  // Extract modal button data for all modal buttons
  const modalButtonsData = modalButtons
    .map((modalButton) =>
      modalButton?.attributes
        ? {
            title: modalButton.attributes.label || '',
            url: modalButton.attributes.videoUrl || '',
            imageUrl: modalButton.attributes.imageUrl || '',
            type: modalButton.attributes.useImage ? 'image' : 'video',
            useImage: modalButton.attributes.useImage || false,
            imageWidth: modalButton.attributes.imageWidth || 0,
            imageHeight: modalButton.attributes.imageHeight || 0,
            align: modalButton.attributes.align || 'left'
          }
        : null
    )
    .filter(Boolean)

  // Get CTAs from hero-ctas-group
  const ctasGroup = heroTopSection?.innerBlocks?.find(
    (block) => block.name === 'eab-blocks/hero-ctas-group'
  )

  const ctas =
    ctasGroup?.innerBlocks
      ?.filter((cta) => cta.name === 'eab-blocks/hero-cta-button')
      ?.map((cta) => {
        const { buttonText, buttonLink, buttonIcon, buttonStyle } =
          cta.attributes || {}
        let parsedButtonLink
        try {
          parsedButtonLink = JSON.parse(buttonLink)
        } catch (e) {
          console.error('Error parsing buttonLink:', e)
          parsedButtonLink = { url: '' }
        }
        return {
          title: buttonText || '',
          url: parsedButtonLink?.url || '',
          icon: buttonIcon || '',
          style: buttonStyle || 'primary'
        }
      }) || []

  // Get slides from hero-slides-area
  const slidesArea = innerBlocks?.find(
    (block) => block.name === 'eab-blocks/hero-slides-area'
  )

  const mediaItems =
    slidesArea?.innerBlocks
      ?.filter((block) => block.name === 'eab-blocks/hero-slide')
      ?.map((slide) => {
        const {
          mediaUrl,
          mediaId,
          heroSlideMediaAlt: mediaAlt
        } = slide.attributes || {}
        if (!mediaUrl || !mediaId) return null

        return {
          imageId: mediaId.toString(),
          type: mediaUrl?.endsWith('.mp4') ? 'video' : 'image',
          mediaItem: {
            altText: mediaAlt || '',
            mediaUrl
          }
        }
      })
      .filter(Boolean) || []

  return (
    <Hero
      mediaItems={mediaItems}
      content={heroTitle}
      description={paragraphsContent}
      ctas={ctas}
      modalButtons={modalButtonsData}
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
                    imageHeight
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
                    buttonStyle
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
                mediaAltHeroSlider: mediaAlt
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
