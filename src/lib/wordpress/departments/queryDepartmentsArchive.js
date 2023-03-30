import archivePageInfo from '@/lib/wordpress/_query-partials/archivePageInfo'
import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import featuredImagePostFields from '@/lib/wordpress/_query-partials/featuredImagePostFields'
import globalPostFields from '@/lib/wordpress/_query-partials/globalPostFields'
import { gql } from '@apollo/client'

// Fragment: retrieve archive post fields.
export const archiveDepartmentFragment = gql`
  fragment ArchiveDepartmentFields on Department {
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
`

// Query partial: retrieve archive fields.
export const archiveDepartments = `
  departments(last: 1000) {
    ${archivePageInfo}
    edges {
      node {
        ...ArchiveDepartmentFields
      }
    }
  }
`

// Query: retrieve posts archive.
const queryDepartmentsArchive = gql`
  query GET_DEPARTMENTS_ARCHIVE {
    ${defaultPageData}
    ${archiveDepartments}
  }
  ${archiveDepartmentFragment}
`

export default queryDepartmentsArchive
