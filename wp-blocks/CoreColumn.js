import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { className } from 'classnames/bind'
import Column from '../src/components/atoms/Columns/Column'

/**
 * See the CoreParagraph for details on how these blocks are structured.
 *
 * @see ./CoreParagraph.js
 */
export default function CoreColumn(props) {
  const attributes = props.attributes
  return (
    <Column {...props}>
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </Column>
  )
}

CoreColumn.fragments = {
  entry: gql`
    fragment CoreColumnFragment on CoreColumn {
      attributes {
        className
        cssClassName
        style
        anchor
        width
      }
    }
  `,
  key: `CoreColumnFragment`
}

CoreColumn.displayName = 'CoreColumn'
