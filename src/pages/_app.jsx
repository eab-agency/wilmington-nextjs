import '@/styles/styles.scss'
import { WordPressBlocksProvider } from '@faustwp/blocks'
import { FaustProvider } from '@faustwp/core'
import '@faustwp/core/dist/css/toolbar.css'
import { Analytics } from '@vercel/analytics/react'
import { useRouter } from 'next/router'
import React from 'react'
import '../../faust.config'
import blocks from '../../wp-blocks'

export default function MyApp({ Component, pageProps }) {
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
