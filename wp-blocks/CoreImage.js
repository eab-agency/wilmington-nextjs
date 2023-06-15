import { gql } from '@apollo/client'
import Image from 'next/image'
import getImageSizeProps from '../src/functions/wordpress/blocks/getImageSizeProps'
import getStyles from '../src/functions/wordpress/blocks/getStyles'

/**
 * See the CoreParagraph for details on how these blocks are structured.
 *
 * @see ./CoreParagraph.js
 */
export default function CoreImage(props) {
  const attributes = props.attributes
  const style = getStyles(attributes)
  const imageSize = getImageSizeProps(attributes)

  return (
    <figure style={{ ...style }} className={attributes?.className}>
      <Image
        alt={attributes.alt}
        src={attributes.src}
        width={imageSize.width}
        height={imageSize.height}
      />
      {attributes?.caption && <figcaption>{attributes?.caption}</figcaption>}
    </figure>
  )
}

CoreImage.fragments = {
  entry: gql`
    fragment CoreImageFragment on CoreImage {
      attributes {
        alt
        src
        caption
        className
        sizeSlug
        width
        height
        style
      }
    }
  `,
  key: `CoreImageFragment`
}
