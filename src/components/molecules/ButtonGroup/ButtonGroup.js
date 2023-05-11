import cn from 'classnames'
import React from 'react'
import styles from './ButtonGroup.module.scss'

/**
 * Render the ButtonGroup component.
 *
 * @param  {object}  props                      The component properties.
 * @param  {Element} props.children             The children props to render.
 * @param  {string}  props.layout               The layout of the buttons.
 * @param  {string}  props.id                   The id of the block.
 * @return {Element}                            The ButtonGroup component.
 */
export default function ButtonGroup({ children, id, layout }) {
  // type = flex
  // orientation = vertical, horizontal
  // justifyContent = center, space-between, right, left
  // flexWrap = nowrap, wrap
  const { type, orientation, justifyContent, flexWrap } = layout

  return (
    <>
      <div
        id={id || null}
        className={cn(
          styles.buttonGroup,
          styles[orientation]
          // styles[contentJustification]
        )}
      >
        {children}
      </div>
    </>
  )
}
