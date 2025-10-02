/* eslint-disable no-console */
import { SEO } from '@/components'
import Container from '@/components/atoms/Container'
import Preloader from '@/components/atoms/Preloader'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment, seoPostFields } from '@/fragments'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import blocks from '../wp-blocks'

export default function Component(props) {
  const { editorBlocks, seo } = props.data.page
  const blocks = flatListToHierarchical(editorBlocks)

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {}

  // Loading state for previews
  if (props.loading) {
    return <Preloader />
  }

  return (
    <>
      <SEO seo={seo} />
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <div className="page-content" id="page-content">
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
  ${getFragmentDataFromBlocks(blocks).entries}

  query GetFrontPageData(
    $databaseId: ID!
    $asPreview: Boolean = false
) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
       ... on NodeWithTitle {
        title
      }
           ${seoPostFields}


        editorBlocks {
          __typename
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
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview
  }
}
