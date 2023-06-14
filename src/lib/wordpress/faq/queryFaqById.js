import { gql } from '@apollo/client'

// Query: retrieve post by specified identifier.
const queryFAQById = gql`
  query GET_FAQ_BY_ID($id: ID!) {
    fAQ(id: $id, idType: DATABASE_ID) {
      title
      content
      id
    }
  }
`

export default queryFAQById
