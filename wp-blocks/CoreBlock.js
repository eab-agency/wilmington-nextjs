import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

/**
 * Buttons Block
 *
 * The core Buttons block from Gutenberg.
 *
 */

export default function CoreBlock(props) {
  return <WordPressBlocksViewer blocks={props?.children ?? []} />
}

CoreBlock.fragments = {
  entry: gql`
    fragment CoreBlockFragment on CoreBlock {
      attributes {
        __typename
      }
    }
  `,
  key: `CoreBlockFragment`
}

CoreBlock.displayName = 'CoreBlock'
