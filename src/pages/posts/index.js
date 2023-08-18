import { SEO } from '@/components'
import LoadMore from '@/components/LoadMore'
import { PostsList } from '@/components/archive/PostsList'
import RichText from '@/components/atoms/RichText'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql, useQuery } from '@apollo/client'
import { getNextStaticProps } from '@faustwp/core'

export default function Page() {
  const { data, loading, fetchMore } = useQuery(Page.query, {
    variables: Page.variables()
  })

  if (loading) {
    return <></>
  }
  const { title: siteTitle } = data?.generalSettings ?? {}
  const postList = data.posts.edges.map((el) => el.node)

  return (
    <>
      <SEO title={siteTitle} />
      <Layout className="thelayoutclass">
        <div className="inner-wrap">
          <RichText className="blogTitle" tag="h1">
            Latest Posts
          </RichText>
          {data.description && <RichText>{data.description}</RichText>}

          <div className="container">
            <PostsList posts={postList} id="post-list" />
            <LoadMore
              className="text-center"
              hasNextPage={data?.posts?.pageInfo?.hasNextPage}
              endCursor={data?.posts?.pageInfo?.endCursor}
              isLoading={loading}
              fetchMore={fetchMore}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

Page.query = gql`
  ${BlogInfoFragment}
  query GetPostsPage($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        node {
          id
          title
          uri
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Page.variables = () => {
  return {
    first: 2,
    after: ''
  }
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page
  })
}
