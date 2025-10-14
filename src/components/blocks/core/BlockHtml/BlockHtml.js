'use client'
import { useEffect, useRef, useState } from 'react'
import MauticForm from '../MauticForm'

// Global registry to prevent duplicate script processing across component remounts
if (typeof window !== 'undefined') {
  window.__PROCESSED_SCRIPTS = window.__PROCESSED_SCRIPTS || new Set()
}

/**
 * BlockHtml Component
 *
 * Renders HTML content from WordPress and handles script execution.
 * Delegates third-party form rendering to specialized components.
 */
export default function BlockHtml({ content, renderedHtml }) {
  const theHtml = content || renderedHtml
  const containerRef = useRef(null)
  const [mauticFormProps, setMauticFormProps] = useState(null)

  useEffect(() => {
    if (!containerRef.current || !theHtml) return

    const scriptTags = containerRef.current.querySelectorAll('script')
    if (scriptTags.length === 0) return

    scriptTags.forEach((oldScript) => {
      // Generate unique ID for this script
      const scriptId = oldScript.src || oldScript.textContent?.substring(0, 50)

      // Skip if already processed globally
      if (window.__PROCESSED_SCRIPTS.has(scriptId)) {
        oldScript.remove()
        return
      }

      // Mark as processed
      window.__PROCESSED_SCRIPTS.add(scriptId)

      // Check if this is a Mautic/EAB form script
      if (oldScript.src && oldScript.src.includes('form.js?pid=')) {
        // Extract parameters and delegate to MauticForm component
        const urlParams = new URLSearchParams(oldScript.src.split('?')[1])
        const pid = urlParams.get('pid')
        const formname = urlParams.get('formname') || 'default'
        const display = urlParams.get('display') || 'inline'

        setMauticFormProps({
          pid,
          formname,
          display,
          scriptSrc: oldScript.src
        })

        // Remove the script tag since MauticForm will handle it
        oldScript.remove()
        return
      }

      // Generic script handling for non-Mautic scripts
      const newScript = document.createElement('script')

      // Copy attributes (skip defer for external scripts so onload fires immediately)
      Array.from(oldScript.attributes).forEach((attr) => {
        if (attr.name !== 'defer' || !oldScript.src) {
          newScript.setAttribute(attr.name, attr.value)
        }
      })

      // Copy inline content
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent
      }

      newScript.onerror = () => {
        // eslint-disable-next-line no-console
        console.error('[BlockHtml] Script failed to load:', newScript.src)
      }

      // Replace old script with new one to execute it
      oldScript.parentNode.replaceChild(newScript, oldScript)
    })
  }, [theHtml])

  if (!theHtml) return null

  return (
    <>
      <div
        ref={containerRef}
        className="block-html"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: theHtml }}
      />
      {mauticFormProps && <MauticForm {...mauticFormProps} />}
    </>
  )
}
