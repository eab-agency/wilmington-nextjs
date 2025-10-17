'use client'
import { findScriptHandler } from '@/lib/scriptComponentRegistry'
import { useEffect, useMemo, useRef, useState } from 'react'
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
 * CRITICAL: HTML is sanitized BEFORE rendering to prevent script execution
 *
 * To add a new trusted script domain:
 * 1. Add the domain to src/config/allowedScriptDomains.js
 * 2. Get team approval before deploying
 */
export default function BlockHtml({ content, renderedHtml }) {
  const theHtml = content || renderedHtml
  const containerRef = useRef(null)
  const [specializedComponents, setSpecializedComponents] = useState([])

  // CRITICAL SECURITY FIX: Parse and sanitize HTML BEFORE rendering
  // This prevents scripts from executing before security checks can run
  const { sanitizedHtml, extractedScripts } = useMemo(() => {
    if (!theHtml) return { sanitizedHtml: '', extractedScripts: [] }

    const scripts = []

    // Extract all script tags and their attributes using regex
    // This works on both server and client
    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi
    let match

    while ((match = scriptRegex.exec(theHtml)) !== null) {
      const attributesString = match[1]
      const textContent = match[2]

      // Parse attributes
      const attributes = []
      const attrRegex = /(\w+)(?:=["']([^"']*)["'])?/g
      let attrMatch

      while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
        if (attrMatch[1]) {
          attributes.push({
            name: attrMatch[1],
            value: attrMatch[2] || ''
          })
        }
      }

      // Extract src if present
      const srcAttr = attributes.find((attr) => attr.name === 'src')

      scripts.push({
        src: srcAttr?.value || '',
        textContent: textContent,
        attributes: attributes
      })
    }

    // Remove all script tags from HTML
    const sanitizedHtml = theHtml.replace(
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      ''
    )

    // Debug logging
    if (scripts.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        '[BlockHtml] Extracted scripts before rendering:',
        scripts.length
      )
      // eslint-disable-next-line no-console
      console.log(
        '[BlockHtml] Original HTML length:',
        theHtml.length,
        'Sanitized:',
        sanitizedHtml.length
      )
    }

    // Return sanitized HTML (without scripts) and extracted script info
    return {
      sanitizedHtml,
      extractedScripts: scripts
    }
  }, [theHtml])

  useEffect(() => {
    if (!containerRef.current || extractedScripts.length === 0) return

    const componentsToRender = []

    extractedScripts.forEach((scriptInfo) => {
      // Generate unique ID for this script
      const scriptId =
        scriptInfo.src || scriptInfo.textContent?.substring(0, 50)

      // Skip if already processed globally
      if (window.__PROCESSED_SCRIPTS.has(scriptId)) {
        return
      }

      // SECURITY CHECK 1: Block inline scripts (no src attribute)
      if (!scriptInfo.src || scriptInfo.src.trim() === '') {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked inline script - all inline JavaScript is prohibited for security',
          { textContent: scriptInfo.textContent?.substring(0, 100) }
        )
        return
      }

      // SECURITY CHECK 2: Block scripts not on allowlist
      if (!isScriptAllowed(scriptInfo.src)) {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked script from unauthorized domain:',
          scriptInfo.src
        )
        return
      }

      // SECURITY CHECK 3: Block scripts that have both src and inline content
      // This prevents potential XSS via inline handlers even if src is allowed
      if (scriptInfo.textContent && scriptInfo.textContent.trim() !== '') {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked script with both src and inline content:',
          scriptInfo.src,
          { inlineContent: scriptInfo.textContent?.substring(0, 100) }
        )
        return
      }

      // SECURITY CHECK 4: Block scripts with inline event handlers in attributes
      const dangerousAttrs = ['onerror', 'onload', 'onreadystatechange']
      const hasDangerousAttr = scriptInfo.attributes.some((attr) =>
        dangerousAttrs.includes(attr.name.toLowerCase())
      )

      if (hasDangerousAttr) {
        // eslint-disable-next-line no-console
        console.warn(
          '[BlockHtml Security] Blocked script with inline event handler attributes:',
          scriptInfo.src,
          {
            attributes: scriptInfo.attributes.map((a) => a.name)
          }
        )
        return
      }

      // Mark as processed
      window.__PROCESSED_SCRIPTS.add(scriptId)

      // Create temporary script element to check for registered handler
      const tempScript = document.createElement('script')
      scriptInfo.attributes.forEach((attr) => {
        tempScript.setAttribute(attr.name, attr.value)
      })

      // Check if this script matches any registered handler
      const handler = findScriptHandler(tempScript)

      if (handler) {
        // Delegate to specialized component
        const props = handler.getProps(tempScript)
        componentsToRender.push({
          Component: handler.component,
          props,
          key: scriptId
        })
        return
      }

      // Generic script handling for unregistered scripts
      const newScript = document.createElement('script')

      // Copy attributes (skip defer for external scripts so onload fires immediately)
      scriptInfo.attributes.forEach((attr) => {
        if (attr.name !== 'defer' || !scriptInfo.src) {
          newScript.setAttribute(attr.name, attr.value)
        }
      })

      newScript.onerror = () => {
        // eslint-disable-next-line no-console
        console.error('[BlockHtml] Script failed to load:', newScript.src)
      }

      // Append to container to execute
      if (containerRef.current) {
        containerRef.current.appendChild(newScript)
      }
    })

    // Update state with all specialized components to render
    if (componentsToRender.length > 0) {
      setSpecializedComponents(componentsToRender)
    }
  }, [extractedScripts])

  if (!theHtml) return null

  return (
    <>
      <div
        ref={containerRef}
        className="block-html"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      {specializedComponents.map(({ Component, props, key }) => (
        <Component key={key} {...props} />
      ))}
    </>
  )
}
