export const evaluateCondition = (condition, fieldValue, option) => {
  switch (condition) {
    case 'equals':
      return fieldValue === option
    case 'not_equals':
      return fieldValue !== option
    // Add more conditions as needed
    default:
      return false
  }
}

export const shouldShowField = (logic, values, fieldIdToNameMap) => {
  if (!logic) return true

  // console.log('🚀🫥🫥🫥 ~ shouldShowField ~ logic:', logic)
  const { action, conditional, checks } = logic
  const results = checks.map((check) => {
    const fieldName = fieldIdToNameMap[check.field]
    const fieldValue = values[fieldName]
    return evaluateCondition(check.condition, fieldValue, check.option)
  })

  if (conditional === 'any') {
    return action === 'show' ? results.some(Boolean) : !results.some(Boolean)
  } else if (conditional === 'all') {
    return action === 'show' ? results.every(Boolean) : !results.every(Boolean)
  }

  return true
}
