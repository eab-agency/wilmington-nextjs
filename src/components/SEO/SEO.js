import parse from 'html-react-parser'
import Head from 'next/head'

/**
 * Provide SEO related meta tags to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.title Used for the page title, og:title, twitter:title, etc.
 * @param {string} props.description Used for the meta description, og:description, twitter:description, etc.
 * @param {string} props.imageUrl Used for the og:image and twitter:image. NOTE: Must be an absolute url.
 * @param {string} props.url Used for the og:url and twitter:url.
 *
 * @returns {React.ReactElement} The SEO component
 */
export default function SEO({ seo }) {
  // Combine robots data.
  const robots = [
    ...(seo?.metaRobotsNofollow ? [seo.metaRobotsNofollow] : []),
    ...(seo?.metaRobotsNoindex ? [seo.metaRobotsNoindex] : [])
  ]

  return (
    <>
      <Head>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="robots" content={robots.join(', ')} />
          {seo?.fullHead ? parse(seo.fullHead) : null}
          <meta name="msapplication-TileColor" content="#fffff" />
          <meta
            name="msapplication-config"
            content="/favicon/browserconfig.xml"
          />
          <meta name="theme-color" content="#fff" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
        </Head>
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {seo?.title && (
          <>
            <title>{seo?.title}</title>
            <meta name="title" content={seo?.title} />
            <meta property="og:title" content={seo?.title} />
            <meta property="twitter:title" content={seo?.title} />
          </>
        )}

        {seo?.description && (
          <>
            <meta name="description" content={seo?.description} />
            <meta property="og:description" content={seo?.description} />
            <meta property="twitter:description" content={seo?.description} />
          </>
        )}

        {seo?.imageUrl && (
          <>
            <meta property="og:image" content={seo?.imageUrl} />
            <meta property="twitter:image" content={seo?.imageUrl} />
          </>
        )}

        {seo?.url && (
          <>
            <meta property="og:url" content={seo?.url} />
            <meta property="twitter:url" content={seo?.url} />
          </>
        )}
      </Head>
    </>
  )
}
