import React from 'react'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import PullQuote from '@/components/atoms/PullQuote'

export default function BlockPullQuote({
  anchor,
  citation,
  className,
  value,
  fontSize,
  style
}) {
  // convert style from string to object before passing to getBlockStyles, bc it comes in as a string
  const pullQuoteStyle = getBlockStyles({style, fontSize})

  return (
    <PullQuote
      citation={citation}
      className={className}
      id={anchor}
      style={pullQuoteStyle}
      value={value}
    />
  )
}
