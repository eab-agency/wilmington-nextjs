import Link from 'next/link'

const CommonLink = ({ children, href, ...others }) => {
  console.log('🚀 ~ file: Link.js:4 ~ CommonLink ~ href:', href)
  // check if the link linking to a file and then use the wp url
  // if (href.includes('/wp-content/')) {
  //   const strippedHref = href.substring(href.indexOf('/wp-content/'))
  //   const modifiedHref = `https://wordpress.wilmington.edu${strippedHref}`
  //   return (
  //     <a
  //       href={modifiedHref}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       {...others}
  //     >
  //       {children}
  //     </a>
  //   )
  // }

  // check if the link is an internal link and then use GatsbyLink
  const isInternalLink = /^\/(?!\/)/.test(href)
  if (isInternalLink) {
    return (
      <Link href={href} {...others}>
        {children}
      </Link>
    )
  }
  // const regex2 = /(https?:\/\/(.+?\.)?vercel\.app|wilmington\.edu)/g
  const regex =
    /https?:\/\/(www\.)?wilmington\.vercel\.app|https?:\/\/(www\.)?wilmington\.edu/
  // const isLocalLink = /^http:\/\/wilmingtonlocal\.local(\/)?/.test(to);
  const isLocalLink = regex.test(href)
  if (isLocalLink) {
    const url = href.replace(regex, '')
    // console.log('🚀 ~ file: Link.js:25 ~ CommonLink ~ url:', url)

    return (
      <Link href={url} {...others}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...others}>
      {children}
    </a>
  )
}

export default CommonLink
