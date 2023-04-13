import React from 'react'
import Heading from '@/components/atoms/Heading'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import cn from 'classnames'

export default function BlockHeadings({
  anchor,
  className,
  content,
  fontSize,
  textColor,
  level,
  style,
  textAlign
}) {
  const headingStyle = getBlockStyles({ style, fontSize, textColor })

  return (
    <Heading
      className={cn(
        className,
        textAlign === 'center' ? 'text-center' : null,
        !textAlign || textAlign === 'left' ? 'text-left' : null,
        textAlign === 'right' ? 'text-right' : null
      )}
      id={anchor}
      style={headingStyle}
      tag={'h' + level}
    >
      {content}
    </Heading>
  )
}
