/**
 * Utility function to handle the updated WPGraphQL error structure
 *
 * Handles breaking changes in WPGraphQL:
 * - "category" field removal on errors
 * - debug entries moved to extensions key
 * - serialization errors now throw SerializationError
 *
 * @param {Object} errors - GraphQL errors object
 * @returns {string} Formatted error message
 */
export const formatGraphQLErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) {
    return 'Unknown GraphQL error'
  }

  return errors
    .map((error) => {
      // Extract debug info from extensions (new location in WPGraphQL update)
      const debugInfo = error.extensions?.debug
        ? `\nDebug: ${JSON.stringify(error.extensions.debug)}`
        : ''

      // Check for serialization errors (now explicitly thrown as SerializationError)
      const isSerializationError =
        error.extensions?.category === 'graphql' &&
        error.message.includes('serialization')

      if (isSerializationError) {
        return `Serialization Error: ${error.message}${debugInfo}`
      }

      return `${error.message}${debugInfo}`
    })
    .join('\n')
}

/**
 * Process GraphQL response and handle errors with the updated structure
 *
 * @param {Object} response - GraphQL response object
 * @returns {Object} Data from the response
 * @throws {Error} Formatted error message
 */
export const processGraphQLResponse = (response) => {
  if (response.errors) {
    throw new Error(formatGraphQLErrors(response.errors))
  }

  return response.data
}
