import { SEO } from '@/components'
import Breadcrumbs from '@/components/atoms/Breadcrumbs'
import Container from '@/components/atoms/Container'
import Image from '@/components/atoms/Image'
import RichText from '@/components/atoms/RichText'
import FeaturedImage from '@/components/common/FeaturedImage'
import Layout from '@/components/common/Layout'
import ProgramCard from '@/components/molecules/ProgramCard'
import RelatedProgramCard from '@/components/molecules/RelatedProgramCard'
import { seoPostFields } from '@/fragments'
import { gql } from '@apollo/client'

function ProgramList({ programs }) {
  const renderPrograms = (programType, title) => {
    if (programs[programType] && programs[programType].length > 0) {
      return (
        <>
          <h4>{title}</h4>
          {programs[programType].map((program, index) => (
            <>
              {/* TODO: Andrei, there were two different types of program cards. so i hooked both of them up */}
              {/* <RelatedProgramCard
                key={index}
                title={program.title}
                link={program.link}
                excerpt={program.excerpt}
              /> */}
              <ProgramCard
                key={index}
                title={program.title}
                excerpt={program.excerpt}
                link={program.link}
                image={program.featuredImage?.node}
              />
            </>
          ))}
        </>
      )
    }
    return null
  }

  return (
    <>
      {renderPrograms('major', 'Majors')}
      {renderPrograms('minor', 'Minors')}
    </>
  )
}

export default function TaxonomyDepartment(props) {
  const { name, description, seo, departmentFields, programs } =
    props.data.nodeByUri
  const displayName = `${name} Department`

  const filteredNodes = programs.nodes.filter((node) => node.ancestors === null)
  const updatedPrograms = programsByDegree(filteredNodes)

  function programsByDegree(data) {
    const programsArray = {
      major: [],
      minor: []
    }

    if (data) {
      data.forEach((program) => {
        const degree = program.programFields.program.degree
        const degreeTitle = program.programFields.program.degreeTitle
        // const title =
        //   degreeTitle && degreeTitle.trim()
        //     ? `${program.title} - ${degreeTitle}`
        //     : program.title

        if (degree === 'major' || degree === 'major-grad') {
          programsArray.major.push({
            title: program.title,
            id: program.id,
            link: program.uri,
            degreeTitle,
            ...program
          })
        } else if (degree === 'minor') {
          programsArray.minor.push({
            title: program.title,
            id: program.id,
            link: program.uri,
            degreeTitle,
            ...program
          })
        }
      })
    }

    return programsArray
  }

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.metaDesc}
        fullHead={seo.fullHead}
      />
      <Layout className="thelayoutclass">
        <Container>
          <article className="inner-wrap">
            <div className="page-content">
              {!!seo?.breadcrumbs && (
                <Breadcrumbs breadcrumbs={seo?.breadcrumbs} />
              )}
              <RichText tag="h1">{displayName}</RichText>
              <RichText>{description}</RichText>
              <Image
                imageMeta={departmentFields?.deptImage}
                alt={departmentFields?.deptImage?.altText}
                src={departmentFields?.deptImage?.sourceUrl}
              />
              <div className="relatedPrograms">
                <ProgramList programs={updatedPrograms} />
              </div>
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

TaxonomyDepartment.variables = ({ uri }) => {
  return { uri }
}

TaxonomyDepartment.query = gql`
  ${FeaturedImage.fragments.entry}

  query TaxonomyDepartment(
    $uri: String!
    $imageSize: MediaItemSizeEnum = MEDIUM
  ) {
    nodeByUri(uri: $uri) {
      ... on Department {
        ${seoPostFields}
        id
        name
        description
        departmentFields {
          deptImage {
            altText
            mediaDetails {
              width
              height
            }
            sourceUrl(size: LARGE)
          }
        }
        programs {
          nodes {
            programFields {
              program {
                degree
                degreeTitle
              }
            }
          ...FeaturedImageFragment
            excerpt
          title
          uri
          ancestors {
            nodes {
              uri
              id
            }
          }
          }
        }
      }
    }
  }
`
