import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { SEO } from '@/components'
import Container from '@/components/atoms/Container'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { seoPostFields } from '@/fragments'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import blocks from '../wp-blocks'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }
  const { title, editorBlocks, seo, featuredImage } =
    props.data.post || props.data.studentOrg
  const blocks = flatListToHierarchical(editorBlocks)
  const { description: siteDescription } = props?.data?.generalSettings ?? {}

  return (
    <>
      <SEO seo={seo} description={siteDescription} />
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
              <WordPressBlocksViewer blocks={blocks} />
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview
  }
}

/**
 * Compose the GraphQL query for our page's data.
 */
Component.query = gql`
  ${FeaturedImage.fragments.entry}
  ${BlogInfoFragment}
  # Get all block fragments and add them to the query
  ${getFragmentDataFromBlocks(blocks).entries}

  query GetSingular($databaseId: ID!, $imageSize: MediaItemSizeEnum = LARGE, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
        title
        ...FeaturedImageFragment
        ${seoPostFields}
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
    studentOrg(id: $databaseId, idType: DATABASE_ID) {
       title
        ...FeaturedImageFragment
        ${seoPostFields}
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
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
