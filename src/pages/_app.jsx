import ExitPreview from '@/components/atoms/ExitPreview'
import WordPressProvider from '@/components/common/WordPressProvider'
import {useWpApollo} from '@/lib/wordpress/connector'
import '@/styles/styles.scss'
import {ApolloProvider} from '@apollo/client'
import PropTypes from 'prop-types'
import {useState} from 'react'
import Custom500 from './500'

/**
 * Render the App component.
 *
 * @param  {object}  props           The component attributes as props.
 * @param  {object}  props.Component Page component to display.
 * @param  {boolean} props.pageProps Page component props.
 * @return {Element}                 The App component.
 */

export default function App({Component, pageProps}) {
  /**
   * Wrap the app in the ApolloProvider component.
   *
   * @see https://www.apollographql.com/docs/react/api/react/hooks/#the-apolloprovider-component
   */
  const apolloClient = useWpApollo(pageProps)

  // Check for errors.
  const error = pageProps?.error
  let errorMessage = pageProps?.errorMessage ?? 'An unknown error occurred.'
  // Trim trailing period - added via Error component.
  errorMessage = errorMessage.replace(/\.$/g, '')

  // Extract specific props from page props.
  const {
    defaultSeo: {social, ...defaultSeoData} = {},
    menus,
    algolia,
    preview,
    session,
    ...passThruProps
  } = pageProps

  const componentProps = {
    ...passThruProps,
    post: {
      ...passThruProps?.post,
      seo: {
        ...passThruProps?.post?.seo,
        siteTitle: defaultSeoData?.openGraph?.siteName,
        siteDescription: defaultSeoData?.description,
        social
      }
    }
  }

  // Initialize state for WordPress context provider.
  const [wp] = useState({
    algolia: {
      indexName: algolia?.indexName
    },
    menus: menus,
    departments: passThruProps?.post?.departments?.nodes,
    studentOrganizations: passThruProps?.post?.programOrgRelationship?.programorg
  })

  return (
      <ApolloProvider client={apolloClient} >
        <WordPressProvider value={wp}>
          {error ? (
            <Custom500 errorMessage={errorMessage} post={componentProps.post} />
          ) : (
            <>
              <ExitPreview preview={preview} />
              <Component {...componentProps} />
            </>
          )}
        </WordPressProvider>
      </ApolloProvider>
  )
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}
