// import Container from '@/components/atoms/Container'
// import Layout from '@/components/common/Layout'
import { gql } from '@apollo/client'

// import { EntryHeader, Footer, Header, Main, Post, SEO } from '../components'
// import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

export default function Component(props) {
  const siteTitle = props?.data?.generalSettings?.title
  const siteDescription = props?.data?.generalSettings?.description
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? []
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? []
  const { name, posts } = props.data.nodeByUri

  return (
    <>
      {/* <SEO title={siteTitle} description={siteDescription} />
      <Layout className="thelayoutclass" seo={{ ...post?.seo }}>
        <Header
          title={siteTitle}
          description={siteDescription}
          menuItems={primaryMenu}
        />
        <Main>
          <>
            <EntryHeader title={`Category: ${name}`} />
            <Container>
              {posts.edges.map((post) => (
                <Post
                  key={post.node.title}
                  title={post.node.title}
                  content={post.node.content}
                  date={post.node.date}
                  author={post.node.author?.node.name}
                  uri={post.node.uri}
                  featuredImage={post.node.featuredImage?.node}
                />
              ))}
            </Container>
          </>
        </Main>
        <Footer title={siteTitle} menuItems={footerMenu} />
      </Layout> */}
    </>
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  query GetCategoryPage($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Category {
        name
        posts {
          edges {
            node {
              id
              title
              content
              date
              uri
              ...FeaturedImageFragment
              author {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Component.variables = ({ uri }) => {
  return {
    uri
  }
}
