import MainNavigation from '@/components/molecules/Navigation/MainNavigation'
import { ApolloError, gql, useQuery } from '@apollo/client'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import * as MENUS from '../../constants/menus'
import mockData from './mockData.json'

interface MenuData {
  footerMenuItems?: { nodes: any[] } | null
  resourceMenuItems?: { nodes: any[] } | null
  mainMenuItems?: { nodes: any[] } | null
  utilityMenuItems?: { nodes: any[] } | null
}

interface MenuContextProps {
  loading: boolean
  error: ApolloError | null
  data: MenuData | null
}

const MenuContext = createContext<MenuContextProps>({
  loading: true,
  error: null,
  data: null
})

export function useMenuData() {
  return useContext(MenuContext)
}

interface MenuProviderProps {
  children: ReactNode
}

const menuVariables = {
  resourceLocation: MENUS.RESOURCE_LOCATION,
  footerLocation: MENUS.FOOTER_LOCATION,
  mainLocation: MENUS.PRIMARY_LOCATION,
  utilityLocation: MENUS.UTILITY_LOCATION
}

const menuQuery = gql`
  ${MainNavigation.fragments.entry}
  query GetMenuData(
    $resourceLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $mainLocation: MenuLocationEnum
    $utilityLocation: MenuLocationEnum
  ) {
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    resourceMenuItems: menuItems(
      where: { location: $resourceLocation }
      first: 20
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    mainMenuItems: menuItems(where: { location: $mainLocation }, first: 100) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    utilityMenuItems: menuItems(
      where: { location: $utilityLocation }
      first: 100
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`

export function MenuProvider({ children }: MenuProviderProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApolloError | null>(null)
  const [data, setData] = useState<MenuData | null>(mockData)

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData
  } = useQuery<any>(menuQuery, { variables: menuVariables })

  useEffect(() => {
    if (queryLoading) {
      setLoading(true)
    }
    if (queryError) setError(queryError)
    if (queryData) {
      setData(queryData)
      setLoading(false)
    }
  }, [queryLoading, queryError, queryData])

  if (error) {
    console.error(error)
    return null
  }

  return (
    <MenuContext.Provider value={{ loading, error, data }}>
      {children}
    </MenuContext.Provider>
  )
}
