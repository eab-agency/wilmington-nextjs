const customSettingsFields = `
  query GetCustomSettings {
    customSettings {
      alertBar {
        showAlert
        alert {
          content
          link {
            target
            title
            url
          }
        }
      }
      customOptions {
        addresscountry
        addresslocality
        addressregion
        postalcode
        publishgraphqlhook
        streetaddress
        telephone
        tollfreenumber
      }
    }
  }
`

export default customSettingsFields
