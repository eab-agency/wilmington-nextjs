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
    // Set session cookie (expires when browser/tab is closed)
    if (typeof document !== 'undefined') {
      document.cookie = 'hideHomeModal=true; path=/'
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
          <h1 className={styles.heading}>
            Late legendary coach funds transformational initiative
          </h1>
          <p className={styles.subheading}>
            Wilmington College has received the largest gift in its 155-year history—a $23 million designated contribution from longtime head women’s basketball coach and professor of accounting, Jerry Scheve. This transformational gift reflects a lifetime of service, leadership, and belief in the mission and future of the institution.
          </p>
          <a
            href="https://www.wilmington.edu/scheves-cornerstone-gift"
            target="_blank"
            className={styles.readMoreButton}
          >
            READ MORE
          </a>
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
