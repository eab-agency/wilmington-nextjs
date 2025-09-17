import { useCustomData } from '@/functions/contextProviders/CustomSettingsProvider'
import { PopupModalData } from '@/types/alerts'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './HomepageModal.module.css'

// Cookie name constants
const MODAL_COOKIE_PREFIX = 'dismissedModal_'

/**
 * HomepageModal component that displays popup modals from the alerts system
 *
 * This component renders a modal popup based on data from the AlertsContext.
 * It supports both global modals and page-specific modals.
 *
 * Features:
 * - Displays modals from WordPress with dynamic content
 * - Supports page-specific visibility (shows only on specified pages)
 * - Handles modal dismissal with cookie persistence
 * - Supports modals with or without images
 * - Renders HTML content from WordPress
 *
 * @returns React component that renders a modal popup when conditions are met
 */
const HomepageModal: React.FC = () => {
  const { popupModalAlert, showAlert, clearPopupModal } = useCustomData()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if we have an alert and it's a popup-modal type
  const modalData =
    popupModalAlert && popupModalAlert.alertType === 'popup-modal'
      ? (popupModalAlert as PopupModalData)
      : null

  /**
   * Sets a cookie to track modal dismissal.
   *
   * Creates a cookie with 30-day expiration to remember that the user
   * has dismissed this specific modal. The cookie format is:
   * `dismissedModal_{modalId}=true`
   *
   * @param modalId - The unique ID of the modal to mark as dismissed
   */
  const setDismissedCookie = (modalId: any) => {
    // Create a date 30 days in the future
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    // Set the cookie directly
    document.cookie = `${MODAL_COOKIE_PREFIX}${modalId}=true; expires=${expiryDate.toUTCString()}; path=/`
  }

  // Check if a modal has been dismissed via cookie
  const checkIfDismissed = (modalId: any): boolean => {
    if (typeof document === 'undefined') return false

    // Look for a specific cookie for this modal
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
    return cookies.some((cookie) =>
      cookie.startsWith(`${MODAL_COOKIE_PREFIX}${modalId}=true`)
    )
  }

  // Check for dismissed state on mount and when modal data changes
  useEffect(() => {
    if (!modalData?.id) return

    // Check if this specific modal has been dismissed
    const modalDismissed = checkIfDismissed(modalData.id)
    setIsDismissed(modalDismissed)
  }, [modalData?.id])

  // Control modal visibility with animation
  useEffect(() => {
    // Normalize the popupVisibilityPage value - handles 'homepage' special case
    const normalizedVisibilityPage =
      modalData?.popupVisibilityPage === 'homepage'
        ? '/'
        : modalData?.popupVisibilityPage

    // Normalize the current path for comparison - removing query params and hash fragments
    const normalizedCurrentPath = router.asPath.split('?')[0].split('#')[0]

    // Handle trailing slashes for consistent comparison
    const isHomepage =
      normalizedCurrentPath === '/' || normalizedCurrentPath === ''

    // Check if current path matches the visibility page (accounting for homepage special case)
    const pathMatches = normalizedVisibilityPage
      ? (normalizedVisibilityPage === '/' && isHomepage) || // Special homepage check
        normalizedCurrentPath === normalizedVisibilityPage || // Exact match
        normalizedCurrentPath.replace(/\/$/, '') ===
          normalizedVisibilityPage.replace(/\/$/, '') // Without trailing slashes
      : false

    const shouldShowModalBasedOnAllFactors =
      modalData &&
      showAlert &&
      !isDismissed &&
      (!normalizedVisibilityPage || pathMatches)

    if (shouldShowModalBasedOnAllFactors) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
    return () => {}
  }, [modalData, showAlert, router.asPath, isDismissed])

  // If no modal data or it shouldn't be shown, don't render anything
  if (!isVisible || !modalData) return null

  /**
   * Handles closing the modal popup.
   *
   * This function:
   * 1. Sets a dismissal cookie for the current modal
   * 2. Updates the local dismissed state
   * 3. Hides the modal with animation
   * 4. Calls the provider's clear method as backup
   *
   * The modal will not appear again for 30 days after dismissal.
   *
   * @example
   * ```tsx
   * <button onClick={handleClose}>Close Modal</button>
   * ```
   */
  const handleClose = () => {
    if (modalData?.id) {
      // Set our own cookie directly - more reliable
      setDismissedCookie(modalData.id)
      setIsDismissed(true)
    }

    setIsVisible(false)
    // Small delay to allow animation to complete before removing from DOM
    setTimeout(() => {
      // Also call provider's method as a backup
      if (modalData?.id) {
        clearPopupModal(String(modalData.id))
      }
    }, 300)
  }

  /**
   * Handles clicks on the modal wrapper to close modal when clicking outside content.
   *
   * This function checks if the click target is the modal wrapper itself
   * (not a child element). If so, it closes the modal.
   *
   * @param event - The mouse event from the click
   */
  const handleWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was directly on the wrapper (not on child elements)
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  /**
   * Handles clicks on links and buttons within the modal content.
   *
   * This function detects clicks on any link (a tag) or button within the modal
   * and saves the dismissal cookie, so the modal won't appear again.
   * Uses event delegation to catch clicks on dynamically generated content.
   *
   * @param event - The mouse event from the click
   */
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement

    // Check if the clicked element is a link, button, or contained within one
    const clickedElement = target.closest('a, button')

    // If we found a link or button (excluding the close button which has its own handler)
    if (
      clickedElement &&
      !clickedElement.classList.contains(styles.closeButton)
    ) {
      // Save the dismissal cookie when user interacts with modal content
      if (modalData?.id) {
        setDismissedCookie(modalData.id)
        setIsDismissed(true)
      }
    }
  }

  // Determine if we should render the image column
  const hasImage = modalData?.popupImage && modalData.popupImage.sourceUrl

  return (
    <div className={styles.modalWrapper} onClick={handleWrapperClick}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Left column: text */}
        <div
          className={`${styles.leftColumn} ${
            !hasImage ? styles.fullWidth : ''
          }`}
        >
          <h1 className={styles.heading}>{modalData?.popupTitle}</h1>
          <div
            className={styles.subheading}
            dangerouslySetInnerHTML={{ __html: modalData?.popupContent || '' }}
          />
          {modalData?.buttonLabel && modalData?.buttonUrl && (
            <a
              href={modalData.buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readMoreButton}
            >
              {modalData.buttonLabel}
            </a>
          )}
        </div>
        {/* Right column: image (only render if there's an image) */}
        {hasImage && modalData?.popupImage && (
          <div className={styles.rightColumn}>
            <Image
              src={modalData.popupImage.sourceUrl}
              alt={modalData.popupImage.altText || ''}
              width={420}
              height={320}
              className={styles.image}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomepageModal
