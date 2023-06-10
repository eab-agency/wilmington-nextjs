import { gql } from '@apollo/client'
// import {
//   Container,
//   EntryHeader,
//   Footer,
//   Header,
//   Main,
//   Post,
//   SEO
// } from '../components'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

export default function Component(props) {
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? []
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? []
  const { name, posts } = props.data.nodeByUri

  return (
    <>
      {/* <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main> */}
      <>
        {/* <EntryHeader title={`Tag: ${name}`} /> */}
        {/* <Container>
            {posts.edges.map((post) => (
              <Post
                title={post.node.title}
                content={post.node.content}
                date={post.node.date}
                author={post.node.author?.node.name}
                uri={post.node.uri}
                featuredImage={post.node.featuredImage?.node}
              />
            ))}
          </Container> */}
      </>
      {/* </Main> */}
      {/* <Footer title={siteTitle} menuItems={footerMenu} /> */}
    </>
  )
}

Component.query = gql`
  ${BlogInfoFragment}

  query GetTagPage($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Tag {
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
    uri,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION
  }
}
