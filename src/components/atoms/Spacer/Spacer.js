import React from 'react'
import PropTypes from 'prop-types'

/**
 * Render the Spacer component.
 *
 * @param  {object}  props        The component properties.
 * @param  {string}  props.anchor Optional anchor/id.
 * @param  {number}  props.height The height of the spacer.
 * @return {Element}              The Spacer component.
 */
export default function Spacer({height = 40, anchor}) {
  const rootEmVal = 16

  return (
    <div
      id={anchor || null}
      style={{
        /* stylelint-disable-next-line value-keyword-case */
        height: `${height / rootEmVal}rem`
      }}
      aria-hidden="true"
    />
  )
}

Spacer.propTypes = {
  anchor: PropTypes.string,
  height: PropTypes.number.isRequired
}
