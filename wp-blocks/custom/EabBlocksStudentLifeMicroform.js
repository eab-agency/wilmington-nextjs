import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { useEffect } from 'react'

const EabBlocksStudentLifeMicroform = (props) => {
  const {
    bgImageUrl,
    overlayGradient,
    overlayOpacity,
    showOverlay,
    className
  } = props.attributes || {}

  // Extract and execute scripts from renderedHtml
  useEffect(() => {
    if (props.renderedHtml) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(props.renderedHtml, 'text/html')
      const scripts = doc.querySelectorAll('script')

      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script')

        // Copy all attributes
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value)
        })

        // Copy inline script content if any
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent
        }

        // Append to body to execute
        document.body.appendChild(newScript)
      })

      // Cleanup function to remove scripts when component unmounts
      return () => {
        scripts.forEach((oldScript) => {
          const src = oldScript.getAttribute('src')
          if (src) {
            const existingScript = document.querySelector(
              `script[src="${src}"]`
            )
            if (existingScript) {
              existingScript.remove()
            }
          }
        })
      }
    }
  }, [props.renderedHtml])

  return (
    <div
      className={`${className ?? ''} ${
        showOverlay ? 'show-overlay' : ''
      } wp-block-eab-blocks-student-life-microform`}
      style={{ position: 'relative' }}
    >
      {bgImageUrl && (
        <figure>
          <img src={bgImageUrl} alt="" />
        </figure>
      )}

      {showOverlay && (
        <div
          className="overlay"
          style={{
            backgroundImage: overlayGradient,
            opacity: overlayOpacity,
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <WordPressBlocksViewer blocks={props?.children ?? []} />
      </div>
    </div>
  )
}

export default EabBlocksStudentLifeMicroform

EabBlocksStudentLifeMicroform.displayName = 'EabBlocksStudentLifeMicroform'

EabBlocksStudentLifeMicroform.fragments = {
  entry: gql`
    fragment EabBlocksStudentLifeMicroformFragment on EabBlocksStudentLifeMicroform {
      attributes {
        bgImageUrl
        className
        overlayColor
        overlayGradient
        overlayOpacity
        showOverlay
      }
      renderedHtml
      innerBlocks {
        name
      }
    }
  `,
  key: `EabBlocksStudentLifeMicroformFragment`
}
