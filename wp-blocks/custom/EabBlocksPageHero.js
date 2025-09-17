import Image from '@/components/atoms/Image'
import { useWordPressContext } from '@/components/common/WordPressProvider'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import cn from 'classnames'

const EabBlocksPageHero = (props) => {
  const attributes = props.attributes || {}
  const { heroTitle = '' } = attributes

  // Check for waterMark - it comes through as a boolean from WordPress
  const waterMark = Boolean(attributes.waterMark)

  // Get page data from WordPress context (includes featuredImage)
  const pageContext = useWordPressContext() || {}
  const { featuredImage, title: pageTitle } = pageContext

  // Get WordPress styling
  const style = getStyles(attributes)

  // Get block wrapper attributes - use props.classNames from WordPress GraphQL
  const blockWrapperAttributes = {
    className: cn(
      'pageHero',
      'wp-block-eab-blocks-page-hero',
      props.classNames, // This contains WordPress-generated classes like has-background, etc.
      attributes.className
    ),
    style
  }

  // Get image data from context (page's featured image)
  const imageSource = featuredImage?.sourceUrl
  const imageAlt = featuredImage?.altText || heroTitle || pageTitle || ''

  // Filter out empty or meaningless blocks
  const filterEmptyBlocks = (blocks = []) => {
    return blocks.filter((block) => {
      if (!block || !block.renderedHtml) return false

      // Remove blocks that only contain empty HTML
      const cleanedHtml = block.renderedHtml
        .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
        .replace(/\s+/g, '') // Remove whitespace
        .trim()

      // Only include blocks that have actual content
      return cleanedHtml.length > 0
    })
  }

  const filteredBlocks = filterEmptyBlocks(props?.children)

  return (
    <div {...blockWrapperAttributes}>
      <div className="hero-content-wrapper">
        {imageSource && (
          <Image
            url={imageSource}
            alt={imageAlt}
            imageMeta={
              featuredImage?.mediaDetails
                ? { mediaDetails: featuredImage.mediaDetails }
                : undefined
            }
            width={featuredImage?.mediaDetails?.width || 1920}
            height={featuredImage?.mediaDetails?.height || 1080}
            priority={true}
            className="hero-image"
          />
        )}

        <div className={`hero-body${waterMark ? ' has-watermark' : ''}`}>
          <h1 className="hero-title">{heroTitle}</h1>

          {filteredBlocks.length > 0 && (
            <div className="hero-copy">
              <WordPressBlocksViewer blocks={filteredBlocks} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EabBlocksPageHero

EabBlocksPageHero.fragments = {
  entry: gql`
    fragment EabBlocksPageHeroFragment on EabBlocksPageHero {
      classNames
      attributes {
        backgroundColor
        className
        fontSize
        heroTitle
        style
        textColor
        waterMark
      }
    }
  `,
  key: 'EabBlocksPageHeroFragment'
}

EabBlocksPageHero.displayName = 'EabBlocksPageHero'
