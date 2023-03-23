import React from 'react'
import Spacer from '@/components/atoms/Spacer'
import PropTypes from 'prop-types'

/**
 * Spacer Block
 *
 * The core Spacer block from Gutenberg.
 *
 * @param  {object}  props        The component attributes as props.
 * @param  {string}  props.anchor Optional anchor/id.
 * @param  {string}  props.height The height in px of the spacer.
 * @return {Element}              The Spacer component.
 */
export default function BlockSpacer ({ anchor, height }) {
  // remove all but the number from the height string
  const heightNum = parseInt(height.replace(/\D/g, ''), 10)
  return <Spacer height={heightNum} id={anchor} />
}

BlockSpacer.propTypes = {
  anchor: PropTypes.string,
  height: PropTypes.string
}
BlockSpacer.defaultProps = {
  height: 40
}
