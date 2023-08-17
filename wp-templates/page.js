import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Preloader from '@/components/atoms/Preloader'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { seoPostFields } from '@/fragments'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import blocks from '../wp-blocks'

export default function Page(props) {
  // Loading state for previews
  if (props.loading) {
    return <Preloader />
  }
  const { editorBlocks, title, featuredImage, seo } = props.data.page
  const blocks = flatListToHierarchical(editorBlocks)

  return (
    <>
      <SEO seo={seo} />
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <PageHero
              sourceUrl={featuredImage?.node?.sourceUrl}
              alt={featuredImage?.node?.altText}
              imageMeta={featuredImage?.node?.mediaDetails}
              text={title}
            />
            <div className="page-content">
              {!!seo?.breadcrumbs && (
                <Breadcrumbs breadcrumbs={seo.breadcrumbs} />
              )}
              <WordPressBlocksViewer blocks={blocks} />
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

Page.query = gql`
  ${FeaturedImage.fragments.entry}
  ${getFragmentDataFromBlocks(blocks).entries}

  query GetPageData($databaseId: ID!, $imageSize: MediaItemSizeEnum = LARGE, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      ${seoPostFields}
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

  }
`

Page.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview
  }
}
