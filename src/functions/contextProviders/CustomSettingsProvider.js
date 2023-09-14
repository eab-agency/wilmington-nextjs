import React, { useState } from 'react'

const CustomSettingsContext = React.createContext(null)
CustomSettingsContext.displayName = 'CustomSettingsContext'

const CustomSettingsProvider = ({ children, data }) => {
  const [alert, setAlert] = useState(data?.alertBar?.alert || null)
  const [closed, setClosed] = useState(false)

  const handleClearAlert = () => {
    setAlert(null)
    setClosed(true)
  }

  return (
    <CustomSettingsContext.Provider
      value={{
        alert: alert,
        closed: closed,
        showAlert: data?.alertBar?.showAlert || false,
        clear: handleClearAlert,
        customOptions: data?.customOptions || null
      }}
    >
      {children}
    </CustomSettingsContext.Provider>
  )
}

export { CustomSettingsProvider, CustomSettingsContext }
