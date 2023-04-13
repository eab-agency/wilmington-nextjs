/* eslint-disable no-unused-vars */
import DisplayImage from '@/components/atoms/Image'
import PropTypes from 'prop-types'

/**
 * Image Block
 *
 * The core Image block from Gutenberg.
 *
 * @param  {object}  props The component props.
 * @return {Element}       The Block Image component.
 */
export default function BlockImage(props) {
  // spread props except width and height
  const { width, height, ...rest } = props
  // set image size

  return <DisplayImage {...rest} />
}

BlockImage.propTypes = {
  props: PropTypes.object
}
