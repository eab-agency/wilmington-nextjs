// ScrollButtons.js

import React from 'react'
import styles from './ScrollButtons.module.scss'
import { smoothScroll } from './easingFunctions'

const ScrollButtons = ({ scrollElement, className }) => {
  const scrollLeft = () => {
    smoothScroll(scrollElement, scrollElement.scrollLeft - 100, 500)
  }

  const scrollRight = () => {
    smoothScroll(scrollElement, scrollElement.scrollLeft + 100, 500)
  }

  return (
    <div className={`${styles.scrollButtonsCotainer} ${className}`}>
      <button
        onClick={() => scrollLeft()}
        type="button"
        className={styles.leftArrow}
      >
        Scroll Left
      </button>
      <button
        onClick={() => scrollRight()}
        type="button"
        className={styles.rightArrow}
      >
        Scroll Right
      </button>
    </div>
  )
}

export default ScrollButtons
