import { useCustomData } from '@/functions/contextProviders/CustomSettingsProvider'
import { PopupModalData } from '@/types/alerts'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './HomepageModal.module.css'

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
  const { alert, showAlert, clear } = useCustomData()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Get the current page path for page-specific visibility
  // Extract the slug from the path (last segment after /)
  const currentPath = router.asPath.split('/').filter(Boolean).pop() || ''

  // Check if we have an alert and it's a popup-modal type
  const modalData =
    alert && alert.alertType === 'popup-modal'
      ? (alert as PopupModalData)
      : null

  // Check if modal should be shown based on page visibility
  const shouldShowModal =
    modalData &&
    showAlert &&
    (!modalData.popupVisibilityPage ||
      modalData.popupVisibilityPage === currentPath ||
      modalData.popupVisibilityPage === router.asPath)

  // Control modal visibility with animation
  useEffect(() => {
    if (shouldShowModal) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
    return () => {}
  }, [shouldShowModal])

  // If no modal data or it shouldn't be shown, don't render anything
  if (!shouldShowModal || !isVisible) return null

  /**
   * Handle closing the modal
   * Dismisses the alert and stores the state in a cookie
   */
  const handleClose = () => {
    setIsVisible(false)
    // Small delay to allow animation to complete before removing from DOM
    setTimeout(() => {
      clear()
    }, 300)
  }

  // Determine if we should render the image column
  const hasImage = modalData.popupImage && modalData.popupImage.sourceUrl

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
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
          <h1 className={styles.heading}>{modalData.popupTitle}</h1>
          <div
            className={styles.subheading}
            dangerouslySetInnerHTML={{ __html: modalData.popupContent }}
          />
          {modalData.buttonLabel && modalData.buttonUrl && (
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
        {hasImage && modalData.popupImage && (
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
