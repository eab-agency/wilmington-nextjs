import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { ContentWrapper, Main, SEO } from '../components'
// import * as MENUS from '../constants/menus'
import Container from '@/components/atoms/Container'
import Layout from '@/components/common/Layout'
import FeaturedImage from '../components/common/FeaturedImage'
import PageHero from '../components/organisms/PageHero/PageHero'
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
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      ...FeaturedImageFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview
  }
}
