/* eslint-disable no-console */
import WordPressProvider from '@/components/common/WordPressProvider'
import {
  CustomSettingsProvider,
  MenuProvider
} from '@/functions/contextProviders/'

import { WordPressBlocksProvider } from '@faustwp/blocks'
import { FaustProvider } from '@faustwp/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import '../../faust.config'

import blocks from '../../wp-blocks'

import { logToConsole } from '@/functions/welcomeLog'
import '@/styles/styles.scss'
import '@faustwp/core/dist/css/toolbar.css'
const gtmId = 'GTM-P3X3WCQ'

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
      indexName: 'wil_searchable_posts'
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
              <Component {...pageProps} key={router.asPath} />
            </WordPressBlocksProvider>
          </WordPressProvider>
        </MenuProvider>
      </CustomSettingsProvider>
    </FaustProvider>
  )
}
