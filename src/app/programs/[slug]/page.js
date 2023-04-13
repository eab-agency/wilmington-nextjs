import Container from '@/components/atoms/Container'
import RichText from '@/components/atoms/RichText'
import Blocks from '@/components/molecules/Blocks'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'

const postType = 'program'

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
