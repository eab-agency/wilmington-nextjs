import MediaText from '@/components/organisms/MediaText'
import formatFocalPoint from '@/functions/formatFocalPoint'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

/**
 * Media & Text Block
 *
 * The core Media & Text block from Gutenberg.
 *
 * @param  {object}  props                    The component properties.
 * @param  {string}  props.anchor             Optional anchor/id.
 * @param  {string}  props.backgroundColorHex The background color
 * @param  {string}  props.className          The image class name.
 * @param  {object}  props.focalPoint         The focal point coordinates for the image.
 * @param  {string}  props.gradientHex        The background gradient hex value.
 * @param  {boolean} props.imageFill          Whether to crop image to fill.
 * @param  {Array}   props.innerBlocks        The array of inner blocks to display.
 * @param  {boolean} props.isStackedOnMobile  Whether to stack media and text on mobile.
 * @param  {string}  props.mediaAlt           The image alt attribute.
 * @param  {string}  props.mediaPosition      The image position relative to the text.
 * @param  {string}  props.mediaUrl           The media URL.
 * @param  {number}  props.mediaWidth         The image width.
 * @param  {object}  props.style              The style attributes.
 * @param  {string}  props.textColorHex       The text color hex value.
 * @param  {string}  props.verticalAlignment  Vertical alignment of text.
 * @return {Element}                          The Media & Text component.
 */
export default function CoreMediaText(props) {
  const attributes = props.attributes
  const style = getStyles(attributes)

  // Add additional styles.
  const gridtemplatecolumns =
    attributes?.mediaPosition === 'left'
      ? `${attributes?.mediaWidth}% 1fr`
      : `1fr ${attributes?.mediaWidth}%`

  const newFocalPoint = attributes?.imageFill
    ? formatFocalPoint(attributes?.focalPoint)
    : {}

  return (
    <>
      <MediaText
        className={attributes?.className}
        focalPoint={newFocalPoint}
        id={attributes?.anchor}
        image={{ url: attributes?.mediaUrl, alt: attributes?.mediaAltText }}
        imageFill={attributes?.imageFill}
        mediaLeft={attributes?.mediaPosition === 'left'}
        mediaWidth={attributes?.mediaWidth}
        style={style}
        stackOnMobile={attributes?.isStackedOnMobile}
        verticalAlignment={attributes?.verticalAlignment}
      >
        <WordPressBlocksViewer blocks={props?.children ?? []} />
      </MediaText>
    </>
  )
}

CoreMediaText.fragments = {
  entry: gql`
    fragment CoreMediaTextFragment on CoreMediaText {
      attributes {
        anchor
        className
        focalPoint
        imageFill
        isStackedOnMobile
        mediaAltText: mediaAlt
        mediaPosition
        mediaUrl
        mediaWidth
        style
        verticalAlignment
      }
    }
  `,
  key: `CoreMediaTextFragment`
}

CoreMediaText.displayName = 'CoreMediaText'
