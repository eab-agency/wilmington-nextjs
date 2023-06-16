import { SEO } from '@/components'
import RichText from '@/components/atoms/RichText'
import BlockDepartmentSelect from '@/components/blocks/custom/BlockDepartmentSelect'
import Layout from '@/components/common/Layout'
import { BlogInfoFragment } from '@/fragments/GeneralSettings'
import { gql, useQuery } from '@apollo/client'
import EabProgramDirectory from '../wp-blocks/custom/EabProgramDirectory'

export default function ArchivePrograms(props) {
  const { loading, error, data } = useQuery(EabProgramDirectory.query)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const { label, contentNodes } = props.data.nodeByUri

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {}

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Layout className="thelayoutclass">
        <article className="inner-wrap">
          <RichText tag="h1">{label}</RichText>
          <BlockDepartmentSelect programDepartments={data?.departments.nodes} />
        </article>
      </Layout>
    </>
  )
}

ArchivePrograms.variables = ({ uri }) => {
  return { uri }
}

ArchivePrograms.query = gql`
  ${BlogInfoFragment}
  query ProgramArchive($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on ContentType {
        label
        description
        contentNodes {
          nodes {
            databaseId
            uri
            ... on NodeWithTitle {
              title
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
