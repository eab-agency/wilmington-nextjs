import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import ProgramTabs from '@/components/atoms/ProgramTabs/ProgramTabs'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import blocks from '../wp-blocks'

const SEO_QUERY = gql`
  fragment SeoFragment on PostTypeSEO {
    breadcrumbs {
      text
      url
    }
    fullHead
    metaRobotsNofollow
    metaRobotsNoindex
    title
  }
`

export default function SingleProgram(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }
  const {
    editorBlocks,
    title,
    featuredImage,
    seo,
    children: childPages,
    uri
  } = props.data.nodeByUri

  const blocks = flatListToHierarchical(editorBlocks)

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {}

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Layout className="thelayoutclass">
        <article className="inner-wrap">
          <PageHero
            sourceUrl={featuredImage?.node?.sourceUrl}
            alt={featuredImage?.node?.altText}
            imageMeta={featuredImage?.node?.mediaDetails}
            text={title}
          />{' '}
          <ProgramTabs childPages={childPages} uri={uri} />
          <Container>
            <article className="innerWrap programContent">
              <Breadcrumbs breadcrumbs={seo.breadcrumbs} />
              <WordPressBlocksViewer blocks={blocks} />
            </article>
          </Container>
        </article>
      </Layout>
    </>
  )
}

SingleProgram.variables = ({ uri }, ctx) => {
  return {
    uri,
    asPreview: ctx?.asPreview
  }
}

SingleProgram.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  ${getFragmentDataFromBlocks(blocks).entries}
  ${SEO_QUERY}
  query GetProgramData($uri: String!, $imageSize: MediaItemSizeEnum = LARGE) {
    nodeByUri(uri: $uri) {
       ... on NodeWithTitle {
        title
      }
       ... on Program {
        uri
          children {
        nodes {
          link
          slug
          ... on Program {
            id
            title
            uri
          }
        }
      }
         seo {
    ...SeoFragment
  }
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
