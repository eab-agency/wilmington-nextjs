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

/**
 * Interface for custom site options from WordPress
 */
interface CustomOptions {
  addressCountry: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  streetAddress: string
  telephone: string
  tollfreeNumber: string
}

/**
 * Interface for custom settings data structure
 */
interface CustomSettings {
  customOptions?: CustomOptions
}

/**
 * Interface for the CustomSettingsContext props
 *
 * This context provides access to alerts and custom site settings from WordPress.
 * It manages alert state, dismissal functionality, and site configuration options.
 */
interface CustomSettingsContextProps {
  /** The most recent alert of any type */
  alert: Alert | null
  /** The most recent alert bar alert */
  alertBarAlert: Alert | null
  /** The most recent popup modal alert */
  popupModalAlert: Alert | null
  /** Legacy closed state (deprecated) */
  closed: boolean
  /** Whether any alert should be shown */
  showAlert: boolean
  /** Function to dismiss the current alert bar */
  clearAlertBar: () => void
  /** Function to dismiss a popup modal by ID */
  clearPopupModal: (id: string) => void
  /** Custom site options from WordPress */
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

/**
 * Props for the CustomSettingsProvider component
 */
interface CustomSettingsProviderProps {
  children: ReactNode
  customSettings: {
    customOptions: CustomOptions
  }
  alert?: Alert
}

/**
 * Custom hook to access the CustomSettingsContext
 *
 * Provides access to alerts and custom site settings. This hook should be used
 * within components that need to display alerts or access site configuration.
 *
 * @returns {CustomSettingsContextProps} The context containing alerts and settings
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { alertBarAlert, showAlert, clearAlertBar } = useCustomData()
 *
 *   if (!alertBarAlert || !showAlert) return null
 *
 *   return (
 *     <div>
 *       <p>{alertBarAlert.alertMsgTitle}</p>
 *       <button onClick={clearAlertBar}>Dismiss</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useCustomData() {
  return useContext(CustomSettingsContext)
}

/**
 * Provider component that manages custom settings and alerts from WordPress
 *
 * This component fetches and manages:
 * - Site-wide alerts (alert bars and popup modals)
 * - Custom site settings and configuration options
 * - Alert dismissal state with cookie persistence
 *
 * Features:
 * - Fetches data from WordPress via GraphQL every 5 minutes
 * - Filters alerts to show only published ones
 * - Shows only the most recent alert of each type
 * - Persists alert dismissal state in cookies for 30 days
 * - Provides type-safe access to alerts and settings
 *
 * @param props - Component props
 * @param props.children - Child components that will have access to the context
 * @returns Provider component that wraps children with custom settings context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <CustomSettingsProvider>
 *       <Layout>
 *         <AlertBar />
 *         <HomePage />
 *         <HomepageModal />
 *       </Layout>
 *     </CustomSettingsProvider>
 *   )
 * }
 * ```
 */
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

  /**
   * Handles clearing an alert bar and storing the dismissal in a cookie
   *
   * When called, this function:
   * 1. Updates the dismissed alerts state
   * 2. Sets a cookie to remember the dismissal for 30 days
   * 3. Removes the alert bar from the UI
   *
   * The dismissal is stored with the format: `dismissedAlert_{alertId}=true`
   */
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

  /**
   * Handles clearing a popup modal and storing the dismissal in a cookie
   *
   * When called, this function:
   * 1. Updates the dismissed modals state for the specified ID
   * 2. Sets a cookie to remember the dismissal for 30 days
   *
   * The dismissal is stored with the format: `dismissedModal_{modalId}=true`
   *
   * @param id - The unique ID of the modal to dismiss
   */
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

/**
 * GraphQL query to fetch alerts and custom settings from WordPress
 *
 * This query retrieves:
 * - All alerts with their complete data structure
 * - Custom site settings and configuration options
 *
 * The query is executed every 5 minutes to check for new alerts and settings.
 */
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
