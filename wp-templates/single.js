import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import Head from 'next/head'
import blocks from '../wp-blocks'

/**
 * This is a Faust Template for resolving singular templates (posts, pages).
 *
 * If you are unfamiliar with Faust Templates, they resolve much like the
 * WordPress Template Hierarchy.
 *
 * @see https://faustjs.org/docs/templates
 */
export default function Component(props) {
  const { title, editorBlocks } = props.data.nodeByUri

  /**
   * Get contentBlocks from props.data and pass them through
   * flatListToHierarchical() to re-assemble them into a proper
   * node hierarchy.
   */
  const blocks = flatListToHierarchical(editorBlocks)
  console.log('🚀 ~ file: single.js:25 ~ Component ~ blocks:', blocks)

  return (
    <>
      <main className="container">
        {/**
         * This component accepts contentBlocks data from WPGraphQL
         * and resolves the block data with blocks that exist in
         * your wp-blocks directory.
         *
         * If a block is found in the contentBlocks data but not in
         * wp-blocks directory, WordPressBlocksViewer will fallback
         * to renderedHtml for that block.
         *
         * @see https://faustjs.org/docs/reference/WordPressBlocksViewer
         */}
        <WordPressBlocksViewer blocks={blocks} />
      </main>
    </>
  )
}

Component.variables = ({ uri }, ctx) => {
  return {
    uri
  }
}

/**
 * Compose the GraphQL query for our page's data.
 */
Component.query = gql`
  # Header component fragment

  # Get all block fragments and add them to the query
  ${getFragmentDataFromBlocks(blocks).entries}

  query GetSingular($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on NodeWithTitle {
        title
      }
      ... on NodeWithEditorBlocks {
        # Get contentBlocks with flat=true and the nodeId and parentId
        # so we can reconstruct them later using flatListToHierarchical()
        editorBlocks {
          cssClassNames
          isDynamic
          name
          id: clientId
          parentId: parentClientId
          # renderedHtml

          # Get all block fragment keys and call them in the query
          ${getFragmentDataFromBlocks(blocks).keys}
        }
      }
    }
  }
`
