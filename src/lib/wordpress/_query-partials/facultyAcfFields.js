// Query partial: retrieve faculty acf fields.
const facultyAcfFields = `
 facultyFields {
      faculty {
        email
        facebook
        first
        instagram
        last
        linkedin
        location
        phone
        position
        tiktok
        twitter
        youtube
        cv {
          node {
            mediaItemUrl
          }
        }
      }
    }
  `

export default facultyAcfFields
