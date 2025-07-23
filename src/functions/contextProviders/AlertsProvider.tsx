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
 * Context for managing alerts
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
 * Hook to access the alerts context
 * @returns The alerts context
 */
export const useAlerts = () => useContext(AlertsContext)

/**
 * Provider component for alerts
 * @param props Component props
 * @returns Provider component
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
   * Dismiss an alert by ID
   * @param id The ID of the alert to dismiss
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
   * Check if an alert is dismissed
   * @param id The ID of the alert to check
   * @returns True if the alert is dismissed, false otherwise
   */
  const isDismissed = (id: number): boolean => {
    return dismissedAlerts[id] || false
  }

  /**
   * Filter and process alerts from the GraphQL response
   */
  const processAlerts = (): Alert[] => {
    console.log(
      '🚀 ~ processAlerts ~ data?.alerts?.nodes:',
      data?.alerts?.nodes
    )

    if (!data?.alerts?.nodes) return []

    // Filter only published alerts
    const publishedAlerts = data.alerts.nodes.filter(
      (alert: any) => alert.status === 'publish'
    )

    console.log('🚀 ~ processAlerts ~ publishedAlerts:', publishedAlerts)

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
      console.log('🚀 ~ processAlerts ~ alert.alertType:', alert.alertType)
      if (alert.alertType && alertsByType[alert.alertType]) {
        alertsByType[alert.alertType].push(alert)
      }
    })

    console.log('🚀 ~ processAlerts ~ alertsByType:', alertsByType)

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
