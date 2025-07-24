/* eslint-disable no-console */

// ...rest of your _app.js code
import ClarityScript from '@/components/common/ClarityScript'
import WordPressProvider from '@/components/common/WordPressProvider'
import {
  CustomSettingsProvider,
  MenuProvider
} from '@/functions/contextProviders/'

import { WordPressBlocksProvider } from '@faustwp/blocks'
import { FaustProvider, useAuth } from '@faustwp/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import '../../faust.config'

import blocks from '../../wp-blocks'

import { logToConsole } from '@/functions/welcomeLog'
import '@/styles/styles.scss'
import '@faustwp/core/dist/css/toolbar.css'
const gtmId = 'GTM-P3X3WCQ'

function AuthDebug() {
  const { isAuthenticated, user } = useAuth()
  console.log('Auth status:', { isAuthenticated, user })
  return null
}

export default function WilmingtonApp({ Component, pageProps }) {
  logToConsole()

  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      TagManager.initialize({ gtmId })
    }
  }, [])

  // Initialize state for WordPress context provider.
  const [wp] = useState({
    algolia: {
      indexName:
        process.env.NODE_ENV === 'production'
          ? 'wil_searchable_posts'
          : 'wil_dev_searchable_posts',
      insights: true
    }
  })

  return (
    <FaustProvider pageProps={pageProps}>
      <CustomSettingsProvider>
        <MenuProvider>
          <WordPressProvider value={wp}>
            <WordPressBlocksProvider
              config={{
                blocks
              }}
            >
              {/* <AuthDebug /> */}
              <ClarityScript />
              <Component {...pageProps} key={router.asPath} />
            </WordPressBlocksProvider>
          </WordPressProvider>
        </MenuProvider>
      </CustomSettingsProvider>
    </FaustProvider>
  )
}
