import { useCustomData } from '@/functions/contextProviders/CustomSettingsProvider'
import { AlertBarData } from '@/types/alerts'
import React from 'react'
import styles from './AlertBar.module.scss'

/**
 * AlertBar component that displays alert bars from the alerts system
 *
 * This component renders an alert bar at the top of the page based on data from the CustomSettingsProvider.
 * It supports dismissal with cookie persistence.
 *
 * Features:
 * - Displays alert bars from WordPress with dynamic content
 * - Handles alert dismissal with cookie persistence
 * - Supports alert bars with or without buttons
 * - Supports different styles based on alert tags
 *
 * @returns React component that renders an alert bar when conditions are met
 */
const AlertBar: React.FC = () => {
  const { alertBarAlert, showAlert, clearAlertBar } = useCustomData()

  // Use the specific alert bar data
  const alertBarData = alertBarAlert as AlertBarData | null

  // If no alert bar data or showAlert is false, don't render anything
  if (!alertBarData || !showAlert) return null

  // Get tag class for styling (if available)
  const tagName = alertBarData.tags?.edges[0]?.node?.name?.toLowerCase()
  const tagClass = tagName ? styles[tagName] : ''

  /**
   * Handle closing the alert
   * Dismisses the alert and stores the state in a cookie
   */
  const handleClose = () => {
    // Use specific clearAlertBar method to only dismiss this type of alert
    clearAlertBar()
  }

  return (
    <div className={`${styles.alertBar} ${tagClass}`}>
      <div className={styles.alertBarContent}>
        <div className={styles.alertBarText}>
          <p>{alertBarData.alertMsgTitle}</p>
          {alertBarData.alertMessage && <p>{alertBarData.alertMessage}</p>}
          {/* Support both legacy and new button fields */}
          {(alertBarData.buttonLabel || alertBarData.alertButtonLabel) &&
            (alertBarData.buttonUrl || alertBarData.alertButtonUri) && (
              <a href={alertBarData.buttonUrl || alertBarData.alertButtonUri}>
                {alertBarData.buttonLabel || alertBarData.alertButtonLabel}
              </a>
            )}
        </div>
        <button
          className={styles.alertBarClose}
          onClick={handleClose}
          aria-label="Close alert"
        >
          <span className={styles.srOnly}>Close</span>
        </button>
      </div>
    </div>
  )
}

export default AlertBar
