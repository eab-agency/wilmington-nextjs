import Heading from '@/components/atoms/Heading'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import { gql } from '@apollo/client'
import cn from 'classnames'

export default function CoreHeading(props) {
  const attributes = props.attributes
  const { style, fontSize, textColor } = attributes
  const headingStyle = getBlockStyles({ style, fontSize, textColor })

  const classes = {
    [attributes?.className]: true,
    'text-center': attributes?.textAlign === 'center',
    'text-left': !attributes?.textAlign || attributes?.textAlign === 'left',
    'text-right': attributes?.textAlign === 'right',
    [attributes?.fontSize]: !!attributes?.fontSize,
    [attributes?.textColor]: !!attributes?.textColor
  }

  return (
    <Heading
      className={cn(classes)}
      id={attributes?.anchor}
      style={headingStyle}
      tag={`h${attributes?.level}`}
    >
      {attributes?.content}
    </Heading>
  )
}

CoreHeading.fragments = {
  entry: gql`
    fragment CoreHeadingFragment on CoreHeading {
      attributes {
        align
        anchor
        className
        content
        fontSize
        level
        style
        textAlign
        textColor
      }
    }
  `,
  key: `CoreHeadingFragment`
}

CoreHeading.displayName = 'CoreHeading'
