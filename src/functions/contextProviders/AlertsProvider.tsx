import {
  Alert,
  AlertBarData,
  AlertsContextType,
  PopupModalData
} from '@/types/alerts'
import { gql, useQuery } from '@apollo/client'
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { getCookie, setCookie } from '../cookieUtils'

/**
 * React context for managing alerts throughout the application.
 *
 * This context provides access to alert data, dismissal functionality,
 * and dismissal state checking. It should be used via the useAlerts hook.
 *
 * @example
 * ```tsx
 * const { alerts, dismissAlert, isDismissed } = useAlerts()
 * ```
 */
export const AlertsContext = createContext<AlertsContextType>({
  alerts: [],
  dismissAlert: () => {},
  isDismissed: () => false
})

/**
 * Props for the AlertsProvider component
 */
interface AlertsProviderProps {
  children: ReactNode
}

/**
 * Cookie prefix for dismissed alerts
 */
const DISMISSED_ALERT_COOKIE_PREFIX = 'dismissedAlert_'

/**
 * Cookie expiration in days
 */
const COOKIE_EXPIRATION_DAYS = 30

/**
 * GraphQL query to fetch alerts data
 */
const alertsQuery = gql`
  query GetAlerts {
    alerts {
      nodes {
        id
        alertMsgTitle
        alertType
        alertMessage
        alertButtonLabel
        alertButtonUri
        buttonLabel
        buttonUrl
        content
        date
        popupContent
        popupTitle
        popupVisibilityPage
        popupImage {
          altText
          id
          sourceUrl
        }
        status
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

/**
 * Custom hook to access the alerts context.
 *
 * Provides access to alert data, dismissal functionality, and dismissal state.
 * Must be used within an AlertsProvider component tree.
 *
 * @returns {AlertsContextType} The alerts context containing:
 *   - alerts: Array of current alerts
 *   - dismissAlert: Function to dismiss an alert by ID
 *   - isDismissed: Function to check if an alert is dismissed
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { alerts, dismissAlert, isDismissed } = useAlerts()
 *
 *   const handleDismiss = (alertId: number) => {
 *     dismissAlert(alertId)
 *   }
 *
 *   return (
 *     <div>
 *       {alerts.map(alert => (
 *         <div key={alert.id}>
 *           {alert.alertType === 'alert-bar' && <AlertBar data={alert} />}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export const useAlerts = () => useContext(AlertsContext)

/**
 * Provider component that manages alerts state and provides alert functionality.
 *
 * This component fetches alerts from WordPress via GraphQL, manages dismissal state
 * through cookies, and provides alert data to child components through React Context.
 *
 * Features:
 * - Fetches alerts from WordPress every 5 minutes
 * - Filters to show only published alerts
 * - Shows only the most recent alert of each type (alert-bar, popup-modal)
 * - Persists dismissal state in cookies for 30 days
 * - Provides type-safe access to alert data
 *
 * @param props - Component props
 * @param props.children - Child components that will have access to the alerts context
 * @returns Provider component that wraps children with alerts context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AlertsProvider>
 *       <Layout>
 *         <AlertBar />
 *         <HomePage />
 *         <HomepageModal />
 *       </Layout>
 *     </AlertsProvider>
 *   )
 * }
 * ```
 */
export const AlertsProvider: React.FC<AlertsProviderProps> = ({ children }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<
    Record<number, boolean>
  >({})
  const { data, loading, error } = useQuery(alertsQuery, {
    pollInterval: 5 * 60 * 1000 // Poll every 5 minutes to check for new alerts
  })

  // Load dismissed alerts from cookies on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadDismissedAlertsFromCookies = () => {
      const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
      const dismissedAlertsCookies = cookies.filter((cookie) =>
        cookie.startsWith(`${DISMISSED_ALERT_COOKIE_PREFIX}`)
      )

      const dismissedAlertsMap: Record<number, boolean> = {}

      dismissedAlertsCookies.forEach((cookie) => {
        const [key, value] = cookie.split('=')
        const alertId = parseInt(
          key.replace(DISMISSED_ALERT_COOKIE_PREFIX, ''),
          10
        )

        if (!isNaN(alertId) && value === 'true') {
          dismissedAlertsMap[alertId] = true
        }
      })

      setDismissedAlerts(dismissedAlertsMap)
    }

    loadDismissedAlertsFromCookies()
  }, [])

  /**
   * Dismisses an alert by ID and stores the dismissal state in a cookie.
   *
   * When an alert is dismissed, it will not be shown again for 30 days.
   * The dismissal state is stored in a cookie with the format:
   * `dismissedAlert_{alertId}=true`
   *
   * @param id - The unique ID of the alert to dismiss
   *
   * @example
   * ```tsx
   * const { dismissAlert } = useAlerts()
   *
   * const handleCloseAlert = () => {
   *   dismissAlert(123) // Dismiss alert with ID 123
   * }
   * ```
   */
  const dismissAlert = (id: number) => {
    // Update state
    setDismissedAlerts((prev) => ({
      ...prev,
      [id]: true
    }))

    // Save to cookie
    setCookie(`${DISMISSED_ALERT_COOKIE_PREFIX}${id}`, 'true', {
      expires: COOKIE_EXPIRATION_DAYS,
      path: '/'
    })
  }

  /**
   * Checks if an alert has been dismissed by the user.
   *
   * This function checks the internal dismissal state which is loaded
   * from cookies on component mount. An alert is considered dismissed
   * if the user has previously clicked the dismiss button.
   *
   * @param id - The unique ID of the alert to check
   * @returns True if the alert has been dismissed, false otherwise
   *
   * @example
   * ```tsx
   * const { isDismissed } = useAlerts()
   *
   * const shouldShowAlert = !isDismissed(alertId)
   * ```
   */
  const isDismissed = (id: number): boolean => {
    return dismissedAlerts[id] || false
  }

  /**
   * Processes and filters alerts from the GraphQL response.
   *
   * This function:
   * 1. Filters alerts to only include those with 'publish' status
   * 2. Sorts alerts by date (newest first)
   * 3. Groups alerts by type (alert-bar, popup-modal)
   * 4. Returns only the most recent alert of each type
   *
   * This ensures that only one alert bar and one popup modal are shown
   * at any given time, preventing UI clutter.
   *
   * @returns Array of processed alerts (max 2: one alert-bar, one popup-modal)
   *
   * @example
   * ```tsx
   * // Internal usage within AlertsProvider
   * const alerts = processAlerts()
   * // alerts might contain: [{ alertType: 'alert-bar', ... }, { alertType: 'popup-modal', ... }]
   * ```
   */
  const processAlerts = (): Alert[] => {
    if (!data?.alerts?.nodes) return []

    // Filter only published alerts
    const publishedAlerts = data.alerts.nodes.filter(
      (alert: any) => alert.status === 'publish'
    )

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
    const latestAlerts: Alert[] = []

    // Add the most recent alert-bar if it exists
    if (alertsByType['alert-bar'].length > 0) {
      latestAlerts.push(alertsByType['alert-bar'][0] as AlertBarData)
    }

    // Add the most recent popup-modal if it exists
    if (alertsByType['popup-modal'].length > 0) {
      latestAlerts.push(alertsByType['popup-modal'][0] as PopupModalData)
    }

    return latestAlerts
  }

  // Process alerts from the GraphQL response
  const alerts = processAlerts()

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        dismissAlert,
        isDismissed
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}

export default AlertsProvider
