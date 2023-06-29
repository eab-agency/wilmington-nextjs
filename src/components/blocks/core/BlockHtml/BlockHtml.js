import React, { useEffect, useState } from 'react'

function parseHtml(html) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(html)
    iframe.contentWindow.document.close()
    iframe.addEventListener('load', () => {
      const scriptTags =
        iframe.contentWindow.document.querySelectorAll('script')
      scriptTags.forEach((scriptTag) => {
        scriptTag.removeAttribute('src')
      })
      const parsedHtml = iframe.contentWindow.document.documentElement.innerHTML
      document.body.removeChild(iframe)
      resolve(parsedHtml)
    })
  })
}

export default function RenderHtmlWithoutWhitelist({ content }) {
  const [parsedHtml, setParsedHtml] = useState(null)

  useEffect(() => {
    parseHtml(content).then((parsedHtml) => {
      setParsedHtml(parsedHtml)
    })
  }, [content])

  if (!parsedHtml) {
    return null
  }

  return (
    <div
      className="block-html"
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  )
}
