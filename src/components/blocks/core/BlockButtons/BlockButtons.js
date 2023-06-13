import ButtonGroup from '@/components/molecules/ButtonGroup'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

/**
 * Buttons Block
 *
 * The core Buttons block from Gutenberg.
 *
 */

export default function BlockButtons(props) {
  const attributes = props.attributes

  return (
    <ButtonGroup id={attributes?.anchor} layout={attributes?.layout}>
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </ButtonGroup>
  )
}

BlockButtons.fragments = {
  entry: gql`
    fragment CoreButtonsFragment on CoreButtons {
      attributes {
        anchor
        layout
      }
    }
  `,
  key: `CoreButtonsFragment`
}
