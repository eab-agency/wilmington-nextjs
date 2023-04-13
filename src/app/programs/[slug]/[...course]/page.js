import Container from '@/components/atoms/Container'
import RichText from '@/components/atoms/RichText'
import Blocks from '@/components/molecules/Blocks'
import getPostTypeStaticProps from '@/functions/wordpress/postTypes/getPostTypeStaticProps'

const postType = 'program'

const programChildPage = async ({ params }) => {
  const id = `/programs/${params?.slug}/${params?.course}`
  const { props } = await getPostTypeStaticProps({ slug: id }, postType)
  const { post } = props

  return (
    <div>
      <Container>
        <article className="innerWrap">
          <RichText tag="h1">{post?.title}</RichText>
          <Blocks blocks={post?.blocks} />
        </article>
      </Container>
    </div>
  )
}

export default programChildPage
