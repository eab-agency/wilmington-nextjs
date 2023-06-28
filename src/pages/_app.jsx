/* eslint-disable no-console */
import '@/styles/styles.scss'
import { WordPressBlocksProvider } from '@faustwp/blocks'
import { FaustProvider } from '@faustwp/core'
import '@faustwp/core/dist/css/toolbar.css'
import { Analytics } from '@vercel/analytics/react'
import { useRouter } from 'next/router'
import React from 'react'
import '../../faust.config'
import blocks from '../../wp-blocks'

export default function WilmingtonApp({ Component, pageProps }) {
  console.log(
    '%cWilmginton College',
    'color: rgb(142, 198, 64);font-size: 30px;font-weight: bold;text-shadow: 1px 1px 5px rgb(0, 0, 0);filter: dropshadow(color=rgb(0, 198, 0), offx=1, offy=1);'
  )
  console.log(
    'You have what it takes. Apply now!\nhttps://www.wilmington.edu/admission/apply/'
  )
  const router = useRouter()

  return (
    <FaustProvider pageProps={pageProps}>
      <WordPressBlocksProvider
        config={{
          blocks
        }}
      >
        <Component {...pageProps} key={router.asPath} />
      </WordPressBlocksProvider>
      <Analytics />
    </FaustProvider>
  )
}
