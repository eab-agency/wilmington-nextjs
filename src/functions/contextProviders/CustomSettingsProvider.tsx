import React, { ReactNode, createContext, useState } from 'react'

interface CustomOptions {
  addresscountry: string
  addresslocality: string
  addressregion: string
  postalcode: string
  streetaddress: string
  telephone: string
  tollfreenumber: string
}

interface Alert {
  alertButtonLabel: string
  alertButtonUri: string
  databaseId: number
  alertMsgTitle: string
  tags: {
    edges: any[]
  }
}

interface CustomSettingsContextProps {
  alert: Alert | null
  closed: boolean
  showAlert: boolean
  clear: () => void
  customOptions: CustomOptions | null
}

export const CustomSettingsContext = createContext<CustomSettingsContextProps>(
  {} as CustomSettingsContextProps
)
CustomSettingsContext.displayName = 'CustomSettingsContext'

interface CustomSettingsProviderProps {
  children: ReactNode
  customSettings: {
    customOptions: CustomOptions
  }
  alert?: Alert
}

const CustomSettingsProvider = ({
  children,
  customSettings,
  alert
}: CustomSettingsProviderProps) => {
  const [alertState, setAlertState] = useState<Alert | null>(alert || null)
  const [closed, setClosed] = useState(false)

  const showAlert = alert ? true : false

  const handleClearAlert = () => {
    setAlertState(null)
    setClosed(true)
  }

  return (
    <CustomSettingsContext.Provider
      value={{
        alert: alertState,
        closed: closed,
        showAlert: showAlert,
        clear: handleClearAlert,
        customOptions: customSettings?.customOptions || null
      }}
    >
      {children}
    </CustomSettingsContext.Provider>
  )
}

export { CustomSettingsProvider }
export default CustomSettingsContext
