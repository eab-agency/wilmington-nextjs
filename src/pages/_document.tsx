import NewRelicScript from '@/components/NewRelic/NewRelicComponent'
import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=2" />
        <link
          href="https://fonts.googleapis.com/css2?&family=Roboto+Slab&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <NewRelicScript />
      </body>
    </Html>
  )
}
