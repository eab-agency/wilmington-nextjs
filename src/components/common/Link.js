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
  const regex2 = /(https?:\/\/(.+?\.)?vercel\.app|wilmington\.edu)/g
  // const isLocalLink = /^http:\/\/wilmingtonlocal\.local(\/)?/.test(to);
  const isLocalLink = regex2.test(href)
  // https://eab-wilmington-college.pantheonsite.io/2022/11/html-elements/
  if (isLocalLink) {
    const url = href.replace(/^https:\/\/wilmington-nexjs\.vercel\.app/, '')
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
