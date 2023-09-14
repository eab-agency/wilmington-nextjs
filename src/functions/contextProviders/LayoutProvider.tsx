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

interface LayoutData {
  footerMenuItems?: { nodes: any[] } | null
  resourceMenuItems?: { nodes: any[] } | null
  mainMenuItems?: { nodes: any[] } | null
  utilityMenuItems?: { nodes: any[] } | null
}

interface LayoutContextProps {
  loading: boolean
  error: ApolloError | null
  data: LayoutData | null
}

const LayoutContext = createContext<LayoutContextProps>({
  loading: true,
  error: null,
  data: null
})

export function useLayoutData() {
  return useContext(LayoutContext)
}

interface LayoutProviderProps {
  children: ReactNode
}

const layoutVariables = {
  resourceLocation: MENUS.RESOURCE_LOCATION,
  footerLocation: MENUS.FOOTER_LOCATION,
  mainLocation: MENUS.PRIMARY_LOCATION,
  utilityLocation: MENUS.UTILITY_LOCATION
}

const layoutQuery = gql`
  ${MainNavigation.fragments.entry}
  query GetLayoutData(
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

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApolloError | null>(null)
  const [data, setData] = useState<LayoutData | null>(mockData)

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData
  } = useQuery<any>(layoutQuery, { variables: layoutVariables })

  useEffect(() => {
    if (queryLoading) setLoading(true)
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
    <LayoutContext.Provider value={{ loading, error, data }}>
      {children}
    </LayoutContext.Provider>
  )
}
