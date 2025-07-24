import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/lib/apolloConfig'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { useMemo } from 'react'

// Define env vars.
export const wpApiUrlBase =
  process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/?$/, '/') || '/'
export const wpPreviewSecret = process.env.WORDPRESS_PREVIEW_SECRET
export const graphQlEndpoint =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 'index.php?graphql' // Updated to match new WPGraphQL endpoint
const wpAppUser = process.env.WORDPRESS_APPLICATION_USERNAME
const wpAppPass = process.env.WORDPRESS_APPLICATION_PASSWORD

// Set WP application password auth header.
const wpAuthorization = Buffer.from(`${wpAppUser}:${wpAppPass}`).toString(
  'base64'
)

let wpApolloClient

/**
 * Create a basic Apollo client for connecting to WP.
 *
 * @see https://www.apollographql.com/docs/react/api/core/ApolloClient/
 * @param  {boolean} auth Whether to include authentication via WP application password.
 * @return {object}       Apollo client instance.
 */
export function createWpApolloClient(auth = false) {
  // console.log(
  //   `Connecting to GraphQL endpoint: ${wpApiUrlBase}${graphQlEndpoint}`
  // )

  return new ApolloClient({
    ssrMode: false,
    link: new HttpLink({
      uri: `${wpApiUrlBase}${graphQlEndpoint}`,
      credentials: '',
      headers: {
        authorization: auth ? `Basic ${wpAuthorization}` : '',
        'Content-Type': 'application/json' // Ensure proper Content-Type header is set
      },
      // Add fetch options with longer timeout
      fetchOptions: {
        timeout: 30000 // 30 seconds timeout
      }
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all', // Handle both data and errors
        fetchPolicy: 'network-only' // Don't use cache for queries
      },
      query: {
        errorPolicy: 'all', // Handle both data and errors
        fetchPolicy: 'network-only' // Don't use cache for queries
      },
      mutate: {
        errorPolicy: 'all' // Handle both data and errors
      }
    },
    // Custom error handling for updated WPGraphQL error structure
    onError: (error) => {
      // Access debug information from extensions key instead of the previous location
      const debugInfo = error.graphQLErrors?.[0]?.extensions?.debug || null
      console.error(
        'GraphQL Error:',
        error.message,
        debugInfo ? { debug: debugInfo } : '',
        error.networkError ? { networkError: error.networkError } : ''
      )
    }
  })
}

/**
 * Init Apollo for WP and merge with initial state.
 *
 * @param  {*}      initialState Initial Apollo state.
 * @return {object}              WP Apollo client instance.
 */
export function initializeWpApollo(initialState = null) {
  // Only run one instance of the Apollo client.
  const _apolloClient = wpApolloClient ?? createWpApolloClient()

  const newApolloClient = initializeApollo(_apolloClient, initialState)

  // For SSG and SSR always create a new Apollo Client.
  if (typeof window === 'undefined') return newApolloClient

  // Create the Apollo Client once in the client.
  if (!wpApolloClient) wpApolloClient = newApolloClient

  return newApolloClient
}

/**
 * Only update when the cache value has changed.
 *
 * @param  {object} pageProps Props from getStaticProps().
 * @return {object}           WP Apollo client instance.
 */
export function useWpApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeWpApollo(state), [state])
  return store
}
