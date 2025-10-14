'use client'
import { useEffect, useRef } from 'react'

// Global registry to prevent duplicate script processing across component remounts
if (typeof window !== 'undefined') {
  window.__EAB_PROCESSED_SCRIPTS = window.__EAB_PROCESSED_SCRIPTS || new Set()
}

export default function BlockHtml({ content, renderedHtml }) {
  const theHtml = content || renderedHtml
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !theHtml) return

    const scriptTags = containerRef.current.querySelectorAll('script')
    if (scriptTags.length === 0) return

    scriptTags.forEach((oldScript) => {
      // Generate unique ID for this script
      const scriptId = oldScript.src || oldScript.textContent?.substring(0, 50)

      // Skip if already processed globally (prevents duplication from React Strict Mode)
      if (window.__EAB_PROCESSED_SCRIPTS.has(scriptId)) {
        oldScript.remove()
        return
      }

      // Mark as processed
      window.__EAB_PROCESSED_SCRIPTS.add(scriptId)

      // Create new script element
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

      // Special handling for EAB form scripts
      if (newScript.src && newScript.src.includes('form.js?pid=')) {
        const urlParams = new URLSearchParams(newScript.src.split('?')[1])
        const pid = urlParams.get('pid')
        const formname = urlParams.get('formname') || 'default'
        const display = urlParams.get('display') || 'inline'

        newScript.onload = () => {
          // Store parent reference before timeout (React may unmount and remove from DOM)
          const scriptParent = newScript.parentNode

          // Small delay to ensure EAB object is initialized
          setTimeout(() => {
            if (!window.EAB) return

            // Initialize EAB objects
            window.EAB.form = window.EAB.form || {}
            window.EAB.form.processed = window.EAB.form.processed || {}

            // Check if form container already exists
            const existingContainer = document.querySelector(
              `div[data-form-id="${pid}"]`
            )
            if (existingContainer) return

            // Fetch form configuration and load form
            fetch(`https://admiss.info/edu/v1/pid-data/${pid}.json`)
              .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
              })
              .then((data) => {
                const { current: { domain, form = null } = {} } = data

                const formID = Array.isArray(form)
                  ? form.find((f) => f[formname])?.[formname]
                  : form

                if (domain && formID && display === 'inline' && scriptParent) {
                  // Create form container
                  const container = document.createElement('div')
                  container.dataset.formId = pid
                  scriptParent.appendChild(container)

                  // Mark as processed
                  if (!window.EAB.form.processed[pid]) {
                    window.EAB.form.processed[pid] = {}
                  }
                  window.EAB.form.processed[pid][formname] = true

                  // Load Mautic form script
                  const mauticScript = document.createElement('script')
                  mauticScript.src = `https://${domain}/form/generate.js?id=${formID}`
                  scriptParent.appendChild(mauticScript)
                }
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('[EAB] Error loading form:', error)
              })
          }, 100)
        }

        newScript.onerror = () => {
          // eslint-disable-next-line no-console
          console.error('[EAB] Script failed to load:', newScript.src)
        }
      }

      // Replace old script with new one to execute it
      oldScript.parentNode.replaceChild(newScript, oldScript)
    })
  }, [theHtml])

  if (!theHtml) return null

  return (
    <div
      ref={containerRef}
      className="block-html"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: theHtml }}
    />
  )
}
