import { Alert } from '@/types/alerts'
import { ApolloError, gql, useQuery } from '@apollo/client'
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

interface CustomOptions {
  addresscountry: string
  addresslocality: string
  addressregion: string
  postalcode: string
  streetaddress: string
  telephone: string
  tollfreenumber: string
}

interface CustomSettings {
  customOptions?: CustomOptions
}

interface CustomSettingsContextProps {
  alert: Alert | null
  closed: boolean
  showAlert: boolean
  clear: () => void
  customOptions: CustomOptions | null
}

export const CustomSettingsContext = createContext<CustomSettingsContextProps>(
  {} as CustomSettingsContextProps
)
CustomSettingsContext.displayName = 'CustomSettingsContext'

interface CustomSettingsProviderProps {
  children: ReactNode
  customSettings: {
    customOptions: CustomOptions
  }
  alert?: Alert
}

export function useCustomData() {
  return useContext(CustomSettingsContext)
}

export const CustomSettingsProvider = ({
  children
}: CustomSettingsProviderProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApolloError | null>(null)
  const [customSettingsData, setCustomSettingsData] =
    useState<CustomSettings | null>(null)

  const [alertState, setAlertState] = useState<Alert | null>(null)
  const [closed, setClosed] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleClearAlert = () => {
    setAlertState(null)
    setClosed(true)
  }

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData
  } = useQuery<any>(alertAndSettingsQuery, {
    pollInterval: 5 * 60 * 1000
  })

  useEffect(() => {
    if (queryLoading) {
      setLoading(true)
    }
    if (queryError) {
      console.error(queryError)
      setError(queryError)
    }
    if (queryData) {
      // Get the most recent published alert
      const publishedAlerts =
        queryData?.alerts?.nodes?.filter(
          (alert: any) => alert.status === 'publish'
        ) || []

      // Sort by date (newest first)
      publishedAlerts.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      // Get the most recent alert (if any)
      const latestAlert = publishedAlerts.length > 0 ? publishedAlerts[0] : null

      setShowAlert(!!latestAlert)
      setCustomSettingsData(queryData?.customSettings)
      setLoading(false)
      setAlertState(latestAlert)
    }
  }, [queryLoading, queryError, queryData])

  useEffect(() => {
    // Reset error state if it changes to allow subsequent fetch attempts
    setError(null)
  }, [queryError])

  return (
    <CustomSettingsContext.Provider
      value={{
        alert: alertState,
        closed: closed,
        showAlert: showAlert,
        clear: handleClearAlert,
        customOptions: customSettingsData?.customOptions || null
      }}
    >
      {children}
    </CustomSettingsContext.Provider>
  )
}

export default CustomSettingsContext

const alertAndSettingsQuery = gql`
  query GetLatestAlertAndCustomSettings {
    customSettings {
      customOptions {
        addresscountry
        addresslocality
        addressregion
        postalcode
        streetaddress
        telephone
        tollfreenumber
      }
    }
    alerts {
      nodes {
        id
        status
        date
        alertType
        alertMsgTitle
        alertMessage
        alertButtonLabel
        alertButtonUri
        buttonLabel
        buttonUrl
        popupTitle
        popupContent
        popupVisibilityPage
        popupImage {
          altText
          id
          sourceUrl
        }
        tags {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  }
`
