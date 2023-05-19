import Groups from '@/components/atoms/Groups'
import Blocks from '@/components/molecules/Blocks'
import PropTypes from 'prop-types'

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
export default function BlockGroup({
  anchor,
  className,
  innerBlocks,
  style,
  verticalAlignment,
  isStackedOnMobile,
  pageContext,
  ...props
}) {
  return (
    <Groups
      id={anchor}
      className={className}
      groupsCount={innerBlocks?.length}
      style={style}
      verticalAlignment={verticalAlignment}
      isStackedOnMobile={isStackedOnMobile}
      tagName={props.tagName}
      bgColor={props.backgroundColor}
    >
      {!!innerBlocks?.length && (
        <Blocks
          blocks={innerBlocks}
          where="BlockGroup"
          pageContext={pageContext}
          {...props}
        />
      )}
    </Groups>
  )
}

BlockGroup.propTypes = {
  anchor: PropTypes.string,
  backgroundColorHex: PropTypes.string,
  className: PropTypes.string,
  gradientHex: PropTypes.string,
  innerBlocks: PropTypes.arrayOf(
    PropTypes.shape({
      block: PropTypes.object,
      index: PropTypes.number
    })
  ),
  style: PropTypes.object,
  textColorHex: PropTypes.string,
  verticalAlignment: PropTypes.string
}
