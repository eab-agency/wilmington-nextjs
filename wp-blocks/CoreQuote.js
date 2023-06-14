import Quote from '@/components/atoms/Quote'
import getStyles from '@/functions/wordpress/blocks/getStyles'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'

export default function CoreQuote(props) {
  const attributes = props.attributes
  const style = getStyles(attributes)

  return (
    <Quote
      id={attributes?.anchor}
      className={attributes?.className}
      citation={attributes?.citation}
      style={style}
    >
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </Quote>
  )
}

CoreQuote.fragments = {
  entry: gql`
    fragment CoreQuoteFragment on CoreQuote {
      attributes {
        citation
        anchor
        className
        style
      }
    }
  `,
  key: `CoreQuoteFragment`
}
