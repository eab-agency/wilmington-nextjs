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
export default function SEO({ seo = {}, title, description }) {
  // List of production domains
  const productionDomains = [
    'wilmington.edu',
    'www.wilmington.edu',
    'localhost'
  ]

  // Determine if the current environment is production (SSR-safe)
  const isProductionEnvironment = process.env.NODE_ENV === 'production'

  // Set robots meta tag based on environment
  let robots
  if (isProductionEnvironment) {
    // If seo is missing or fields are missing, default to index/follow
    const noindex = seo?.metaRobotsNoindex === 'noindex'
    const nofollow = seo?.metaRobotsNofollow === 'nofollow'
    if (noindex && nofollow) {
      robots = ['noindex', 'nofollow']
    } else if (noindex) {
      robots = ['noindex', 'follow']
    } else if (nofollow) {
      robots = ['index', 'nofollow']
    } else {
      robots = ['index', 'follow']
    }
  } else {
    robots = ['noindex', 'nofollow']
  }

  // Ensure correct order: index before follow
  if (isProductionEnvironment && robots.length === 2) {
    const order = ['index', 'noindex', 'follow', 'nofollow']
    robots = robots.sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }

  // Remove any robots meta tag from seo.fullHead to avoid duplicates/conflicts
  let modifiedFullHead = seo?.fullHead
  if (modifiedFullHead) {
    modifiedFullHead = modifiedFullHead
      .replace(/<meta[^>]*name=["']robots["'][^>]*>/gi, '')
      .replace(
        /(href=")(https?:\/\/)([^/"]+)(\/)?/g,
        '$1https://www.wilmington.edu/'
      )
  }

  // Remove DEBUG LOGGING for production cleanliness

  // If seo is missing, provide a default object with correct robots fields
  if (!seo || typeof seo !== 'object') {
    seo = { metaRobotsNoindex: 'index', metaRobotsNofollow: 'follow' }
  }

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
