import { gql } from '@apollo/client'
import { ContentWrapper, Main } from '../components'
// import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? []
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? []
  const { title, content, featuredImage } = props?.data?.page ?? { title: '' }

  return (
    <>
      {/* <SEO
        title={siteTitle}
        description={siteDescription}
        imageUrl={featuredImage?.node?.sourceUrl}
      /> */}
      {/* <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      /> */}
      <Main>
        <>
          {/* <EntryHeader title={title} image={featuredImage?.node} /> */}
          <ContentWrapper content={content} />
        </>
      </Main>
      {/* <Footer title={siteTitle} menuItems={footerMenu} /> */}
    </>
  )
}

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    // headerLocation: MENUS.PRIMARY_LOCATION,
    // footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview
  }
}

Component.query = gql`
  ${BlogInfoFragment}

  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
    }
    generalSettings {
      ...BlogInfoFragment
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`
