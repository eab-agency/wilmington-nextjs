import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

export default function CoreList(props) {
  const attributes = props.attributes

  const Tag = attributes?.ordered ? 'ol' : 'ul'

  return (
    <Tag
      className={attributes?.className}
      id={attributes?.anchor || null}
      reversed={attributes?.reversed}
      start={attributes?.start}
    >
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </Tag>
  )
}

CoreList.fragments = {
  entry: gql`
    fragment CoreListFragment on CoreList {
      attributes {
        className
        ordered
        reversed
        start
        anchor
      }
    }
  `,
  key: `CoreListFragment`
}

CoreList.displayName = 'CoreList'
