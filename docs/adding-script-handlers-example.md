# Adding New Script Handlers - Examples

This guide shows how to add support for new third-party scripts to the BlockHtml component using the script component registry.

## Example 1: Adding HubSpot Form Support

### Step 1: Create the specialized component

```javascript
// src/components/blocks/core/HubSpotForm/HubSpotForm.js
'use client'
import { useEffect, useRef } from 'react'

export default function HubSpotForm({ portalId, formId, region = 'na1' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!portalId || !formId) return

    // Load HubSpot forms script
    const script = document.createElement('script')
    script.src = '//js.hsforms.net/forms/v2.js'
    script.async = true

    script.onload = () => {
      if (window.hbspt && containerRef.current) {
        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target: containerRef.current
        })
      }
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [portalId, formId, region])

  return <div ref={containerRef} className="hubspot-form-container" />
}
```

### Step 2: Register the handler

```javascript
// src/lib/scriptComponentRegistry.js
import MauticForm from '@/components/blocks/core/MauticForm'
import HubSpotForm from '@/components/blocks/core/HubSpotForm'

export const SCRIPT_HANDLERS = [
  {
    // Mautic/EAB form handler
    test: (src) => src.includes('form.js?pid='),
    component: MauticForm,
    getProps: (script) => {
      const urlParams = new URLSearchParams(script.src.split('?')[1])
      return {
        pid: urlParams.get('pid'),
        formname: urlParams.get('formname') || 'default',
        display: urlParams.get('display') || 'inline',
        scriptSrc: script.src
      }
    }
  },
  {
    // HubSpot form handler
    test: (src) => src.includes('js.hsforms.net') || src.includes('hubspot'),
    component: HubSpotForm,
    getProps: (script) => {
      // Extract from data attributes or script content
      const portalId = script.dataset.portalId
      const formId = script.dataset.formId
      const region = script.dataset.region || 'na1'
      return { portalId, formId, region }
    }
  }
]
```

### Step 3: Done!

No changes needed to `BlockHtml.js`. The component will automatically detect and render HubSpot forms.

---

## Example 2: Adding Formstack Support

### Step 1: Create the component

```javascript
// src/components/blocks/core/FormstackForm/FormstackForm.js
'use client'
import { useEffect, useRef } from 'react'

export default function FormstackForm({ formId, server = 'www' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!formId) return

    const script = document.createElement('script')
    script.src = `https://${server}.formstack.com/forms/js.php/${formId}`
    script.async = true

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [formId, server])

  return <div ref={containerRef} className="formstack-form-container" />
}
```

### Step 2: Register the handler

```javascript
// src/lib/scriptComponentRegistry.js
import FormstackForm from '@/components/blocks/core/FormstackForm'

export const SCRIPT_HANDLERS = [
  // ... existing handlers ...
  {
    // Formstack form handler
    test: (src) => src.includes('formstack.com/forms'),
    component: FormstackForm,
    getProps: (script) => {
      // Extract form ID from URL: https://www.formstack.com/forms/js.php/12345
      const match = script.src.match(/\/forms\/js\.php\/(\d+)/)
      const formId = match ? match[1] : null
      const server = script.src.includes('https://')
        ? new URL(script.src).hostname.split('.')[0]
        : 'www'
      return { formId, server }
    }
  }
]
```

---

## Example 3: Adding Typeform Support

### Step 1: Create the component

```javascript
// src/components/blocks/core/TypeformEmbed/TypeformEmbed.js
'use client'
import { useEffect, useRef } from 'react'

export default function TypeformEmbed({ formId, height = '500px' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!formId) return

    const script = document.createElement('script')
    script.src = '//embed.typeform.com/next/embed.js'
    script.async = true

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [formId])

  return (
    <div
      ref={containerRef}
      data-tf-widget={formId}
      data-tf-iframe-props={`title=Form,height:${height}`}
      className="typeform-embed-container"
    />
  )
}
```

### Step 2: Register the handler

```javascript
// src/lib/scriptComponentRegistry.js
import TypeformEmbed from '@/components/blocks/core/TypeformEmbed'

export const SCRIPT_HANDLERS = [
  // ... existing handlers ...
  {
    // Typeform embed handler
    test: (src) => src.includes('embed.typeform.com'),
    component: TypeformEmbed,
    getProps: (script) => {
      const formId = script.dataset.tfWidget || script.dataset.formId
      const height = script.dataset.height || '500px'
      return { formId, height }
    }
  }
]
```

---

## Pattern Summary

For any new third-party script integration:

1. **Create a specialized component** that handles the script loading and rendering
2. **Add a handler to the registry** with:
   - `test`: Function to identify the script
   - `component`: Your specialized component
   - `getProps`: Function to extract props from the script element
3. **No changes to BlockHtml** required!

## Best Practices

- Keep specialized components focused on a single third-party integration
- Handle cleanup in `useEffect` return functions
- Use refs to avoid stale closures
- Add error handling for failed script loads
- Document any special requirements or limitations
- Test with actual WordPress content containing the scripts
