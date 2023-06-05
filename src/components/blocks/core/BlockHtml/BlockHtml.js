'use client'
import { useEffect, useState } from 'react'

// only domains that you're allowed to load scripts from
const WHITELISTED_DOMAINS = ['formstack.com', 'youvisit.com', 'wilmington.edu']

// function that creates a temporary iframe element, sets its srcdoc property to the HTML string, and waits for the load event to fire before modifying its contents. Once the load event fires, the function removes the iframe from the DOM, resolves with the modified HTML code as a string.
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
        const src = scriptTag.getAttribute('src')
        if (
          src &&
          !WHITELISTED_DOMAINS.some((domain) =>
            src.startsWith(`https://${domain}`)
          )
        ) {
          scriptTag.remove()
        } else if (!src) {
          scriptTag.remove()
        }
      })
      const parsedHtml = iframe.contentWindow.document.documentElement.innerHTML
      document.body.removeChild(iframe)
      resolve(parsedHtml)
    })
  })
}

export default function BlockHtml({ content }) {
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
