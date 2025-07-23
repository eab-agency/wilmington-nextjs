import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './HomepageModal.module.css'

export default function HomepageModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check for cookie on mount
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').map((c) => c.trim())
      const found = cookies.find((c) => c.startsWith('hideHomeModal='))
      if (!found) {
        setShowModal(true)
      }
    }
  }, [])

  const handleClose = () => {
    setShowModal(false)
    // Set cookie to expire in 24 hours
    if (typeof document !== 'undefined') {
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `hideHomeModal=true; expires=${expires}; path=/`
    }
  }

  if (!showModal) return null
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
          <h1 className={styles.heading}>Record $20 million gift</h1>
          <p className={styles.subheading}>
            Late legendary coach funds transformational initiative.
          </p>
          <button className={styles.readMoreButton}>
            READ MORE <span className={styles.arrow}>&#8594;</span>
          </button>
        </div>
        {/* Right column: image */}
        <div className={styles.rightColumn}>
          <Image
            src="/images/schevejerry-coaching.webp"
            alt="Scheve Jerry Coaching"
            width={420}
            height={320}
            className={styles.image}
          />
        </div>
      </div>
    </div>
  )
}
