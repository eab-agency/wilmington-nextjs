import Spacer from '@/components/atoms/Spacer'
import { gql } from '@apollo/client'

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
export default function CoreSpacer(props) {
  const { anchor, height } = props.attributes

  // remove all but the number from the height string
  const heightNum = parseInt(height.replace(/\D/g, ''), 10)
  return <Spacer height={heightNum} id={anchor} />
}

CoreSpacer.fragments = {
  entry: gql`
    fragment CoreSpacerFragment on CoreSpacer {
      attributes {
        height
        anchor
      }
    }
  `,
  key: `CoreSpacerFragment`
}
