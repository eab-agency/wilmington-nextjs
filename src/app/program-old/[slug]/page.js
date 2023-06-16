'use client'
/* eslint-disable no-console */
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Blocks from '@/components/molecules/Blocks'
// import getPostTypeStaticPaths from '@/functions/wordpress/postTypes/getPostTypeStaticPaths'
import FeaturedImage from '@/components/common/FeaturedImage'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import getFragmentDataFromBlocks from '@/functions/wordpress/blocks/getFragmentDataFromBlocks'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { flatListToHierarchical } from '@faustwp/core'
import { notFound } from 'next/navigation'
import blocks from '../../../../wp-blocks'

const postType = 'program'

// export async function generateStaticParams() {
//   const { paths } = await getPostTypeStaticPaths(postType)

//   const formattedPaths = paths.map((path) => {
//     const { slug } = path.params
//     const lastSlug = slug[slug.length - 1]
//     const secondLastSlug = slug[slug.length - 2]

//     if (slug.length === 2) {
//       return { slug: lastSlug }
//     } else {
//       return { slug: secondLastSlug, course: lastSlug }
//     }
//   })

//   return formattedPaths
// }

export default async function ProgramPage(props) {
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

  // Filter the blocks array for core/heading blocks with level attribute equal to 2
  const jumpLinks = props.post?.blocks?.filter(
    (block) => block.name === 'core/heading' && block.attributes.level === 2
  )

  return (
    <Container>
      <article className="innerWrap programContent">
        <Breadcrumbs breadcrumbs={props.post.seo.breadcrumbs} />

        {/* Render jump links */}
        {jumpLinks.length > 0 && (
          <>
            <h2>On this page</h2>
            <ul>
              {jumpLinks.map((block, index) => (
                <li key={index}>
                  <a href={`#${block.attributes.anchor}`}>
                    {block.attributes.content}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        <WordPressBlocksViewer blocks={blocks} />

        <Blocks
          blocks={props.post?.blocks}
          departments={props.post?.departments?.nodes}
          programOrgRelationship={
            props.post?.programOrgRelationship?.programorg
          }
        />
      </article>
    </Container>
  )
}

ProgramPage.variables = ({ uri }, ctx) => {
  return {
    uri,
    asPreview: ctx?.asPreview
  }
}

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

ProgramPage.query = gql`
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
          uri
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
