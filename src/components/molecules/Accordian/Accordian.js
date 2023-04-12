'use client'

import React, { useState } from 'react'
import * as styles from './Accordion.module.css'


const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(!isOpen)

  return (
    <section className={styles.accordionContainer}>
      <div id="accordion-title" className={styles.accordionTitle}>
        <h2>
          <button
            id="accordion-button"
            className={styles.accordionButton}
            aria-expanded={isOpen}
            onClick={handleOpen}
            aria-controls="accordion-content"
          >
            <span>{isOpen ? '-' : '+'} </span>
            {title}
          </button>
        </h2>
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
    </section>
  )
}
export default Accordion
