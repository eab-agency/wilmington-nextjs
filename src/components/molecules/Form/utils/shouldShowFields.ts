import { FormField } from '../formTypes'

// Function to check if a field should be shown based on logic
const shouldShowField = (field: FormField, values: Record<string, unknown>) => {
  if (!field.logic) return true

  const { action, conditional, checks } = field.logic

  const results = checks.map((check) => {
    const fieldValue = values[check.field]
    const isArray = Array.isArray(fieldValue)

    switch (check.condition) {
      case 'equals':
        return isArray
          ? fieldValue.includes(check.option)
          : fieldValue === check.option
      case 'not_equals':
        return isArray
          ? !fieldValue.includes(check.option)
          : fieldValue !== check.option
      case 'contains':
        return String(fieldValue).includes(check.option)
      case 'greater_than':
        return Number(fieldValue) > Number(check.option)
      case 'less_than':
        return Number(fieldValue) < Number(check.option)
      default:
        return false
    }
  })

  const conditionalMet =
    conditional === 'all' ? results.every(Boolean) : results.some(Boolean)

  return action === 'show' ? conditionalMet : !conditionalMet
}

export default shouldShowField
