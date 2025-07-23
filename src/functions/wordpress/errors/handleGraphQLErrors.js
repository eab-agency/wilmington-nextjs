/**
 * Utility function to handle GraphQL errors with the updated structure from WPGraphQL upgrade
 *
 * The new error structure has removed the "category" field and moved debug information
 * to the extensions key of the error response.
 *
 * @param {Object} error - The GraphQL error object
 * @return {Object} - Processed error with consistent structure
 */
export function handleGraphQLErrors(error) {
  if (!error) {
    return null
  }

  // Extract error information
  const { message, locations, path, extensions } = error

  // Log error details for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('GraphQL Error:', {
      message,
      locations,
      path,
      extensions // This now contains debug information that was previously in other fields
    })
  }

  // Return a consistent error structure for the application to use
  return {
    message: message || 'An unknown error occurred',
    locations,
    path,
    extensions,
    // Add any application-specific error handling here
    isSerializationError:
      error instanceof Error && error.name === 'SerializationError'
  }
}

/**
 * Process Apollo error response which may contain multiple GraphQL errors
 *
 * @param {Object} apolloError - The Apollo error response
 * @return {Array} - Array of processed errors
 */
export function processApolloErrors(apolloError) {
  if (!apolloError) {
    return []
  }

  // Handle network errors
  if (apolloError.networkError) {
    return [
      {
        message: 'Network error: Unable to connect to the GraphQL server',
        isNetworkError: true,
        originalError: apolloError.networkError
      }
    ]
  }

  // Process GraphQL errors
  if (apolloError.graphQLErrors && apolloError.graphQLErrors.length) {
    return apolloError.graphQLErrors.map(handleGraphQLErrors)
  }

  // Fallback for other error types
  return [
    {
      message: apolloError.message || 'An unknown error occurred',
      originalError: apolloError
    }
  ]
}
