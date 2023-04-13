import React from 'react'
import Code from '@/components/atoms/Code'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'

export default function BlockCode({
  anchor,
  className,
  content,
  fontSize,
  language,
  lineNumbers,
  style,
  title
}) {
  const codeStyle = getBlockStyles({style, fontSize})

  return (
    <Code
      className={className}
      id={anchor}
      content={content}
      style={codeStyle}
    />
  )
}
