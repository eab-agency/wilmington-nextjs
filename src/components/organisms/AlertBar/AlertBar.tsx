import CustomSettingsContext from '@/functions/contextProviders/CustomSettingsProvider'
import React, { useContext, useEffect, useState } from 'react'
import styles from './AlertBar.module.scss'

const AlertBar: React.FC = () => {
  const { alert, clear, showAlert } = useContext(CustomSettingsContext)
  console.log('🚀 ~ file: AlertBar.tsx:7 ~ alert:', alert, showAlert)

  const tagName = alert?.tags?.edges[0]?.node?.name?.toLowerCase()

  return showAlert && alert ? (
    <div className={`${styles.alertBar} ${styles[tagName]}`}>
      <div className={styles.alertBarContent}>
        <div className={styles.alertBarText}>
          <p>{alert?.alertMsgTitle}</p>
          {alert?.alertButtonUri && (
            <a href={alert.alertButtonUri}>{alert.alertButtonLabel}</a>
          )}
        </div>
        <button className={styles.alertBarClose} onClick={clear}>
          <span className={styles.srOnly}>Close</span>
        </button>
      </div>
    </div>
  ) : null
}

export default AlertBar
