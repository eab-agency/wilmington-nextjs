import exp from 'constants'
import { FormField } from '../formTypes'

// helper function to group fields into sections
const groupFieldsIntoSections = (fields: FormField[]) => {
  const sections: Array<{ section?: FormField; fields: FormField[] }> = []
  let currentSection: { section?: FormField; fields: FormField[] } | null = null

  fields.forEach((field) => {
    if (field.type === 'section') {
      // Push current section if it exists
      if (currentSection) {
        sections.push(currentSection)
      }
      // Start new section
      currentSection = { section: field, fields: [] }
    } else {
      // Create initial section only when needed
      if (!currentSection) {
        currentSection = { fields: [] }
      }
      currentSection.fields.push(field)
    }
  })

  // Push the final section
  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

export default groupFieldsIntoSections
