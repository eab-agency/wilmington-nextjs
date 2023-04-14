import Container from '@/components/atoms/Container'
import RichText from '@/components/atoms/RichText'
import Blocks from '@/components/molecules/Blocks'
import getPostTypeStaticPaths from '@/functions/wordpress/postTypes/getPostTypeStaticPaths'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'

const postType = 'program'

export async function generateStaticParams() {
  const { paths } = await getPostTypeStaticPaths(postType)

  const formattedPaths = paths.map((path) => {
    const { slug } = path.params
    const lastSlug = slug[slug.length - 1]
    const secondLastSlug = slug[slug.length - 2]

    if (slug.length === 2) {
      return { slug: lastSlug }
    } else {
      return { slug: secondLastSlug, course: lastSlug }
    }
  })

  return formattedPaths
}

export default async function Page({ params }) {
  const id = `/programs/${params?.slug}`
  const { props } = await getPostTypeStaticProps({ slug: id }, postType)
  const { post } = props

  return (
    <Container>
      <article className="innerWrap">
        <RichText tag="h1">{post?.title}</RichText>
        <Blocks
          blocks={post?.blocks}
          departments={post?.departments?.nodes}
          programOrgRelationship={post?.programOrgRelationship?.programorg}
        />
      </article>
    </Container>
  )
}
