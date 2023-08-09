import { gql } from '@apollo/client'
// import { Container, Footer, Header, Hero, Main, SEO } from '../components'
import { SEO } from '@/components'
import Container from '@/components/atoms/Container'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import PageHero from '@/components/organisms/PageHero/PageHero'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'

export default function Component(props) {
  const { content, featuredImage, testimonialFields } = props.data.nodeByUri

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
            <div className="page-content">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

Component.variables = ({ uri }, ctx) => {
  return {
    uri,
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
    $uri: String!
    $imageSize: MediaItemSizeEnum = LARGE
    $asPreview: Boolean = false
  ) {
    nodeByUri(uri: $uri, asPreview: $asPreview) {
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
