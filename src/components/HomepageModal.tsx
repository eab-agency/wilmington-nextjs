import { useAlerts } from '@/functions/contextProviders/AlertsProvider'
import { PopupModalData } from '@/types/alerts'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import styles from './HomepageModal.module.css'

/**
 * HomepageModal component that displays popup modals from the alerts system
 *
 * This component renders a modal popup based on data from the AlertsContext.
 * It supports both global modals and page-specific modals.
 */
const HomepageModal: React.FC = () => {
  const { alerts, dismissAlert, isDismissed } = useAlerts()
  const router = useRouter()
  const currentPath = router.asPath.split('/').pop() || ''

  // Find the first published popup-modal type alert that matches the current page or is global
  const modalData = alerts.find(
    (alert) =>
      alert.alertType === 'popup-modal' &&
      !isDismissed(alert.id) &&
      (!alert.popupVisibilityPage || alert.popupVisibilityPage === currentPath)
  ) as PopupModalData | undefined

  // If no modal data or it's dismissed, don't render anything
  if (!modalData) return null

  const handleClose = () => {
    dismissAlert(modalData.id)
  }

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
        <div className={styles.leftColumn}>
          <h1 className={styles.heading}>{modalData.popupTitle}</h1>
          <p className={styles.subheading}>{modalData.popupContent}</p>
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
        {/* Right column: image */}
        <div className={styles.rightColumn}>
          {modalData.popupImage && (
            <Image
              src={modalData.popupImage.sourceUrl}
              alt={modalData.popupImage.altText || ''}
              width={420}
              height={320}
              className={styles.image}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default HomepageModal
