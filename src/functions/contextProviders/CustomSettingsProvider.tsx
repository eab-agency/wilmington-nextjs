import { Alert } from '@/types/alerts'
import { ApolloError, gql, useQuery } from '@apollo/client'
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { getCookie, setCookie } from '../cookieUtils'

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
  clearAlertBar: () => void
  clearPopupModal: (id: string) => void
  customOptions: CustomOptions | null
}

export const CustomSettingsContext = createContext<CustomSettingsContextProps>(
  {} as CustomSettingsContextProps
)
CustomSettingsContext.displayName = 'CustomSettingsContext'

// Cookie constants for alert dismissal
const DISMISSED_ALERT_COOKIE_PREFIX = 'dismissedAlert_'
const DISMISSED_MODAL_COOKIE_PREFIX = 'dismissedModal_'
const COOKIE_EXPIRATION_DAYS = 30

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
  const [dismissedAlerts, setDismissedAlerts] = useState<
    Record<string, boolean>
  >({})
  const [dismissedModals, setDismissedModals] = useState<
    Record<string, boolean>
  >({})

  // Handles clearing an alert bar and storing the dismissal in a cookie
  const handleClearAlertBar = () => {
    if (alertBarState?.id) {
      // Store dismissal in state
      setDismissedAlerts((prev) => ({
        ...prev,
        [alertBarState.id]: true
      }))

      // Store dismissal in cookie - using consistent naming pattern
      const cookieId = String(alertBarState.id)
      setCookie(`${DISMISSED_ALERT_COOKIE_PREFIX}${cookieId}`, 'true', {
        expires: COOKIE_EXPIRATION_DAYS,
        path: '/'
      })

      // Only set the alert bar state to null
      setAlertBarState(null)
    }
  }

  // Handles clearing a popup modal and storing the dismissal in a cookie
  const handleClearPopupModal = useCallback((id: string) => {
    setDismissedModals((prev) => ({
      ...prev,
      [id]: true
    }))

    // Set cookie specifically for this modal
    const cookieId = String(id)
    const cookieName = `${DISMISSED_MODAL_COOKIE_PREFIX}${cookieId}`

    setCookie(cookieName, 'true', {
      path: '/',
      expires: COOKIE_EXPIRATION_DAYS,
      sameSite: 'lax'
    })
  }, [])

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

      // Check if each alert type is dismissed - using explicit ID check
      // Check if each alert type is dismissed - using explicit ID check with string conversion
      // Check if alerts are already dismissed
      const isAlertBarDismissed =
        latestAlertBar && dismissedAlerts[String(latestAlertBar.id)] === true

      const isPopupModalDismissed =
        latestPopupModal &&
        dismissedModals[String(latestPopupModal.id)] === true

      const alertBarVisible = latestAlertBar && !isAlertBarDismissed
      const popupModalVisible = latestPopupModal && !isPopupModalDismissed

      // Show alert if either type is visible and not dismissed
      const shouldShowAlert = alertBarVisible || popupModalVisible

      setShowAlert(shouldShowAlert)
      setCustomSettingsData(queryData?.customSettings)
      setLoading(false)
      setAlertState(latestAlert)
      setAlertBarState(latestAlertBar)
      setPopupModalState(latestPopupModal)
    }
  }, [queryLoading, queryError, queryData, dismissedAlerts, dismissedModals])

  useEffect(() => {
    // Reset error state if it changes to allow subsequent fetch attempts
    setError(null)
  }, [queryError])

  // Load dismissed alerts from cookies on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadDismissedAlertsFromCookies = () => {
      const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
      const dismissedAlertsCookies = cookies.filter((cookie) =>
        cookie.startsWith(`${DISMISSED_ALERT_COOKIE_PREFIX}`)
      )

      const dismissedAlertsMap: Record<string, boolean> = {}

      dismissedAlertsCookies.forEach((cookie) => {
        const [key, value] = cookie.split('=')
        // Properly decode the URL-encoded ID
        const alertId = decodeURIComponent(
          key.replace(`${DISMISSED_ALERT_COOKIE_PREFIX}`, '')
        )

        // Accept any truthy value as confirmation of dismissal
        if (
          alertId &&
          (value === 'true' || value === '1' || value === '' || value)
        ) {
          dismissedAlertsMap[alertId] = true
        }
      })

      setDismissedAlerts(dismissedAlertsMap)
    }

    loadDismissedAlertsFromCookies()
  }, [])

  // Load dismissed modals from cookies on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadDismissedModalsFromCookies = () => {
      const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
      const dismissedModalsCookies = cookies.filter((cookie) =>
        cookie.startsWith(`${DISMISSED_MODAL_COOKIE_PREFIX}`)
      )

      const dismissedModalsMap: Record<string, boolean> = {}

      dismissedModalsCookies.forEach((cookie) => {
        const [key, value] = cookie.split('=')
        // Properly decode the URL-encoded ID
        const modalId = decodeURIComponent(
          key.replace(`${DISMISSED_MODAL_COOKIE_PREFIX}`, '')
        )

        // Accept any truthy value as confirmation of dismissal
        if (
          modalId &&
          (value === 'true' || value === '1' || value === '' || value)
        ) {
          dismissedModalsMap[modalId] = true
        }
      })

      setDismissedModals(dismissedModalsMap)
    }

    loadDismissedModalsFromCookies()
  }, [])

  return (
    <CustomSettingsContext.Provider
      value={{
        alert: alertState,
        alertBarAlert: alertBarState,
        popupModalAlert: popupModalState,
        closed: closed,
        showAlert: showAlert,
        clearAlertBar: handleClearAlertBar,
        clearPopupModal: handleClearPopupModal,
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
