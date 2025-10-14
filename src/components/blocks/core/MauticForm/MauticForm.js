'use client'
import { useEffect, useRef } from 'react'

/**
 * MauticForm Component
 *
 * Handles rendering of EAB/Mautic forms by processing form.js scripts.
 * This component encapsulates all the brittle, third-party-specific logic
 * for loading and rendering Mautic forms.
 *
 * @param {Object} props
 * @param {string} props.pid - Partner ID from the form script URL
 * @param {string} props.formname - Form name (default: 'default')
 * @param {string} props.display - Display type ('inline' or 'modal')
 * @param {string} props.scriptSrc - Source URL of the form.js script
 */
export default function MauticForm({
  pid,
  formname = 'default',
  display = 'inline',
  scriptSrc
}) {
  const containerRef = useRef(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!pid || !scriptSrc || scriptLoadedRef.current) return

    scriptLoadedRef.current = true

    // Load the EAB form.js script
    const formScript = document.createElement('script')
    formScript.src = scriptSrc

    formScript.onload = () => {
      // Store container reference before async operations
      const container = containerRef.current

      // Poll for EAB object initialization instead of fixed timeout
      const waitForEabAndLoadForm = (retries = 10) => {
        if (retries <= 0) {
          // eslint-disable-next-line no-console
          console.error(
            '[MauticForm] EAB object not found after multiple attempts.'
          )
          return
        }

        if (!window.EAB) {
          // Retry after 200ms
          setTimeout(() => waitForEabAndLoadForm(retries - 1), 200)
          return
        }

        if (!container) return

        // Initialize EAB objects
        window.EAB.form = window.EAB.form || {}
        window.EAB.form.processed = window.EAB.form.processed || {}

        // Check if form already exists
        const existingContainer = document.querySelector(
          `div[data-form-id="${pid}"]`
        )
        if (existingContainer) return

        // Fetch form configuration and render
        fetch(`https://admiss.info/edu/v1/pid-data/${pid}.json`)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
          })
          .then((data) => {
            // Guard against unexpected API response structure
            if (!data?.current) {
              // eslint-disable-next-line no-console
              console.error(
                '[MauticForm] Invalid data structure from API:',
                data
              )
              return
            }

            const { current: { domain, form = null } = {} } = data

            const formID = Array.isArray(form)
              ? form.find((f) => f[formname])?.[formname]
              : form

            if (domain && formID && display === 'inline' && container) {
              // Create form container
              const formContainer = document.createElement('div')
              formContainer.dataset.formId = pid
              container.appendChild(formContainer)

              // Mark as processed
              if (!window.EAB.form.processed[pid]) {
                window.EAB.form.processed[pid] = {}
              }
              window.EAB.form.processed[pid][formname] = true

              // Load Mautic form script
              const mauticScript = document.createElement('script')
              mauticScript.src = `https://${domain}/form/generate.js?id=${formID}`
              container.appendChild(mauticScript)
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('[MauticForm] Error loading form:', error)
          })
      }

      // Start polling for EAB object
      waitForEabAndLoadForm()
    }

    formScript.onerror = () => {
      // eslint-disable-next-line no-console
      console.error('[MauticForm] Script failed to load:', scriptSrc)
    }

    // Append script to document
    document.body.appendChild(formScript)

    // Cleanup
    return () => {
      if (formScript.parentNode) {
        formScript.parentNode.removeChild(formScript)
      }
    }
  }, [pid, formname, display, scriptSrc])

  return <div ref={containerRef} className="mautic-form-container" />
}
