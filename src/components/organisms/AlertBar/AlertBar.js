import CustomSettingsContext from '@/functions/contextProviders/CustomSettingsProvider'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './AlertBar.module.scss'

const AlertBar = () => {
  const customSettingsContext = useContext(CustomSettingsContext)
  const { alert, clear, showAlert } = customSettingsContext

  const [alertTypeClassName, setAlertTypeClassName] = useState()
  const lowercaseContentRef = useRef('')

  useEffect(() => {
    if (alert) {
      lowercaseContentRef.current = alert.content.toLowerCase()

      if (lowercaseContentRef.current.includes('warning')) {
        setAlertTypeClassName(styles.warning)
      } else if (lowercaseContentRef.current.includes('alert')) {
        setAlertTypeClassName(styles.alert)
      } else {
        setAlertTypeClassName(styles.info)
      }
    }
  }, [alert])

  return showAlert && alert ? (
    <div className={`${styles.alertBar} ${alertTypeClassName}`}>
      <div className={styles.alertBarContent}>
        <div className={styles.alertBarText}>
          <p>{alert?.content}</p>
          {alert?.link && (
            <a href={alert.link.url} target={alert.link.target}>
              {alert.link.title}
            </a>
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
