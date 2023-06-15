import PullQuote from '@/components/atoms/PullQuote'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'
import React from 'react'

export default function CorePullquote(props) {
  const attributes = props.attributes
  // convert style from string to object before passing to getBlockStyles, bc it comes in as a string
  const style = getStyles(attributes)

  return (
    <PullQuote
      citation={attributes?.citation}
      className={attributes?.className}
      id={attributes?.anchor}
      style={style}
      value={attributes?.value}
    />
  )
}

CorePullquote.fragments = {
  entry: gql`
    fragment CorePullquoteFragment on CorePullquote {
      attributes {
        anchor
        citation
        className
        fontSize
        style
        value
      }
    }
  `,
  key: `CorePullquoteFragment`
}

CorePullquote.displayName = 'CorePullquote'
