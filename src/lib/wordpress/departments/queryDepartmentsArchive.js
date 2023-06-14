import archivePageInfo from '@/lib/wordpress/_query-partials/archivePageInfo'
import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
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
  departments(
    first: $first
    last: $last
    after: $after
    before: $before
    where: {orderby: {field: $orderBy, order: $order}}
    ) {
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
