import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

/**
 * See the CoreParagraph for details on how these blocks are structured.
 *
 * @see ./CoreParagraph.js
 */
export default function CoreColumn(props) {
  const attributes = props.attributes
  return (
    <div className={attributes?.cssClassName}>
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </div>
  )
}

CoreColumn.fragments = {
  entry: gql`
    fragment CoreColumnFragment on CoreColumn {
      attributes {
        cssClassName
        style
      }
    }
  `,
  key: `CoreColumnFragment`
}

CoreColumn.displayName = 'CoreColumn'
