import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

  return (
    <Html lang="en">
      <Head>
        {!isProduction && <meta name="robots" content="noindex, nofollow" />}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
