import Container from '@/components/atoms/Container'
import Layout from '@/components/common/Layout'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import { SEO } from '../components'
import blocks from '../components/blocks'
import FeaturedImage from '../components/common/FeaturedImage'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

export default function Component(props) {
  const { editorBlocks } = props.data.nodeByUri
  const blocks = flatListToHierarchical(editorBlocks)

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {}

  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <div className="page-content">
              <WordPressBlocksViewer blocks={blocks} />
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  ${getFragmentDataFromBlocks(blocks).entries}
  query GetFrontPageData($uri: String!) {
    nodeByUri(uri: $uri) {
       ... on NodeWithTitle {
        title
      }
      ...FeaturedImageFragment
       ... on NodeWithEditorBlocks {
        # Get contentBlocks with flat=true and the nodeId and parentId
        # so we can reconstruct them later using flatListToHierarchical()
        editorBlocks {
          cssClassNames
          isDynamic
          name
          id: clientId
          parentId: parentClientId
          renderedHtml
          # Get all block fragment keys and call them in the query
          ${getFragmentDataFromBlocks(blocks).keys}
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Component.variables = ({ uri }, ctx) => {
  return {
    uri
  }
}
