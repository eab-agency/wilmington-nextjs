import Columns from '@/components/atoms/Columns'
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
    <Columns
      id={attributes?.anchor}
      className={attributes?.className}
      columnCount={props?.children?.length}
      style={attributes?.style}
      verticalAlignment={attributes?.verticalAlignment}
      isStackedOnMobile={attributes?.isStackedOnMobile}
      backgroundColor={attributes?.backgroundColor}
    >
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </Columns>
  )
}

CoreColumns.fragments = {
  entry: gql`
    fragment CoreColumnsFragment on CoreColumns {
      attributes {
        anchor
        className
        cssClassName
        style
        verticalAlignment
        isStackedOnMobile
        backgroundColor
      }
    }
  `,
  key: `CoreColumnsFragment`
}

CoreColumns.displayName = 'CoreColumns'
