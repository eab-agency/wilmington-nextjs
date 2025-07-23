/**
 * Alert Data Types
 *
 * This file contains TypeScript interfaces for the alerts feature.
 * It defines the data structures for alert bar and popup modal alerts,
 * as well as the context type for managing alerts.
 */

/**
 * Base interface for all alert types
 */
export interface BaseAlert {
  id: number
  status: string
  date: string
  alertType: 'alert-bar' | 'popup-modal'
}

/**
 * Interface for alert bar data
 */
export interface AlertBarData extends BaseAlert {
  alertType: 'alert-bar'
  alertMsgTitle: string
  alertMessage: string
  alertButtonLabel: string
  alertButtonUri: string
  buttonLabel: string
  buttonUrl: string
}

/**
 * Interface for popup modal data
 */
export interface PopupModalData extends BaseAlert {
  alertType: 'popup-modal'
  popupTitle: string
  popupContent: string
  popupVisibilityPage: string | null
  buttonLabel: string
  buttonUrl: string
  popupImage: {
    altText: string
    id: number
    sourceUrl: string
  } | null
}

/**
 * Union type for all alert types
 */
export type Alert = AlertBarData | PopupModalData

/**
 * Cookie options interface
 */
export interface CookieOptions {
  path?: string
  expires?: Date | number | string
  maxAge?: number
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * Interface for the alerts context
 */
export interface AlertsContextType {
  /**
   * Array of all alerts
   */
  alerts: Alert[]

  /**
   * Dismiss an alert by ID
   * @param id The ID of the alert to dismiss
   */
  dismissAlert: (id: number) => void

  /**
   * Check if an alert is dismissed
   * @param id The ID of the alert to check
   * @returns True if the alert is dismissed, false otherwise
   */
  isDismissed: (id: number) => boolean
}
