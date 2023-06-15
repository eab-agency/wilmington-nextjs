import BlockDepartmentSelect from '@/components/blocks/custom/BlockDepartmentSelect'
import { gql, useQuery } from '@apollo/client'

const EabProgramDirectory = () => {
  const { loading, error, data } = useQuery(EabProgramDirectory.query)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return <BlockDepartmentSelect programDepartments={data?.departments.nodes} />
}

export default EabProgramDirectory

// query to get the faq data
EabProgramDirectory.query = gql`
  query getAllDepartments {
    departments {
      nodes {
        databaseId
        slug
        uri
        name
        description
        departmentFields {
          deptIcon
          deptImage {
            altText
            caption
            sourceUrl
            mediaDetails {
              height
              width
            }
          }
        }
        programs {
          nodes {
            slug
            uri
            title
          }
        }
      }
    }
  }
`
