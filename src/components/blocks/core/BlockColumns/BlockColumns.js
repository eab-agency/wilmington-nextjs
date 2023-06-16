import Columns from '@/components/atoms/Columns'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

/**
 * Columns Block
 *
 * The core Columns block from Gutenberg.
 *
 * @param  {object}  props                    The component properties.
 * @param  {string}  props.anchor             Optional anchor/id.
 * @param  {string}  props.className          Optional classnames.
 * @param  {object}  props.innerBlocks        The array of inner blocks to display.
 * @param  {object}  props.style              The style attributes.
 * @param  {boolean} props.isStackedOnMobile  Checks if the columns are stacked.
 * @param  {string}  props.verticalAlignment  Vertical alignment of columns.
 * @return {Element}                          The Columns component.
 */
export default function BlockColumns(props) {
  const attributes = props.attributes
  // const style = getStyles(attributes)

  return (
    <Columns
      id={attributes?.anchor}
      className={attributes?.className}
      columnCount={props?.children?.length}
      style={props?.style}
      verticalAlignment={props?.verticalAlignment}
      isStackedOnMobile={props?.isStackedOnMobile}
      // columns={innerBlocks}
    >
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </Columns>
  )
}

BlockColumns.fragments = {
  entry: gql`
    fragment CoreColumnsBlockFragment on CoreColumns {
      attributes {
        anchor
        className
        style
        cssClassName
        isStackedOnMobile
        verticalAlignment
      }
    }
  `,
  key: `CoreColumnsBlockFragment`
}
