'use client'
import { findScriptHandler } from '@/lib/scriptComponentRegistry'
import { useEffect, useRef, useState } from 'react'
import { isScriptAllowed } from './allowedScripts'

// Global registry to prevent duplicate script processing across component remounts
if (typeof window !== 'undefined') {
  window.__PROCESSED_SCRIPTS = window.__PROCESSED_SCRIPTS || new Set()
}

/**
 * BlockHtml Component
 *
 * Renders HTML content from WordPress with strict security controls.
 * Uses a registry-based approach to delegate third-party script rendering
 * to specialized components without hardcoding dependencies.
 *
 * SECURITY POLICY:
 * - ALL inline JavaScript is blocked (scripts without src attribute)
 * - External scripts are only allowed if their domain is on the allowlist
 *   (see: src/config/allowedScriptDomains.js)
 * - Scripts with both src and inline content are blocked
 * - Scripts with inline event handlers (onerror, onload, etc.) are blocked
 * - Only team-approved scripts can execute
 *
 * To add a new trusted script domain:
 * 1. Add the domain to src/config/allowedScriptDomains.js
 * 2. Get team approval before deploying
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

      // SECURITY CHECK 1: Block inline scripts (no src attribute)
      if (!oldScript.src || oldScript.src.trim() === '') {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked inline script - all inline JavaScript is prohibited for security',
          { textContent: oldScript.textContent?.substring(0, 100) }
        )
        oldScript.remove()
        return
      }

      // SECURITY CHECK 2: Block scripts not on allowlist
      if (!isScriptAllowed(oldScript.src)) {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked script from unauthorized domain:',
          oldScript.src
        )
        oldScript.remove()
        return
      }

      // SECURITY CHECK 3: Block scripts that have both src and inline content
      // This prevents potential XSS via inline handlers even if src is allowed
      if (oldScript.textContent && oldScript.textContent.trim() !== '') {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked script with both src and inline content:',
          oldScript.src,
          { inlineContent: oldScript.textContent?.substring(0, 100) }
        )
        oldScript.remove()
        return
      }

      // SECURITY CHECK 4: Block scripts with inline event handlers in attributes
      const dangerousAttrs = ['onerror', 'onload', 'onreadystatechange']
      const hasDangerousAttr = Array.from(oldScript.attributes).some((attr) =>
        dangerousAttrs.includes(attr.name.toLowerCase())
      )

      if (hasDangerousAttr) {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked script with inline event handler attributes:',
          oldScript.src,
          {
            attributes: Array.from(oldScript.attributes).map((a) => a.name)
          }
        )
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
