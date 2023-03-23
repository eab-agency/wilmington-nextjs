import React from 'react'
import Columns from '@/components/atoms/Columns'

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
export default function BlockColumns({
  anchor,
  className,
  innerBlocks,
  style,
  verticalAlignment,
  isStackedOnMobile,
  pageContext, 
  ...other
}) {
  return (
    <>
      {!!innerBlocks?.length && (
        <Columns
          id={anchor}
          className={className}
          columnCount={innerBlocks?.length}
          style={style}
          verticalAlignment={verticalAlignment}
          isStackedOnMobile={isStackedOnMobile}
          columns={innerBlocks}
          pageContext={pageContext}
          {...other}
        />
      )}
    </>
  );
}