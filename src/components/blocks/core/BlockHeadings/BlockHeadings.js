import Heading from '@/components/atoms/Heading'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import cn from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

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

  const classes = {
    [className]: true,
    'text-center': textAlign === 'center',
    'text-left': !textAlign || textAlign === 'left',
    'text-right': textAlign === 'right',
    [fontSize]: !!fontSize,
    [textColor]: !!textColor
  }

  return (
    <Heading
      className={cn(classes)}
      id={anchor}
      style={headingStyle}
      tag={`h${level}`}
    >
      {content}
    </Heading>
  )
}

BlockHeadings.propTypes = {
  anchor: PropTypes.string,
  className: PropTypes.string,
  content: PropTypes.string.isRequired,
  fontSize: PropTypes.string,
  textColor: PropTypes.string,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  style: PropTypes.string,
  textAlign: PropTypes.oneOf(['left', 'center', 'right'])
}
