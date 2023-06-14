/* eslint-disable no-unused-vars */
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
export default function ButtonGroup({ children, id, layout = {} }) {
  const { type, orientation, justifyContent, flexWrap } = layout

  return (
    <div
      id={id || null}
      className={cn(
        styles.buttonGroup,
        styles[orientation],
        styles[type],
        styles[justifyContent],
        styles[flexWrap]
      )}
    >
      {children}
    </div>
  )
}
