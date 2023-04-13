import React from 'react'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import Quote from '@/components/atoms/Quote'
import Blocks from '@/components/molecules/Blocks'

export default function BlockQuote({
  citation,
  anchor,
  className,
  style,
  innerBlocks
}) {
  // convert style from string to object before passing to getBlockStyles, bc it comes in as a string
  const quoteStyle = getBlockStyles({style})

  return (
    <Quote
      id={anchor}
      className={className}
      citation={citation}
      style={quoteStyle}
    >
      <Blocks blocks={innerBlocks} />
    </Quote>
  )
}
