/* eslint-disable no-unused-vars */
import Code from '@/components/atoms/Code'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'

export default function BlockCode(props) {
  const attributes = props.attributes
  const style = getStyles(attributes)

  return (
    <Code
      className={attributes?.className}
      id={attributes?.anchor}
      content={attributes?.content}
      style={style}
    />
  )
}

BlockCode.fragments = {
  key: `CoreCodeFragment`,
  entry: gql`
    fragment CoreCodeFragment on CoreCode {
      attributes {
        anchor
        className
        content
        fontSize
        style
      }
    }
  `
}
