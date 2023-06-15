import RichText from '@/components/atoms/RichText'
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
  const style = getStyles(attributes)

  const classes = {
    [props.className]: true,
    'text-center': props.align === 'center',
    'text-left': !props.align || props.align === 'left',
    'text-right': props.align === 'right',
    [props.fontSize]: !!props.fontSize,
    [props.textColor]: !!props.textColor,
    [props.backgroundColor]: !!props.backgroundColor
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
        className
        content
        dropCap
        fontSize
        style
        textColor
      }
    }
  `,
  key: `CoreParagraphFragment`
}
