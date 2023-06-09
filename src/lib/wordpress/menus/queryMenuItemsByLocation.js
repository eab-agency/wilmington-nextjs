import { gql } from '@apollo/client'

// Query: retrieve page by specified identifier.
const queryMenuItemsByLocation = gql`
  query GET_MENU_BY_LOCATION($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }, first: 100) {
      nodes {
        id
        parentId
        label
        path
        target
        title
      }
    }
  }
`

export default queryMenuItemsByLocation
