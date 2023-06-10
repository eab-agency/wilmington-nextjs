import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { ContentWrapper, Main, SEO } from '../components'
// import * as MENUS from '../constants/menus'
import Container from '@/components/atoms/Container'
import Layout from '@/components/common/Layout'
import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import FeaturedImage from '../components/common/FeaturedImage'
import PageHero from '../components/organisms/PageHero/PageHero'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {}
  const { title, content, featuredImage } = props?.data?.page ?? { title: '' }

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      {/* <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      /> */}
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <Main>
              <>
                <PageHero
                  sourceUrl={featuredImage?.node?.sourceUrl}
                  alt={featuredImage?.node?.altText}
                  imageMeta={featuredImage?.node?.mediaDetails}
                  text={title}
                />
                <div className="page-content">
                  <ContentWrapper content={content} />
                </div>
              </>
            </Main>
          </article>
        </Container>

        {/* <Footer title={siteTitle} menuItems={footerMenu} /> */}
      </Layout>
    </>
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  ${MainNavigation.fragments.entry}
  query GetFrontPageData(
    $databaseId: ID!
    $asPreview: Boolean = false
    $resourceLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      ...FeaturedImageFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    resourceMenuItems: menuItems(where: { location: $resourceLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    resourceLocation: MENUS.RESOURCE_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview
  }
}
