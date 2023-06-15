import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

/**
 * See the CoreParagraph for details on how these blocks are structured.
 *
 * @see ./CoreParagraph.js
 */
export default function CoreColumns(props) {
  const attributes = props.attributes
  return (
    <div className={attributes?.cssClassName}>
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </div>
  )
}

CoreColumns.fragments = {
  entry: gql`
    fragment CoreColumnsFragment on CoreColumns {
      attributes {
        cssClassName
      }
    }
  `,
  key: `CoreColumnsFragment`
}

CoreColumns.displayName = 'CoreColumns'
