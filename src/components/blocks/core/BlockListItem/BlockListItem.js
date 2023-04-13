import React from 'react'
import Blocks from '@/components/molecules/Blocks'
import RichText from '@/components/atoms/RichText'

export default function BlockListItem(props) {
  return (
    <li className={props.className}>
      {/* we have to use a span here because of the way react has to handle html */}
      <RichText tag="span">{props.content}</RichText>
      {!!props.innerBlocks?.length && (
        <Blocks
          blocks={props.innerBlocks}
          where="BlockListItem"
          pageContext={props.pageContext}
        />
      )}
    </li>
  )
}
