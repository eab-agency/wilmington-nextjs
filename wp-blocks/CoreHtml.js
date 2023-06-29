import BlockHtml from '@/components/blocks/core/BlockHtml/BlockHtml'
import { gql } from '@apollo/client'

export default function CoreHtml(props) {
  const attributes = props.attributes

  return <BlockHtml {...attributes} />
}

CoreHtml.fragments = {
  entry: gql`
    fragment CoreHtmlFragment on CoreHtml {
      attributes {
        content
      }
    }
  `,
  key: `CoreHtmlFragment`
}

CoreHtml.displayName = 'CoreHtml'
