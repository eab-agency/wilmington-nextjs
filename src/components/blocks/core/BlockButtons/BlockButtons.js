import Blocks from '@/components/molecules/Blocks'
import ButtonGroup from '@/components/molecules/ButtonGroup'
import React from 'react'

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
  layout,
  ...props
}) {
  return (
    <ButtonGroup
      id={anchor}
      orientation={orientation}
      contentJustification={contentJustification}
      layout={layout}
    >
      {!!innerBlocks?.length && (
        <Blocks blocks={innerBlocks} where="BlockButtons" {...props} />
      )}
    </ButtonGroup>
  )
}
