import defaultPageData from '@/lib/wordpress/_query-partials/defaultPageData'
import seoPostFields from '@/lib/wordpress/_query-partials/seoPostFields'
import { gql } from '@apollo/client'
import {
  archiveDepartmentFragment,
  archiveDepartments
} from './queryDepartmentsArchive'

// Query: retrieve posts tag archive.
const queryPostsByDepartment = gql`
  query GET_POSTS_BY_DEPARTMENT(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $orderBy: PostObjectsConnectionOrderbyEnum = DATE
    $order: OrderEnum = DESC
    $imageSize: MediaItemSizeEnum = THUMBNAIL
    $id: ID!
    $idType: DepartmentIdType = SLUG
  ) {
    ${defaultPageData}
    department(id: $id, idType: $idType) {
      name
      ${seoPostFields}
      ${archiveDepartments}
    }
  }
  ${archiveDepartmentFragment}
`

export default queryPostsByDepartment
