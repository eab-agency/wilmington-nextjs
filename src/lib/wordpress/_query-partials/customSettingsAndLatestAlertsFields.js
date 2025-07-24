const latestAlertAndCustomSettings = `
query GetLatestAlertAndCustomSettings {
  customSettings {
    customOptions {
      addressCountry
      addressLocality
      addressRegion
      postalCode
      streetAddress
      telephone
      tollfreeNumber
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
