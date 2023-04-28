import RichText from '@/components/atoms/RichText'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import cn from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

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

  const classes = {
    [className]: true,
    'text-center': align === 'center',
    'text-left': !align || align === 'left',
    'text-right': align === 'right',
    [fontSize]: !!fontSize,
    [textColor]: !!textColor,
    [backgroundColor]: !!backgroundColor
  }

  return (
    <RichText
      className={cn(classes)}
      id={anchor}
      dropCap={dropCap}
      style={paragraphStyle}
      tag="p"
    >
      {content}
    </RichText>
  )
}

BlockParagraph.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  anchor: PropTypes.string,
  className: PropTypes.string,
  content: PropTypes.string.isRequired,
  dropCap: PropTypes.bool,
  backgroundColor: PropTypes.string,
  fontSize: PropTypes.string,
  textColor: PropTypes.string,
  style: PropTypes.string
}
