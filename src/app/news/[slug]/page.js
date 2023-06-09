/* eslint-disable no-console */
import Container from '@/components/atoms/Container'
import RichText from '@/components/atoms/RichText'
import Blocks from '@/components/molecules/Blocks'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'
import { notFound } from 'next/navigation'

const postType = 'news'

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

export default async function Page({ params }) {
  const id = `/news/${params?.slug}`
  const { props } = await getPostTypeStaticProps({ slug: id }, postType)
  console.log('🚀 ~ file: page.js:31 ~ Page ~ props:', props)

  if (!props?.post) {
    console.log('🛑 no post.props for: ', id)
    notFound()
  }

  // // Filter the blocks array for core/heading blocks with level attribute equal to 2
  // const jumpLinks = props.post?.blocks?.filter(
  //   (block) => block.name === 'core/heading' && block.attributes.level === 2
  // )

  return (
    <Container>
      <article className="innerWrap">
        pum pum
        <RichText tag="h1">{props.post?.title}</RichText>
        {/* <Breadcrumbs breadcrumbs={props.post.seo.breadcrumbs} /> */}
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
