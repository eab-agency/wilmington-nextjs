import {gql} from '@apollo/client'

// Query: retrieve post by specified identifier.
const queryStudentOrgById = gql`
  query GET_STUDENTORG_BY_ID($id: ID!) {
    studentOrg(id: $id, idType: DATABASE_ID) {
      title
      content
      id
    }
  }
`

export default queryStudentOrgById
