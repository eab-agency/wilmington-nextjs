import Groups from '@/components/atoms/Groups'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

/**
 * Groups Block
 *
 * The core Groups block from Gutenberg.
 *
 * @param  {object}  props                    The component properties.
 * @param  {string}  props.anchor             Optional anchor/id.
 * @param  {string}  props.backgroundColorHex The background color hex value.
 * @param  {string}  props.className          Optional classnames.
 * @param  {string}  props.gradientHex        The background gradient hex value.
 * @param  {object}  props.innerBlocks        The array of inner blocks to display.
 * @param  {object}  props.style              The style attributes.
 * @param  {string}  props.textColorHex       The text color hex value.
 * @param  {boolean} props.isStackedOnMobile  Checks if the groups are stacked.
 * @param  {string}  props.verticalAlignment  Vertical alignment of groups.
 * @return {Element}                          The Groups component.
 */
export default function BlockGroup(props) {
  const attributes = props.attributes

  const style = getStyles(props.attributes)

  return (
    <Groups
      id={attributes?.anchor}
      className={attributes?.className}
      groupsCount={props.children?.length}
      style={style}
      verticalAlignment={attributes?.verticalAlignment}
      isStackedOnMobile={attributes?.isStackedOnMobile}
    >
      <h2>groups for days</h2>
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </Groups>
  )
}

BlockGroup.fragments = {
  key: `CoreGroupFragment`,
  entry: gql`
    fragment CoreGroupFragment on CoreGroup {
      attributes {
        align
        anchor
        backgroundColor
        borderColor
        className
        fontFamily
        fontSize
        gradient
        style
        tagName
        textColor
      }
    }
  `
}
