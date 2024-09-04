import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Preloader from '@/components/atoms/Preloader'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { seoPostFields } from '@/fragments'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import { Fragment } from 'react'
import blocks from '../wp-blocks'

export default function Page(props) {
  if (props.loading) {
    return <Preloader />
  }

  const { editorBlocks, title, featuredImage, seo } = props.data.page
  const blocks = flatListToHierarchical(editorBlocks)

  const blockGroupContainsPageHero = (children) => {
    return children.some(child => {
      if (child.name === 'eab-blocks/page-hero') {
        return true;
      }
      // Recursively check nested children blocks
      if (child.children && child.children.length > 0) {
        return blockGroupContainsPageHero(child.children);
      }
      return false;
    });
  };

  const hasPageHeroInGroup = blocks.some(block => {
    return block.name === 'core/group' && blockGroupContainsPageHero(block.children);
  });

  const pageHeroIndex = blocks.findIndex(
    (block) => block.name === 'eab-blocks/page-hero'
  )


  return (
    <>
      <SEO seo={seo} />
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            {pageHeroIndex === -1 && !hasPageHeroInGroup && (
              <>
                <PageHero
                  sourceUrl={featuredImage?.node?.sourceUrl}
                  alt={featuredImage?.node?.altText}
                  imageMeta={featuredImage?.node?.mediaDetails}
                  text={title}
                />
                <Breadcrumbs breadcrumbs={seo.breadcrumbs} />
              </>
            )}
            <div className="page-content">
              {blocks.map((block, index) => (
                <Fragment key={block.id || index}>
                  <WordPressBlocksViewer blocks={[block]} />

                  {/* Conditionally render Breadcrumbs after the eab-blocks/page-hero block */}
                  {(block.name === 'eab-blocks/page-hero' || hasPageHeroInGroup) && (
                    <Breadcrumbs breadcrumbs={seo.breadcrumbs} />
                  )}
                </Fragment>
              ))}
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

  query GetPageData($databaseId: ID!, $imageSize: MediaItemSizeEnum = HERO_IMG, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      ${seoPostFields}
      ...FeaturedImageFragment
      ... on NodeWithEditorBlocks {
        editorBlocks {
          cssClassNames
          isDynamic
          name
          id: clientId
          parentId: parentClientId
          renderedHtml
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
