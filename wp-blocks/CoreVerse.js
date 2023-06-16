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
export default function CoreVerse(props) {
  const attributes = props.attributes
  const style = getStyles(attributes)

  return (
    <RichText
      className={cn(attributes?.className)}
      id={attributes?.anchor}
      dropCap={attributes?.dropCap}
      style={style}
    >
      {attributes?.content}
    </RichText>
  )
}

CoreVerse.fragments = {
  entry: gql`
    fragment CoreVerseFragment on CoreVerse {
      attributes {
        anchor
        className
        content
        style
      }
    }
  `,
  key: `CoreVerseFragment`
}

CoreVerse.displayName = 'CoreVerse'
