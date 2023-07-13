import Link from 'next/link'

const CommonLink = ({ children, href, ...others }) => {
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
    let url = href

    if (
      href.includes('wilmington.vercel.app/wp-content/') ||
      href.includes('wilmington.edu/wp-content/')
    ) {
      url = href.replace(
        /wilmington\.(vercel\.app|edu)\/wp-content\//,
        'wordpress.wilmington.edu/wp-content/'
      )
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" {...others}>
          {children}
        </a>
      )
    }

    const localurl = href.replace(regex, '')
    // console.log('🚀 ~ file: Link.js:25 ~ CommonLink ~ url:', url)

    return (
      <Link href={localurl} {...others}>
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
