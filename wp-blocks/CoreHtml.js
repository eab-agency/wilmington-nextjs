import BlockHtml from '@/components/blocks/core/BlockHtml/BlockHtml'
import { gql } from '@apollo/client'

export default function CoreHtml(props) {
  const attributes = props.attributes
  const renderedHtml = props.renderedHtml

  if (!attributes.content && !renderedHtml) return null

  return <BlockHtml renderedHtml={renderedHtml} {...attributes} />
}

CoreHtml.fragments = {
  entry: gql`
    fragment CoreHtmlFragment on CoreHtml {
      attributes {
        content
      }
      renderedHtml
    }
  `,
  key: `CoreHtmlFragment`
}

CoreHtml.displayName = 'CoreHtml'
