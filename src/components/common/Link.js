import Link from 'next/link'

const regexList = [
  {
    regex: /^\/(?!\/|$)/,
    replace: ''
  },
  {
    regex: /^\/$/,
    replace: '/'
  },
  {
    regex: /https?:\/\/(www\.)?wilmington\.edu/,
    replace: ''
  },
  {
    regex: /https?:\/\/qa-web\.wilmington\.edu/,
    replace: ''
  },
  {
    regex: /https?:\/\/wilmington\.vercel\.app/,
    replace: ''
  },
  {
    regex: /https?:\/\/(www\.)?wordpress\.wilmington\.edu(?!\/wp-content\/)/,
    replace: ''
  }
]

const CommonLink = ({ children, href, ...others }) => {
  for (const { regex, replace } of regexList) {
    if (regex.test(href)) {
      const url = href.replace(regex, replace)
      return (
        <Link href={url} {...others}>
          {children}
        </Link>
      )
    }
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...others}>
      {children}
    </a>
  )
}

export default CommonLink
