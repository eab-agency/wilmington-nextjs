/* eslint-disable no-console */
import WordPressProvider from '@/components/common/WordPressProvider'
import { CustomSettingsProvider } from '@/functions/contextProviders/CustomSettingsProvider'
import fetchCustomSettings from '@/functions/fetchCustomSettings'
import { WordPressBlocksProvider } from '@faustwp/blocks'
import { FaustProvider } from '@faustwp/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import '../../faust.config'

import blocks from '../../wp-blocks'

import '@/styles/styles.scss'
import '@faustwp/core/dist/css/toolbar.css'

const gtmId = 'GTM-P3X3WCQ'

export default function WilmingtonApp({
  Component,
  pageProps,
  customSettings,
  alert
}) {
  console.log(
    '🚀 ~ file: _app.jsx:25 ~ customSettings, alert:',
    customSettings,
    alert
  )
  console.log(
    '%cWilmington College',
    'color: rgb(142, 198, 64);font-size: 30px;font-weight: bold;text-shadow: 1px 1px 5px rgb(0, 0, 0);filter: dropshadow(color=rgb(0, 198, 0), offx=1, offy=1);'
  )
  console.log(
    'You have what it takes. Apply now!\nhttps://www.wilmington.edu/admission/apply/'
  )
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
    <CustomSettingsProvider customSettings={customSettings} alert={alert}>
      <FaustProvider pageProps={pageProps}>
        <WordPressProvider value={wp}>
          <WordPressBlocksProvider
            config={{
              blocks
            }}
          >
            <Component {...pageProps} key={router.asPath} />
          </WordPressBlocksProvider>
        </WordPressProvider>
      </FaustProvider>
    </CustomSettingsProvider>
  )
}

WilmingtonApp.getInitialProps = async () => {
  const { data } = await fetchCustomSettings()

  return {
    customSettings: data?.customSettings,
    alert: data?.alerts.edges[0]?.node
  }
}
