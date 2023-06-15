import Button from '@/components/atoms/Buttons/Button'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'

/**
 * Button Block
 *
 * The core Button block from Gutenberg.
 *
 * @param  {object}  props                    The component properties.
 * @param  {string}  props.anchor             Optional anchor/id.
 * @param  {string}  props.backgroundColorHex The background color hex value.
 * @param  {number}  props.borderRadius       The border radius in pixels.
 * @param  {string}  props.className          Optional classnames.
 * @param  {string}  props.gradientHex        The background gradient hex value.
 * @param  {string}  props.linkTarget         The target for the link.
 * @param  {string}  props.rel                The rel attribute for the link.
 * @param  {object}  props.style              The style attributes.
 * @param  {string}  props.text               The link label.
 * @param  {string}  props.textColorHex       The text color hex value.
 * @param  {string}  props.url                The link for the button.
 * @param  {number}  props.width              The width in percent.
 * @return {Element}                          The Button component.
 */
export default function CoreButton(props) {
  const attributes = props.attributes
  const style = getStyles(attributes)

  // Extract button style.
  const styleOutline =
    attributes?.className && attributes?.className.includes('is-style-outline')

  // Remove styles from className.
  attributes?.className &&
    attributes?.className
      .replace('is-style-outline', '')
      .replace('is-style-fill', '')

  return (
    <Button
      attributes={{
        id: attributes?.anchor || null,
        target: attributes?.linkTarget || null,
        rel: attributes?.rel || null
      }}
      className={attributes?.className}
      style={style}
      styleOutline={styleOutline}
      text={attributes?.text}
      url={attributes?.url}
    />
  )
}

CoreButton.fragments = {
  entry: gql`
    fragment CoreButtonFragment on CoreButton {
      attributes {
        backgroundColor
        textColor
        anchor
        className
        linkTarget
        rel
        style
        text
        url
        width
      }
    }
  `,
  key: `CoreButtonFragment`
}

CoreButton.displayName = 'CoreButton'
