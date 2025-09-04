import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { SEO } from '@/components'
import Container from '@/components/atoms/Container'
import Preloader from '@/components/atoms/Preloader'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'

export default function Component(props) {
  if (props.loading) {
    return <Preloader />
  }
  const { content, featuredImage, testimonialFields } = props.data.testimonial

  const { testimonial } = testimonialFields
  const title = `${testimonial?.first} ${testimonial?.last}`
  const { description: siteDescription } = props?.data?.generalSettings ?? {}

  return (
    <>
      <SEO
        seo={{ title: `Testimony of ${title}`, description: siteDescription }}
      />
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <PageHero
              sourceUrl={featuredImage?.node?.sourceUrl}
              alt={featuredImage?.node?.altText}
              imageMeta={featuredImage?.node?.mediaDetails}
              text={title}
            />
            <div className="page-content" id="page-content">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview
  }
}

/**
 * Compose the GraphQL query for our page's data.
 */
Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}

  query GetSingular(
    $databaseId: ID!
    $imageSize: MediaItemSizeEnum = LARGE
    $asPreview: Boolean = false
  ) {
    testimonial(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      ... on Testimonial {
        content
        testimonialFields {
          testimonial {
            desc
            first
            last
          }
        }
      }
      ... on NodeWithFeaturedImage {
        ...FeaturedImageFragment
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
