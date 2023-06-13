import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import Container from '@/components/atoms/Container'
import Layout from '@/components/common/Layout'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import { Main, SEO } from '../components'
import blocks from '../components/blocks'
import FeaturedImage from '../components/common/FeaturedImage'
import PageHero from '../components/organisms/PageHero/PageHero'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }
  const { editorBlocks, title, content, featuredImage } = props.data.page
  const blocks = flatListToHierarchical(editorBlocks)

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {}

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      {/* <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      /> */}

      <PageHero
        sourceUrl={featuredImage?.node?.sourceUrl}
        alt={featuredImage?.node?.altText}
        imageMeta={featuredImage?.node?.mediaDetails}
        text={title}
      />
      <div className="page-content">
        <WordPressBlocksViewer blocks={blocks} />
      </div>
    </>
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
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

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview
  }
}
