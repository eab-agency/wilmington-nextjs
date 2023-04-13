import React from 'react'
import Blocks from '@/components/molecules/Blocks'
import ButtonGroup from '@/components/molecules/ButtonGroup'

/**
 * Buttons Block
 *
 * The core Buttons block from Gutenberg.
 *
 */

export default function BlockButtons({
  anchor,
  contentJustification,
  innerBlocks,
  orientation,
  ...props
}) {
  return (
    <ButtonGroup
      id={anchor}
      orientation={orientation}
      contentJustification={contentJustification}
    >
      {!!innerBlocks?.length && (
        <Blocks blocks={innerBlocks} where="BlockButtons" {...props} />
      )}
    </ButtonGroup>
  )
}
