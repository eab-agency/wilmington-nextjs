import Preloader from '@/components/atoms/Preloader'
import BlockDepartmentSelect from '@/components/blocks/custom/BlockDepartmentSelect'
import { gql, useQuery } from '@apollo/client'

const EabProgramDirectory = () => {
  const { loading, error, data } = useQuery(EabProgramDirectory.query)

  if (loading) return <Preloader />
  if (error) return <p>Error: {error.message}</p>

  return <BlockDepartmentSelect programDepartments={data?.departments.nodes} />
}

export default EabProgramDirectory

// query to get the faq data
EabProgramDirectory.query = gql`
  query getAllDepartments {
    departments(where: { order: ASC }) {
      nodes {
        databaseId
        slug
        uri
        name
        description
        departmentFields {
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
        programs(where: { orderby: { field: TITLE, order: ASC } }) {
          nodes {
            slug
            uri
            title
            excerpt
            ancestors {
              nodes {
                id
              }
            }
          }
        }
      }
    }
  }
`

EabProgramDirectory.displayName = 'EabProgramDirectory'
