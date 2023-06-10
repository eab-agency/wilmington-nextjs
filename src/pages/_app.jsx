import { FaustProvider } from '@faustwp/core'
import '@faustwp/core/dist/css/toolbar.css'
import { useRouter } from 'next/router'
import React from 'react'
import '../../faust.config'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <FaustProvider pageProps={pageProps}>
      <Component {...pageProps} key={router.asPath} />
    </FaustProvider>
  )
}
