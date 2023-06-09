'use client'

import { useState } from 'react'
import { MdOutlineChevronRight } from 'react-icons/md'
import styles from './Accordion.module.scss'

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(!isOpen)

  return (
    <article className={styles.accordionContainer}>
      <div
        id="accordion-title"
        className={`${styles.accordionTitle} ${
          isOpen === true ? styles.open : ''
        }`}
      >
        <h3>
          <button
            id="accordion-button"
            className={styles.accordionButton}
            aria-expanded={isOpen}
            onClick={handleOpen}
            aria-controls="accordion-content"
            type="button"
            tabIndex="0"
          >
            <i>
              <span>
                <MdOutlineChevronRight />
              </span>
            </i>
          </button>
          <span>{title}</span>
        </h3>
      </div>
      <div
        id="accordion-content"
        className={styles.accordionContent}
        aria-labelledby="accordion-button"
        hidden={!isOpen}
        role="region"
      >
        {children}
      </div>
    </article>
  )
}
export default Accordion
