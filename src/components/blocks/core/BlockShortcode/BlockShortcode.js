import React from 'react'

/**
 * Shortcode Block.
 *
 * The core Shortcode block from Gutenberg.
 *
 * @param  {object}  props       The component attributes as props.
 * @param  {object}  props.props The component props.
 * @return {Element}             The Shortcode component.
 */
export default function BlockShortcode({props}) {
  const {content} = props

  return <div dangerouslySetInnerHTML={{__html: content}} />
}
