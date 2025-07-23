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
  alertBarAlert: Alert | null
  popupModalAlert: Alert | null
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
  const [alertBarState, setAlertBarState] = useState<Alert | null>(null)
  const [popupModalState, setPopupModalState] = useState<Alert | null>(null)
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
      console.error('🚀 ~ CustomSettingsProvider ~ GraphQL Error:', queryError)
      console.error('🚀 ~ CustomSettingsProvider ~ Error details:', {
        message: queryError.message,
        graphQLErrors: queryError.graphQLErrors,
        networkError: queryError.networkError
      })
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

      // Group alerts by type
      const alertsByType: Record<string, any[]> = {
        'alert-bar': [],
        'popup-modal': []
      }

      publishedAlerts.forEach((alert: any) => {
        if (alert.alertType && alertsByType[alert.alertType]) {
          alertsByType[alert.alertType].push(alert)
        }
      })

      // Get the most recent alert of each type
      const latestAlertBar =
        alertsByType['alert-bar'].length > 0
          ? alertsByType['alert-bar'][0]
          : null
      const latestPopupModal =
        alertsByType['popup-modal'].length > 0
          ? alertsByType['popup-modal'][0]
          : null
      const latestAlert = publishedAlerts.length > 0 ? publishedAlerts[0] : null

      setShowAlert(!!(latestAlertBar || latestPopupModal))
      setCustomSettingsData(queryData?.customSettings)
      setLoading(false)
      setAlertState(latestAlert)
      setAlertBarState(latestAlertBar)
      setPopupModalState(latestPopupModal)
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
        alertBarAlert: alertBarState,
        popupModalAlert: popupModalState,
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
        telephone
        addressCountry
        addressLocality
        addressRegion
        postalCode
        streetAddress
        tollfreeNumber
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
