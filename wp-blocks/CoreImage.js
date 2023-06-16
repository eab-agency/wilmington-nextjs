import DisplayImage from '@/components/atoms/Image'
import styles from '@/components/atoms/Image/Image.module.css'
import getImageSizeProps from '@/functions/wordpress/blocks/getImageSizeProps'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'
import cn from 'classnames'
import Image from 'next/image'

/**
 * See the CoreParagraph for details on how these blocks are structured.
 *
 * @see ./CoreParagraph.js
 */
export default function CoreImage(props) {
  const attributes = props.attributes
  const style = getStyles(attributes)
  const imageSize = getImageSizeProps({
    ...attributes,
    width: attributes.widthString || attributes.width,
    height: attributes.heightString || attributes.height
  })

  return (
    <div
      id={attributes?.anchor}
      className={cn(
        styles.image,
        attributes?.className,
        attributes?.id ? `image-${props?.id}` : '',
        attributes?.nextImageFill ? styles.hasImageFill : null
      )}
    >
      <DisplayImage
        width={imageSize.width}
        height={imageSize.height}
        {...attributes}
      />
    </div>
  )
}

CoreImage.fragments = {
  entry: gql`
    fragment CoreImageFragment on CoreImage {
      attributes {
        id
        alt
        src
        caption
        className
        sizeSlug
        widthFloat: width
        widthString: width
        heightFloat: height
        heightString: height
        style
        anchor
      }
    }
  `,
  key: `CoreImageFragment`
}

CoreImage.displayName = 'CoreImage'
