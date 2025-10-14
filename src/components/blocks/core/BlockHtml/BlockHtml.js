'use client'
import { findScriptHandler } from '@/lib/scriptComponentRegistry'
import { useEffect, useRef, useState } from 'react'

// Global registry to prevent duplicate script processing across component remounts
if (typeof window !== 'undefined') {
  window.__PROCESSED_SCRIPTS = window.__PROCESSED_SCRIPTS || new Set()
}

/**
 * BlockHtml Component
 *
 * Renders HTML content from WordPress and handles script execution.
 * Uses a registry-based approach to delegate third-party script rendering
 * to specialized components without hardcoding dependencies.
 */
export default function BlockHtml({ content, renderedHtml }) {
  const theHtml = content || renderedHtml
  const containerRef = useRef(null)
  const [specializedComponents, setSpecializedComponents] = useState([])

  useEffect(() => {
    if (!containerRef.current || !theHtml) return

    const scriptTags = containerRef.current.querySelectorAll('script')
    if (scriptTags.length === 0) return

    const componentsToRender = []

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

      // Check if this script matches any registered handler
      const handler = findScriptHandler(oldScript)

      if (handler) {
        // Delegate to specialized component
        const props = handler.getProps(oldScript)
        componentsToRender.push({
          Component: handler.component,
          props,
          key: scriptId
        })

        // Remove the script tag since the specialized component will handle it
        oldScript.remove()
        return
      }

      // Generic script handling for unregistered scripts
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

    // Update state with all specialized components to render
    if (componentsToRender.length > 0) {
      setSpecializedComponents(componentsToRender)
    }
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
      {specializedComponents.map(({ Component, props, key }) => (
        <Component key={key} {...props} />
      ))}
    </>
  )
}
