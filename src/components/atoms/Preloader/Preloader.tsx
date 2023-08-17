import React from 'react'
import styles from './Preloader.module.scss'

export default function Preloader() {
  return (
    <div className={styles.preloaderContainer}>
      <div className={styles.preloader2}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Loading ...</p>
    </div>
  )
}
