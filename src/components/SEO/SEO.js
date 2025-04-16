import parse from 'html-react-parser'
import Head from 'next/head'

/**
 * Provide SEO related meta tags to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.title Used for the page title, og:title, twitter:title, etc.
 * @param {string} props.description Used for the meta description, og:description, twitter:description, etc.
 * @param {string} props.seo The SEO data from WordPress.
 *
 * @returns {React.ReactElement} The SEO component
 */
export default function SEO({ seo, title, description }) {
  // List of production domains
  const productionDomains = ['wilmington.edu', 'www.wilmington.edu']

  // Determine if the current environment is production
  const isProductionEnvironment =
    typeof window !== 'undefined' &&
    productionDomains.includes(window.location.hostname)

  // Set robots meta tag based on environment
  const robots = isProductionEnvironment
    ? [
        ...(seo?.metaRobotsNofollow ? [seo.metaRobotsNofollow] : []),
        ...(seo?.metaRobotsNoindex ? [seo.metaRobotsNoindex] : [])
      ]
    : ['noindex', 'nofollow']

  // canonical being passed by Yoast/WP is the wordpress URL, we need to replace it with the actual URL
  const modifiedFullHead = seo?.fullHead?.replace(
    /(href=")(https?:\/\/)([^/"]+)(\/)?/g,
    '$1https://www.wilmington.edu/'
  )

  return (
    <Head>
      <title>{title ?? seo?.title}</title>
      <meta name="description" content={seo?.metaDesc ?? description} />
      {modifiedFullHead && parse(modifiedFullHead)}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="robots" content={robots.join(', ')} />
      <meta name="msapplication-TileColor" content="#fffff" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
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
  )
}
