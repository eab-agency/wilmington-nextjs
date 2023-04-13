import React from 'react'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import cn from 'classnames'
import RichText from '@/components/atoms/RichText'

/**
 * Paragraph Block
 *
 * The core Paragraph block from Gutenberg.
 *
 */
export default function BlockParagraph({
  align,
  anchor,
  className,
  content,
  dropCap,
  backgroundColor,
  fontSize,
  textColor,
  style
}) {
  // convert style from string to object before passing to getBlockStyles, bc it comes in as a string
  const paragraphStyle = getBlockStyles({
    fontSize,
    backgroundColor,
    textColor,
    style
  })

  return (
    <RichText
      className={cn(
        className,
        align === 'center' ? 'text-center' : null,
        !align || align === 'left' ? 'text-left' : null,
        align === 'right' ? 'text-right' : null
      )}
      id={anchor}
      dropCap={dropCap}
      style={paragraphStyle}
      tag="p"
    >
      {content}
    </RichText>
  )
}
