'use client'
import { useEffect, useRef } from 'react'

// Global registry to prevent duplicate script processing
if (typeof window !== 'undefined') {
  window.__EAB_PROCESSED_SCRIPTS = window.__EAB_PROCESSED_SCRIPTS || new Set()
}

export default function BlockHtml({ content, renderedHtml }) {
  const theHtml = content || renderedHtml
  const containerRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[BlockHtml] useEffect running')

    if (!containerRef.current || !theHtml) {
      // eslint-disable-next-line no-console
      console.log('[BlockHtml] No container or HTML')
      return
    }

    const scriptTags = containerRef.current.querySelectorAll('script')

    // eslint-disable-next-line no-console
    console.log('[BlockHtml] Found', scriptTags.length, 'script tags')

    if (scriptTags.length === 0) return

    scriptTags.forEach((oldScript) => {
      // Generate unique ID for this script
      const scriptId = oldScript.src || oldScript.textContent?.substring(0, 50)

      // eslint-disable-next-line no-console
      console.log('[BlockHtml] Processing:', scriptId)

      // Skip if already processed globally
      if (window.__EAB_PROCESSED_SCRIPTS.has(scriptId)) {
        // eslint-disable-next-line no-console
        console.log('[BlockHtml] Already processed, removing')
        oldScript.remove()
        return
      }

      // Mark as processed
      window.__EAB_PROCESSED_SCRIPTS.add(scriptId)

      // eslint-disable-next-line no-console
      console.log('[BlockHtml] Creating new script element')

      // Create new script element
      const newScript = document.createElement('script')

      // Copy attributes (skip defer for external scripts)
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
        // eslint-disable-next-line no-console
        console.log('[BlockHtml] Detected EAB form script')

        const urlParams = new URLSearchParams(newScript.src.split('?')[1])
        const pid = urlParams.get('pid')
        const formname = urlParams.get('formname') || 'default'
        const display = urlParams.get('display') || 'inline'

        // eslint-disable-next-line no-console
        console.log('[BlockHtml] Setting onload handler for:', newScript.src)

        newScript.onload = () => {
          // eslint-disable-next-line no-console
          console.log('[EAB] Script loaded, PID:', pid)

          // Store parent reference before timeout (it might be removed from DOM)
          const scriptParent = newScript.parentNode
          const scriptNextSibling = newScript.nextSibling

          // Small delay to ensure EAB object is initialized
          setTimeout(() => {
            if (!window.EAB) {
              // eslint-disable-next-line no-console
              console.error('[EAB] window.EAB not found after script load')
              return
            }

            // Initialize
            window.EAB.form = window.EAB.form || {}
            window.EAB.form.processed = window.EAB.form.processed || {}

            // Check if form container already exists (better check)
            const existingContainer = document.querySelector(
              `div[data-form-id="${pid}"]`
            )
            if (existingContainer) {
              // eslint-disable-next-line no-console
              console.log('[EAB] Form container already exists, skipping')
              return
            }

            // eslint-disable-next-line no-console
            console.log('[EAB] Fetching form data...')

            // Fetch and load form
            fetch(`https://admiss.info/edu/v1/pid-data/${pid}.json`)
              .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
              })
              .then((data) => {
                // eslint-disable-next-line no-console
                console.log('[EAB] Form data:', data)

                const { current: { domain, form = null } = {} } = data

                // eslint-disable-next-line no-console
                console.log('[EAB] Form structure:', {
                  isArray: Array.isArray(form),
                  form,
                  formname
                })

                const formID = Array.isArray(form)
                  ? form.find((f) => f[formname])?.[formname]
                  : form

                // eslint-disable-next-line no-console
                console.log(
                  '[EAB] Domain:',
                  domain,
                  'FormID:',
                  formID,
                  'Display:',
                  display
                )

                // eslint-disable-next-line no-console
                console.log('[EAB] Condition check:', {
                  hasDomain: !!domain,
                  hasFormID: !!formID,
                  isInline: display === 'inline',
                  hasParent: !!scriptParent
                })

                if (domain && formID && display === 'inline' && scriptParent) {
                  // Create form container
                  const container = document.createElement('div')
                  container.dataset.formId = pid

                  // Append to parent (safer than insertBefore with potentially stale sibling)
                  scriptParent.appendChild(container)

                  // eslint-disable-next-line no-console
                  console.log('[EAB] Container created, loading Mautic form...')

                  // Mark as processed NOW (after container is created)
                  if (!window.EAB.form.processed[pid]) {
                    window.EAB.form.processed[pid] = {}
                  }
                  window.EAB.form.processed[pid][formname] = true

                  // Load Mautic form
                  const mauticScript = document.createElement('script')
                  mauticScript.src = `https://${domain}/form/generate.js?id=${formID}`

                  mauticScript.onload = () => {
                    // eslint-disable-next-line no-console
                    console.log('[EAB] Mautic form script loaded')
                  }

                  mauticScript.onerror = () => {
                    // eslint-disable-next-line no-console
                    console.error('[EAB] Mautic form script failed to load')
                  }

                  // Append Mautic script to parent
                  scriptParent.appendChild(mauticScript)
                } else if (!scriptParent) {
                  // eslint-disable-next-line no-console
                  console.error(
                    '[EAB] Script parent node is null - component may have unmounted'
                  )
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

      // Replace old script with new one
      // eslint-disable-next-line no-console
      console.log('[BlockHtml] Replacing script in DOM')
      oldScript.parentNode.replaceChild(newScript, oldScript)

      // eslint-disable-next-line no-console
      console.log('[BlockHtml] Script replaced successfully')
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
