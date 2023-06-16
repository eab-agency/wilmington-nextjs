import RichText from '@/components/atoms/RichText'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'
import cn from 'classnames'

/**
 * Paragraph Block
 *
 * The core Paragraph block from Gutenberg.
 *
 */
export default function CoreParagraph(props) {
  const attributes = props.attributes
  const getStylesStyle = getStyles(attributes)

  const { fontSize, backgroundColor, textColor, style } = attributes

  const paragraphStyle = getBlockStyles({
    fontSize,
    backgroundColor,
    textColor,
    style
  })

  const classes = {
    [attributes?.className]: true,
    'text-center': attributes?.align === 'center',
    'text-left': !attributes?.align || attributes?.align === 'left',
    'text-right': attributes?.align === 'right',
    [attributes?.fontSize]: !!attributes?.fontSize,
    [attributes?.textColor]: !!attributes?.textColor,
    [attributes?.backgroundColor]: !!attributes?.backgroundColor
  }

  return (
    <>
      <RichText
        className={cn(classes)}
        id={attributes?.anchor}
        dropCap={attributes?.dropCap}
        style={style}
        tag="p"
      >
        {attributes?.content}
      </RichText>
    </>
  )
}

CoreParagraph.fragments = {
  entry: gql`
    fragment CoreParagraphFragment on CoreParagraph {
      attributes {
        align
        anchor
        backgroundColor
        textColor
        style
        className
        content
        dropCap
        fontSize
      }
    }
  `,
  key: `CoreParagraphFragment`
}

CoreParagraph.displayName = 'CoreParagraph'
