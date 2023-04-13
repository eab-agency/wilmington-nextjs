import React from 'react'
import Separator from '@/components/atoms/Separator'

// fragment is used in getWpBlocks.js
export const CoreSeparatorBlock = `
  fragment CoreSeparatorBlock on WpCoreSeparatorBlock {
    name
    attributes {
      __typename
      ... on WpCoreSeparatorBlockAttributes {
        anchor
        className
      }
    }
  }
`

export default function BlockSeparator({ className, anchor }) {
  const isFullWidth =
    (className && className.includes('is-style-full-width')) > 0

  return (
    <Separator className={className} anchor={anchor} fullWidth={isFullWidth} />
  )
}
