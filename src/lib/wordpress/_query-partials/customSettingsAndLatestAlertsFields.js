const latestAlertAndCustomSettings = `
query GetLatestAlertAndCustomSettings {
  customSettings {
    customOptions {
      addresscountry
      addresslocality
      addressregion
      postalcode
      streetaddress
      telephone
      tollfreenumber
    }
  }
  alerts(first: 1) {
    edges {
      node {
        alertButtonLabel
        alertButtonUri
        databaseId
        alertMsgTitle
        tags {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  }
}
`

export default latestAlertAndCustomSettings
